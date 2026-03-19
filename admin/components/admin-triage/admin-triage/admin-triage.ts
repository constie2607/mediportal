import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { NzTableModule } from 'ng-zorro-antd/table';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageService } from 'ng-zorro-antd/message';

import { AdminTriageService, AdminTriageView, TriageStatus } from '../../../../services/admin-triage/admin-triage';

type CloseReason = 'BOOKINGS_FULL' | 'APPOINTMENT_NOT_NEEDED' | 'OTHER';

@Component({
  selector: 'app-admin-triage',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    NzTableModule,
    NzCardModule,
    NzTagModule,
    NzButtonModule,
    NzDrawerModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzAlertModule
  ],
  templateUrl: './admin-triage.html',
  styleUrls: ['./admin-triage.scss']
})
export class AdminTriage implements OnInit {
  loading = false;

  tab: 'PENDING' | 'DONE' = 'PENDING';
  rows: AdminTriageView[] = [];

  drawerOpen = false;
  selected: AdminTriageView | null = null;

  // modals
  callModalOpen = false;
  closeModalOpen = false;

  callForm: FormGroup;
  closeForm: FormGroup;

  constructor(
    private api: AdminTriageService,
    private fb: FormBuilder,
    private msg: NzMessageService,
    private router: Router
  ) {
    this.callForm = this.fb.group({
      note: ['', [Validators.required, Validators.maxLength(800)]]
    });

    this.closeForm = this.fb.group({
      reason: ['BOOKINGS_FULL', [Validators.required]],
      note: ['']
    });
  }

  ngOnInit(): void {
    this.loadPending();
  }

  /** Used by HTML: closeReasonValue === 'OTHER' */
  get closeReasonValue(): string {
    return this.closeForm.get('reason')?.value || '';
  }

  private errorMessage(err: any, fallback = 'Request failed'): string {
    return (
      err?.error?.message ??
      (typeof err?.error === 'string' ? err.error : null) ??
      err?.message ??
      fallback
    );
  }

  statusTagColor(status?: TriageStatus): string {
    if (status === 'PENDING') return 'orange';
    if (status === 'CALL_ATTEMPTED') return 'gold';
    if (status === 'APPOINTMENT_ASSIGNED') return 'green';
    return 'blue';
  }

  setTab(tab: 'PENDING' | 'DONE'): void {
    this.tab = tab;
    if (tab === 'PENDING') this.loadPending();
    else this.loadDone();
  }

  private refreshCurrentTab(): void {
    if (this.tab === 'PENDING') this.loadPending();
    else this.loadDone();
  }

  loadPending(): void {
    this.loading = true;

    this.api.list('PENDING').subscribe({
      next: (res) => {
        this.rows = res ?? [];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.msg.error(this.errorMessage(err, 'Failed to load triage'));
      }
    });
  }

  loadDone(): void {
    this.loading = true;

    this.api.list().subscribe({
      next: (res) => {
        const arr = res ?? [];
        this.rows = arr.filter(x =>
          x.triage.status === 'APPOINTMENT_ASSIGNED' ||
          x.triage.status === 'CLOSED_NO_APPOINTMENT'
        );
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.msg.error(this.errorMessage(err, 'Failed to load triage'));
      }
    });
  }

  openRow(row: AdminTriageView): void {
    this.drawerOpen = true;
    this.selected = row;

    const triageId = row?.triage?.triageId;
    if (!triageId) {
      this.msg.error('Could not find triageId on selected row');
      return;
    }

    this.api.getOne(triageId).subscribe({
      next: (full) => (this.selected = full),
      error: (err) => this.msg.error(this.errorMessage(err, 'Failed to load triage details'))
    });
  }

  // --- CALL LOG ---
  openCallModal(): void {
    this.callForm.reset({ note: '' });
    this.callModalOpen = true;
  }

  submitCall(): void {
    if (!this.selected) return;

    const note = String(this.callForm.value.note || '').trim();
    if (!note) {
      this.msg.error('Please enter a note');
      return;
    }

    this.api.logCall(this.selected.triage.triageId, note).subscribe({
      next: (updated) => {
        this.selected = updated;
        this.callModalOpen = false;
        this.msg.success('Call note saved');
        this.refreshCurrentTab();
      },
      error: (err) => this.msg.error(this.errorMessage(err, 'Failed to save call note'))
    });
  }

  // --- ASSIGN (redirect only for now) ---
  goAssignAppointment(): void {
    if (!this.selected) return;

    // this.msg.info('Appointments page not built yet — redirect placeholder');
    // this.router.navigate(['/admin/appointments'], { queryParams: { triageId, patientId } });

    this.router.navigate(['/admin/appointments'], {
      queryParams: {
        triageId: this.selected.triage.triageId,
        patientId: this.selected.patient.id
      }
    });
  }

  // --- CLOSE ---
  openCloseModal(): void {
    this.closeForm.reset({ reason: 'BOOKINGS_FULL', note: '' });
    this.closeModalOpen = true;
  }

  submitClose(): void {
    if (!this.selected) return;

    const reason = (this.closeForm.value.reason || '') as CloseReason;
    const note = String(this.closeForm.value.note || '').trim();

    if (!reason) {
      this.msg.error('Please choose a reason');
      return;
    }

    if (reason === 'OTHER' && !note) {
      this.msg.error('Please enter a note for "Other"');
      return;
    }

    this.api.closeNoAppointment(this.selected.triage.triageId, { reason, note }).subscribe({
      next: () => {
        this.closeModalOpen = false;
        this.drawerOpen = false;
        this.selected = null;
        this.msg.success('Closed and removed from triage');
        this.refreshCurrentTab();
      },
      error: (err) => this.msg.error(this.errorMessage(err, 'Failed to close triage'))
    });
  }
}
