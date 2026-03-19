import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzMessageService } from 'ng-zorro-antd/message';
import { MedicalHistoryService } from '../../../services/medical-historyservice/medical-history';
import { AuthService } from '../../../services/auth';

type PatientMedicalHistoryResponse = Awaited<
  ReturnType<MedicalHistoryService['getMedicalHistory']> extends import('rxjs').Observable<infer T> ? T : never
>;

@Component({
  selector: 'app-patient-medical-history',
  standalone: true,
  templateUrl: './patient-medical-history.html',
  styleUrls: ['./patient-medical-history.scss'],
  imports: [
    CommonModule,
    FormsModule,
    NzSpinModule,
    NzAlertModule,
    NzCardModule,
    NzTabsModule,
    NzListModule,
    NzTagModule,
    NzBadgeModule,
    NzButtonModule,
    NzModalModule,
    NzInputModule,
    NzSelectModule,
    NzTableModule,
    NzTimelineModule,
  ]
})
export class PatientMedicalHistory implements OnInit, OnDestroy {
  loading = true;
  errorMsg: string | null = null;

  userId = '';
  data: PatientMedicalHistoryResponse | null = null;

  timelineFilter: 'ALL' | 'TRIAGE' = 'ALL';

  prescriptionRequestModalOpen = false;
  savingPrescriptionRequest = false;

  prescriptionRequestForm = {
    medicationName: '',
    requestedDosage: '',
    requestType: 'REPEAT',
    reason: ''
  };

  private destroy$ = new Subject<void>();

  constructor(
    private medicalHistoryService: MedicalHistoryService,
    private authService: AuthService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.authService.me()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => {
          this.userId = user?.id || user?.userId || '';

          if (!this.userId) {
            this.loading = false;
            this.errorMsg = 'Unable to determine current user.';
            return;
          }

          this.fetch();
        },
        error: () => {
          this.loading = false;
          this.errorMsg = 'Failed to retrieve user session.';
        }
      });
  }

  fetch(): void {
    this.loading = true;
    this.errorMsg = null;

    this.medicalHistoryService.getMedicalHistory(this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.data = {
            ...res,
            allergies: res.allergies ?? [],
            conditions: res.conditions ?? [],
            procedures: res.procedures ?? [],
            familyHistory: res.familyHistory ?? [],
            timeline: res.timeline ?? [],
            medications: (res as any).medications ?? [],
            prescriptionRequests: (res as any).prescriptionRequests ?? []
          };
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.errorMsg = err?.error?.message || 'Failed to load medical history.';
        }
      });
  }

  get allergyCount(): number {
    return this.data?.allergies?.length ?? 0;
  }

  get activeConditionCount(): number {
    return (this.data?.conditions ?? []).filter(
      c => (c.status ?? '').toUpperCase() === 'ACTIVE'
    ).length;
  }

  get activeMedications() {
    return ((this.data as any)?.medications ?? []).filter(
      (m: any) => (m.status ?? '').toUpperCase() === 'ACTIVE'
    );
  }

  get pastMedications() {
    return ((this.data as any)?.medications ?? []).filter(
      (m: any) => (m.status ?? '').toUpperCase() !== 'ACTIVE'
    );
  }

  get pendingRequests() {
    return ((this.data as any)?.prescriptionRequests ?? []).filter(
      (r: any) => (r.status ?? '').toUpperCase() === 'PENDING'
    );
  }

  get lastTriageDate(): string | null {
    const triage = (this.data?.timeline ?? [])
      .filter(t => t.type === 'TRIAGE')
      .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())[0];

    return triage?.dateTime ?? null;
  }

  get latestRequestDate(): string | null {
    const requests = ((this.data as any)?.prescriptionRequests ?? []);
    if (!requests.length) return null;

    const latest = [...requests].sort(
      (a: any, b: any) => new Date(b.requestedAt || '').getTime() - new Date(a.requestedAt || '').getTime()
    )[0];

    return latest?.requestedAt ?? null;
  }

  get requestableMedications() {
    const meds = ((this.data as any)?.medications ?? []);
    const unique: any[] = [];

    for (const med of meds) {
      const exists = unique.some(m => m.id === med.id);
      if (!exists) unique.push(med);
    }

    return unique;
  }

  filteredTimeline() {
    const items = this.data?.timeline ?? [];
    if (this.timelineFilter === 'ALL') return items;
    return items.filter(i => i.type === 'TRIAGE');
  }

  severityTagColor(sev?: string | null): string {
    const s = (sev ?? '').toUpperCase();
    if (s === 'HIGH') return 'red';
    if (s === 'MEDIUM') return 'orange';
    return 'green';
  }

  medicationStatusColor(status?: string | null): string {
    const s = (status ?? '').toUpperCase();
    if (s === 'ACTIVE') return 'blue';
    if (s === 'COMPLETED') return 'green';
    if (s === 'STOPPED') return 'default';
    return 'default';
  }

  requestStatusColor(status?: string | null): string {
    const s = (status ?? '').toUpperCase();
    if (s === 'APPROVED') return 'green';
    if (s === 'REJECTED') return 'red';
    if (s === 'FULFILLED') return 'blue';
    return 'orange';
  }

  statusBadge(status?: string | null): 'success' | 'processing' | 'default' | 'error' | 'warning' {
    const s = (status ?? '').toUpperCase();
    if (['CLOSED', 'RESOLVED', 'COMPLETED', 'APPROVED', 'FULFILLED'].includes(s)) return 'success';
    if (['SUBMITTED', 'OPEN', 'IN_REVIEW', 'IN_PROGRESS', 'PENDING'].includes(s)) return 'processing';
    if (['REJECTED', 'FAILED'].includes(s)) return 'error';
    return 'default';
  }

  openPrescriptionRequestModal(medication?: any): void {
    this.prescriptionRequestForm = {
      medicationName: medication?.medicationName ?? '',
      requestedDosage: medication?.dosage ?? '',
      requestType: 'REPEAT',
      reason: ''
    };
    this.prescriptionRequestModalOpen = true;
  }

  closePrescriptionRequestModal(): void {
    if (this.savingPrescriptionRequest) return;
    this.prescriptionRequestModalOpen = false;
  }

  savePrescriptionRequest(): void {
    if (!this.userId) return;

    if (!this.prescriptionRequestForm.medicationName.trim()) {
      this.message.error('Please select a medication.');
      return;
    }

    const allowed = this.requestableMedications.some(
      (m: any) => m.medicationName === this.prescriptionRequestForm.medicationName
    );

    if (!allowed) {
      this.message.error('You can only request medications already on your record.');
      return;
    }

    const payload = {
      medicationName: this.prescriptionRequestForm.medicationName.trim(),
      requestedDosage: this.prescriptionRequestForm.requestedDosage?.trim() || null,
      requestType: this.prescriptionRequestForm.requestType,
      reason: this.prescriptionRequestForm.reason?.trim() || null
    };

    this.savingPrescriptionRequest = true;

    this.medicalHistoryService.createPrescriptionRequest(this.userId, payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.savingPrescriptionRequest = false;
          this.prescriptionRequestModalOpen = false;
          this.message.success('Prescription request submitted.');
          this.fetch();
        },
        error: (err) => {
          this.savingPrescriptionRequest = false;
          this.message.error(err?.error?.message || 'Failed to submit prescription request.');
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}