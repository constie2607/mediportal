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
import { NzMessageService } from 'ng-zorro-antd/message';
import { MedicalHistoryService } from '../../../services/medical-historyservice/medical-history';
import { AuthService } from '../../../services/auth';


type MedicationPageResponse = Awaited<
  ReturnType<MedicalHistoryService['getMedicalHistory']> extends import('rxjs').Observable<infer T> ? T : never
>;

@Component({
  selector: 'app-patient-medications',
  standalone: true,
  templateUrl: './patient-medication.html',
  styleUrls: ['./patient-medication.scss'],
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
  ]
})
export class PatientMedication implements OnInit, OnDestroy {
  loading = true;
  errorMsg: string | null = null;

  userId = '';
  data: MedicationPageResponse | null = null;

  prescriptionRequestModalOpen = false;
  savingPrescriptionRequest = false;

  prescriptionRequestForm = {
  medicationId: null as number | null,
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
            medications: res.medications ?? [],
            prescriptionRequests: res.prescriptionRequests ?? []
          };
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.errorMsg = err?.error?.message || 'Failed to load medications.';
        }
      });
  }

  get activeMedications() {
    return (this.data?.medications ?? []).filter(
      m => (m.status ?? '').toUpperCase() === 'ACTIVE'
    );
  }

  get pastMedications() {
    return (this.data?.medications ?? []).filter(
      m => (m.status ?? '').toUpperCase() !== 'ACTIVE'
    );
  }

  get pendingRequests() {
    return (this.data?.prescriptionRequests ?? []).filter(
      r => (r.status ?? '').toUpperCase() === 'PENDING'
    );
  }

  get latestRequestDate(): string | null {
    const requests = this.data?.prescriptionRequests ?? [];
    if (!requests.length) return null;

    const latest = [...requests].sort(
      (a, b) => new Date(b.requestedAt || '').getTime() - new Date(a.requestedAt || '').getTime()
    )[0];

    return latest?.requestedAt ?? null;
  }

  get requestableMedications() {
  const meds = this.data?.medications ?? [];

  const unique = meds.reduce((acc: any[], current: any) => {
    const exists = acc.some(m => m.id === current.id);
    if (!exists) acc.push(current);
    return acc;
  }, []);

  return unique;
}

openPrescriptionRequestModal(medication?: any): void {
  this.prescriptionRequestForm = {
    medicationId: medication?.id ?? null,
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
    m => m.medicationName === this.prescriptionRequestForm.medicationName
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

  requestStatusColor(status?: string | null): string {
    const s = (status ?? '').toUpperCase();
    if (s === 'APPROVED') return 'green';
    if (s === 'REJECTED') return 'red';
    if (s === 'FULFILLED') return 'blue';
    return 'orange';
  }

  medicationStatusColor(status?: string | null): string {
    const s = (status ?? '').toUpperCase();
    if (s === 'ACTIVE') return 'blue';
    if (s === 'COMPLETED') return 'green';
    if (s === 'STOPPED') return 'default';
    return 'default';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}