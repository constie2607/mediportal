import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTagModule } from 'ng-zorro-antd/tag';

import { AdminTriageService, AdminTriageView } from '../../../../services/admin-triage/admin-triage';
import { AdminAvailabilityService, DoctorSchedule } from '../../../../services/admin-availability/admin-availability';

type Doctor = { id: string; name: string };

type Appointment = {
  appointmentId: string;
  doctorId: string;
  userId: string;
  dateTime: string; // ISO
  type: string;
  note?: string | null;
};

type Slot = {
  startIso: string;       // "YYYY-MM-DDTHH:mm"
  label: string;          // "09:00"
  available: boolean;
  booked: boolean;
  bookedAppointment?: Appointment;
};

@Component({
  selector: 'app-admin-appointments',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    NzCardModule,
    NzSelectModule,
    NzDatePickerModule,
    NzButtonModule,
    NzSpinModule,
    NzModalModule,
    NzTagModule
  ],
  templateUrl: './admin-appointments.html',
  styleUrls: ['./admin-appointments.scss']
})
export class AdminAppointments implements OnInit {
  loading = false;

  triageId = '';
  patientId = '';
  triageView: AdminTriageView | null = null;

  allDoctors: Doctor[] = [];

  form: FormGroup;

  // week + grid
  days: Date[] = [];
  times: string[] = [
    '09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30',
    '13:00','13:30','14:00','14:30','15:00','15:30','16:00'
  ];
  grid: Slot[][] = [];
  selectedSlot: Slot | null = null;

  // backend data
  schedules: DoctorSchedule[] = [];
  appointments: Appointment[] = [];

  // booked slot modal
  bookedModalOpen = false;
  bookedSlotIso = '';
  bookedAppointment: Appointment | null = null;

  private apptBaseUrl = 'http://localhost:8080/api/admin'; // uses /appointments endpoint below

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private msg: NzMessageService,
    private triageApi: AdminTriageService,
    private availabilityApi: AdminAvailabilityService,
    private http: HttpClient
  ) {
    this.form = this.fb.group({
      doctorId: [null, [Validators.required]],
      date: [new Date(), [Validators.required]],
      type: ['PHONE', [Validators.required]],
      note: ['']
    });
  }

  // typed getters for template safety
  get doctorIdCtrl(): FormControl { return this.form.get('doctorId') as FormControl; }
  get dateCtrl(): FormControl { return this.form.get('date') as FormControl; }
  get typeCtrl(): FormControl { return this.form.get('type') as FormControl; }
  get noteCtrl(): FormControl { return this.form.get('note') as FormControl; }

  ngOnInit(): void {
    this.triageId = this.route.snapshot.queryParamMap.get('triageId') || '';
    this.patientId = this.route.snapshot.queryParamMap.get('patientId') || '';

    if (!this.triageId) {
      this.msg.error('Missing triageId in URL');
      return;
    }

    this.loadTriage();
    this.buildWeek(this.form.value.date);
    this.loadDoctors();

    // when doctor changes: reload week data
    this.form.get('doctorId')?.valueChanges.subscribe(() => {
      this.selectedSlot = null;
      this.reloadWeekData();
    });

    // when date changes: change week + reload
    this.form.get('date')?.valueChanges.subscribe((d: Date) => {
      if (!d) return;
      this.selectedSlot = null;
      this.buildWeek(d);
      this.reloadWeekData();
    });
  }

  private extractErr(err: any, fallback: string): string {
    return (
      err?.error?.message ??
      (typeof err?.error === 'string' ? err.error : null) ??
      err?.message ??
      fallback
    );
  }

  private loadTriage(): void {
    this.loading = true;
    this.triageApi.getOne(this.triageId).subscribe({
      next: (res) => {
        this.triageView = res;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.msg.error(this.extractErr(err, 'Failed to load triage details'));
      }
    });
  }

  // private loadDoctors(): void {
  //   this.loading = true;
  //   this.availabilityApi.doctors().subscribe({
  //     next: (res) => {
  //       // map whatever your backend returns into {id,name}
  //       this.allDoctors = (res ?? []).map((d: any) => ({
  //         id: d.id,
  //         name: d.fullName ?? `${d.firstName ?? ''} ${d.lastName ?? ''}`.trim() ?? d.email ?? 'Doctor'
  //       }));

  //       if (!this.form.value.doctorId && this.allDoctors.length) {
  //         this.form.patchValue({ doctorId: this.allDoctors[0].id }, { emitEvent: false });
  //       }

  //       this.loading = false;
  //       this.reloadWeekData();
  //     },
  //     error: (err) => {
  //       this.loading = false;
  //       this.msg.error(this.extractErr(err, 'Failed to load doctors'));
  //     }
  //   });
  // }

  private loadDoctors(): void {
  this.loading = true;

  this.http.get<any[]>(`http://localhost:8080/api/admin/appointments/doctors`, { withCredentials: true })
    .subscribe({
      next: (res) => {
        this.allDoctors = (res ?? []).map((d: any) => ({
          id: d.id,
          name: d.name ?? d.fullName ?? d.email ?? 'Doctor'
        }));

        if (!this.form.value.doctorId && this.allDoctors.length) {
          this.form.patchValue({ doctorId: this.allDoctors[0].id }, { emitEvent: false });
        }

        this.loading = false;
        this.reloadWeekData();
      },
      error: (err) => {
        this.loading = false;
        this.msg.error(this.extractErr(err, 'Failed to load doctors'));
      }
    });
}

  private reloadWeekData(): void {
    const doctorId = this.form.value.doctorId;
    if (!doctorId || this.days.length === 0) {
      this.buildGrid();
      return;
    }

    const from = this.ymd(this.days[0]);
    const to = this.ymd(this.days[4]);

    this.loading = true;

    // 1) load schedules for the week
    this.availabilityApi.week(from, to).subscribe({
      next: (sched) => {
        this.schedules = sched ?? [];

        // 2) load appointments booked for THIS doctor + THIS week
        this.loadAppointments(doctorId, from, to);
      },
      error: (err) => {
        this.loading = false;
        this.msg.error(this.extractErr(err, 'Failed to load schedules'));
        this.buildGrid();
      }
    });
  }

  private loadAppointments(doctorId: string, from: string, to: string): void {
    this.http.get<Appointment[]>(`${this.apptBaseUrl}/appointments`, {
      withCredentials: true,
      params: { doctorId, from, to }
    }).subscribe({
      next: (apps) => {
        this.appointments = apps ?? [];
        this.loading = false;
        this.buildGrid();
      },
      error: (err) => {
        this.loading = false;
        this.msg.error(this.extractErr(err, 'Failed to load booked appointments'));
        this.appointments = [];
        this.buildGrid();
      }
    });
  }

  // ---------- week helpers ----------
  private buildWeek(anchor: Date): void {
    const d = new Date(anchor);
    const day = d.getDay(); // 0 Sun..6 Sat
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

  private ymd(date: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }

  private combine(day: Date, hhmm: string): string {
    const [hh, mm] = hhmm.split(':').map(Number);
    const d = new Date(day);
    d.setHours(hh, mm, 0, 0);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(hh)}:${pad(mm)}`;
  }

  // ---------- CORE: build grid using selected doctor + schedules + bookings ----------
  private buildGrid(): void {
    const doctorId: string | null = this.form.value.doctorId;
    const doctorSchedules = this.schedules.filter(s => s.doctorId === doctorId);

    // helper: find schedule for a date
    const scheduleFor = (dateStr: string): DoctorSchedule | null => {
      return doctorSchedules.find(s => s.date === dateStr) ?? null;
    };

    // helper: find booking for datetime iso
    const bookingFor = (iso: string): Appointment | null => {
      // backend saves with seconds maybe; normalize
      const match = this.appointments.find(a => {
        const aIso = (a.dateTime || '').slice(0, 16); // "YYYY-MM-DDTHH:mm"
        return aIso === iso;
      });
      return match ?? null;
    };

    this.grid = this.times.map((t) => {
      return this.days.map((day) => {
        const startIso = this.combine(day, t);
        const dateStr = this.ymd(day);

        const sched = scheduleFor(dateStr);

        // default: unavailable
        let available = false;

        // If TIME_OFF => unavailable
        if (sched && sched.type === 'TIME_OFF') {
          available = false;
        }

        // If AVAILABLE => only within start/end
        if (sched && sched.type === 'AVAILABLE') {
          const st = (sched.startTime || '').slice(0,5);
          const et = (sched.endTime || '').slice(0,5);
          if (st && et) {
            available = (t >= st && t < et);
          }
        }

        // If no schedule at all => unavailable
        if (!sched) available = false;

        // booked overrides availability
        const bookedAppt = bookingFor(startIso);
        const booked = !!bookedAppt;
        if (booked) available = false;

        return {
          startIso,
          label: t,
          available,
          booked,
          bookedAppointment: bookedAppt ?? undefined
        };
      });
    });
  }

  // click slot
  onSlotClick(slot: Slot): void {
    if (slot.booked) {
      this.bookedSlotIso = slot.startIso;
      this.bookedAppointment = slot.bookedAppointment ?? null;
      this.bookedModalOpen = true;
      return;
    }

    if (!slot.available) return;

    this.selectedSlot = slot;
  }

  // // confirm booking
  // confirm(): void {
  //   if (this.form.invalid) {
  //     this.form.markAllAsTouched();
  //     this.msg.error('Please select doctor + type');
  //     return;
  //   }
  //   if (!this.selectedSlot) {
  //     this.msg.error('Please select an available slot');
  //     return;
  //   }

  //   const payload = {
  //     doctorId: this.form.value.doctorId,          // ✅ IMPORTANT for correlating
  //     dateTime: this.selectedSlot.startIso,
  //     type: this.form.value.type,
  //     note: (this.form.value.note || '').trim()
  //   };

  //   this.loading = true;

  //   // uses your backend: /api/admin/triage-requests/{triageId}/assign-appointment
  //   this.triageApi.assignAppointment(this.triageId, payload).subscribe({
  //     next: () => {
  //       this.msg.success('Appointment booked!');
  //       // reload bookings from backend so refresh is correct too
  //       const from = this.ymd(this.days[0]);
  //       const to = this.ymd(this.days[4]);
  //       this.loadAppointments(this.form.value.doctorId, from, to);
  //       this.selectedSlot = null;
  //     },
  //     error: (err) => {
  //       this.loading = false;
  //       this.msg.error(this.extractErr(err, 'Booking failed'));
  //     }
  //   });
  // }

  confirm(): void {
      if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.msg.error('Please select doctor + type');
      return;
    }
    if (!this.selectedSlot) {
      this.msg.error('Please select an available slot');
      return;
    }

  const payload = {
    triageId: this.triageId,               // REQUIRED by backend
    doctorId: this.form.value.doctorId,
    dateTime: this.selectedSlot.startIso,
    type: this.form.value.type,
    note: (this.form.value.note || '').trim()
  };

  this.loading = true;

  this.http.post(`${this.apptBaseUrl}/appointments/book`, payload, { withCredentials: true })
    .subscribe({
      next: () => {
        this.msg.success('Appointment booked!');
        const from = this.ymd(this.days[0]);
        const to = this.ymd(this.days[4]);
        this.loadAppointments(this.form.value.doctorId, from, to);
        this.selectedSlot = null;
      },
      error: (err) => {
        this.loading = false;
        this.msg.error(this.extractErr(err, 'Booking failed'));
      }
    });
}
}