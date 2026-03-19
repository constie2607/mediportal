import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  ValidatorFn,
  AbstractControl
} from '@angular/forms';

import { FormsModule } from '@angular/forms'; // ✅ needed because HTML uses [(ngModel)] on checkboxes

import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

import {
  AdminAvailabilityService,
  DoctorSchedule,
  ScheduleType
} from '../../../services/admin-availability/admin-availability';

type Doctor = { id: string; name: string };

@Component({
  selector: 'app-admin-schedule',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule, // ✅ IMPORTANT for [(ngModel)] checkboxes
    NzAlertModule,
    NzCardModule,
    NzButtonModule,
    NzTableModule,
    NzModalModule,
    NzSelectModule,
    NzTimePickerModule,
    NzTagModule,
    NzCheckboxModule,
    NzFormModule,
    NzInputModule
  ],
  templateUrl: './admin-staff-schedule.html',
  styleUrls: ['./admin-staff-schedule.scss']
})
export class AdminStaffSchedule implements OnInit {
  loading = false;

  // mock doctors (later from backend)
  doctors: Doctor[] = [ ];

  // Week view
  weekAnchor = new Date();
  days: Date[] = []; // Mon–Fri
  schedules: DoctorSchedule[] = [];

  // Modal (single)
  availabilityModalOpen = false;

  // Form used by modal (single)
  availabilityForm: FormGroup;

  // weekday toggles used in modal (matches HTML)
  dayChecks = [
    { key: 0, label: 'Mon', checked: true },
    { key: 1, label: 'Tue', checked: true },
    { key: 2, label: 'Wed', checked: true },
    { key: 3, label: 'Thu', checked: true },
    { key: 4, label: 'Fri', checked: true }
  ];

  constructor(
    private fb: FormBuilder,
    private api: AdminAvailabilityService,
    private msg: NzMessageService
  ) {
    // NOTE: start/end are Date objects for nz-time-picker
    this.availabilityForm = this.fb.group(
      {
        doctorId: [null, [Validators.required]],
        type: ['AVAILABLE' as ScheduleType, [Validators.required]],
        start: [new Date(0, 0, 0, 9, 0), []],
        end: [new Date(0, 0, 0, 17, 0), []],
        note: ['']
      },
      { validators: [this.timeRangeValidator()] }
    );
  }

  ngOnInit(): void {
    this.buildWeek(this.weekAnchor);
    this.loadWeek();
    this.loadDoctors();

    // Revalidate when type changes (AVAILABLE enforces times)
    this.availabilityForm.get('type')?.valueChanges.subscribe(() => {
      this.availabilityForm.updateValueAndValidity({ emitEvent: false });
    });
  }

  // ---------------- week helpers ----------------
  buildWeek(anchor: Date): void {
    const d = new Date(anchor);
    const day = d.getDay(); // 0 Sun .. 6 Sat
    const diffToMon = (day === 0 ? -6 : 1) - day;
    const monday = new Date(d);
    monday.setDate(d.getDate() + diffToMon);
    monday.setHours(0, 0, 0, 0);

    this.days = [];
    for (let i = 0; i < 5; i++) {
      const x = new Date(monday);
      x.setDate(monday.getDate() + i);
      this.days.push(x);
    }
  }

  ymd(date: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }

  prevWeek(): void {
    const d = new Date(this.weekAnchor);
    d.setDate(d.getDate() - 7);
    this.weekAnchor = d;
    this.buildWeek(d);
    this.loadWeek();
  }

  nextWeek(): void {
    const d = new Date(this.weekAnchor);
    d.setDate(d.getDate() + 7);
    this.weekAnchor = d;
    this.buildWeek(d);
    this.loadWeek();
  }

  // ---------------- load data ----------------
  loadWeek(): void {
    this.loading = true;

    const from = this.ymd(this.days[0]);
    const to = this.ymd(this.days[4]);

    this.api.week(from, to).subscribe({
      next: (res) => {
        this.schedules = res ?? [];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        const message =
          err?.error?.message ??
          (typeof err?.error === 'string' ? err.error : null) ??
          err?.message ??
          'Failed to load schedules';
        this.msg.error(message);
      }
    });
  }

  // Find schedule for doctor + day
  cell(doctorId: string, day: Date): DoctorSchedule | null {
    const dateStr = this.ymd(day);
    return this.schedules.find(s => s.doctorId === doctorId && s.date === dateStr) ?? null;
  }

  // ---------------- modal ----------------
  // open modal; doc can be null (top button)
  openAvailabilityModal(doc: Doctor | null): void {
    this.availabilityForm.reset({
      doctorId: doc?.id ?? null,
      type: 'AVAILABLE',
      start: new Date(0, 0, 0, 9, 0),
      end: new Date(0, 0, 0, 17, 0),
      note: ''
    });

    // default all weekdays on
    this.dayChecks.forEach(d => (d.checked = true));

    this.availabilityModalOpen = true;
  }

  closeAvailabilityModal(): void {
    this.availabilityModalOpen = false;
  }

  // Convert timepicker Date -> "HH:mm"
  private hhmm(t: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(t.getHours())}:${pad(t.getMinutes())}`;
  }

  private pickedDates(): string[] {
    return this.dayChecks
      .filter(x => x.checked)
      .map(x => this.ymd(this.days[x.key]));
  }

  submitAvailability(): void {
    if (this.availabilityForm.invalid) {
      this.availabilityForm.markAllAsTouched();
      this.msg.error('Please complete the form');
      return;
    }

    const dates = this.pickedDates();
    if (dates.length === 0) {
      this.msg.error('Pick at least one day');
      return;
    }

    const doctorId: string = this.availabilityForm.value.doctorId;
    const type: ScheduleType = this.availabilityForm.value.type;
    const note: string = (this.availabilityForm.value.note || '').trim();

    let startTime: string | undefined;
    let endTime: string | undefined;

    if (type === 'AVAILABLE') {
      startTime = this.hhmm(this.availabilityForm.value.start);
      endTime = this.hhmm(this.availabilityForm.value.end);
    } else {
      // TIME_OFF: backend can ignore times or store empty/null
      startTime = undefined;
      endTime = undefined;
    }

    this.api.bulk({
      doctorId,
      type,
      startTime,
      endTime,
      note,
      dates
    }).subscribe({
      next: () => {
        this.msg.success('Availability updated');
        this.availabilityModalOpen = false;
        this.loadWeek();
      },
      error: (err) => {
        const message =
          err?.error?.message ??
          (typeof err?.error === 'string' ? err.error : null) ??
          err?.message ??
          'Save failed';
        this.msg.error(message);
      }
    });
  }

  // ✅ Only enforce time validity when type === AVAILABLE
  private timeRangeValidator(): ValidatorFn {
    return (ctrl: AbstractControl) => {
      const type = ctrl.get('type')?.value as ScheduleType;
      if (type !== 'AVAILABLE') return null;

      const st = ctrl.get('start')?.value as Date | null;
      const et = ctrl.get('end')?.value as Date | null;
      if (!st || !et) return { timeRequired: true };

      const s = this.hhmm(st);
      const e = this.hhmm(et);
      if (e <= s) return { timeRange: true };

      return null;
    };
  }

  loadDoctors(): void {
  this.api.doctors().subscribe({
    next: (res) => this.doctors = res ?? [],
    error: (err) => this.msg.error(err?.error || 'Failed to load doctors')
  });
}
}