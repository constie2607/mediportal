import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { PatientService, PatientUser, PatientCreateRequest } from '../../../../services/patient/patient';

@Component({
  selector: 'app-view-patients',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzButtonModule,
    NzIconModule,
    NzListModule,
    NzEmptyModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    ReactiveFormsModule,
    NzTagModule,
    RouterModule
  ],
  templateUrl: './view-patients.html',
  styleUrls: ['./view-patients.scss']
})
export class ViewPatients implements OnInit {
  searchForm!: FormGroup;
  loading = false;
  loadingFind = false;
  patients: PatientUser[] = [];
  foundPatient: PatientUser | null = null; // if exists -> edit mode


  modalOpen = false;
  saving = false;

  form!: FormGroup;

  constructor(
    private patientService: PatientService,
    private fb: FormBuilder,
    private msg: NzMessageService
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      dateOfBirth: ['', [Validators.required]] // yyyy-mm-dd
    });
    
    this.form = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]], // input type="date" => yyyy-mm-dd
      address: ['', [Validators.required]]
    });

    this.loadPatients();
  }

  loadPatients(): void {
    this.loading = true;
    this.patientService.getPatients().subscribe({
      next: (res) => {
        this.patients = res ?? [];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error('❌ getPatients failed:', err);
        this.msg.error('Failed to load patients');
      }
    });
  }

  openNewPatient(): void {
    this.form.reset();
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
    this.form.reset();
  }

   findPatient(): void {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      return;
    }

    const { email, dateOfBirth } = this.searchForm.value;

    this.loadingFind = true;
    this.patientService.findPatient(email, dateOfBirth).subscribe({
      next: (patient) => {
        this.loadingFind = false;
        this.foundPatient = patient;
        

        // populate edit form
        this.form.patchValue({
          firstName: patient.firstName ?? '',
          lastName: patient.lastName ?? '',
          email: patient.email ?? '',
          dateOfBirth: patient.dateOfBirth ?? dateOfBirth,
          gender: patient.gender ?? '',
          address: patient.address ?? '',
          phoneNumber: patient.phoneNumber ?? ''
        });

        // keep email locked while editing to avoid headaches
        this.form.get('email')?.disable();

        this.msg.success(`Patient found. Id: ${patient.id}`);
      },
      error: () => {
        this.loadingFind = false;
        this.foundPatient = null;

        // not found = create mode
        const { email, dateOfBirth } = this.searchForm.value;
        this.form.reset({
          email,
          dateOfBirth
        });

        this.form.get('email')?.disable(); // still lock email (optional)
        this.msg.info('Patient not found. You can register them now.');
      }
    });
  }

  clear(): void {
    this.foundPatient = null;
    this.searchForm.reset();
    this.form.reset();
    this.form.get('email')?.enable();
  }

  submitPatient(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: PatientCreateRequest = this.form.getRawValue();

    this.saving = true;

    this.patientService.createPatient(payload).subscribe({
      next: (created) => {
        this.saving = false;
        this.msg.success(`Patient registered. Id: ${created?.id ?? ''}`);
        this.closeModal();
        this.loadPatients();
      },
      error: (err) => {
        this.saving = false;
        console.error('❌ createPatient failed:', err);
        const backendMsg = err?.error;
        this.msg.error(typeof backendMsg === 'string' ? backendMsg : 'Register patient failed');
      }
    });
  }
}
