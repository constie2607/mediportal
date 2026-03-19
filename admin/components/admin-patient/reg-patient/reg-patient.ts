import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PatientService, PatientUser } from '../../../../services/patient/patient';

@Component({
  selector: 'app-register-patient',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzCardModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule
  ],
  templateUrl: './reg-patient.html',
  styleUrls: ['./reg-patient.scss']
})
export class RegPatient implements OnInit {
  searchForm!: FormGroup;
  form!: FormGroup;

  loadingFind = false;
  saving = false;

  foundPatient: PatientUser | null = null; // if exists -> edit mode

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
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
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]], // locked once found
      dateOfBirth: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      address: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]]
    });
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

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // use getRawValue because email is disabled
    const payload = this.form.getRawValue();

    this.saving = true;

    // EDIT mode
    if (this.foundPatient?.id) {
      this.patientService.updatePatient(this.foundPatient.id, payload).subscribe({
        next: (updated) => {
          this.saving = false;
          this.msg.success(`Patient updated. Id: ${updated.id}`);
          this.foundPatient = updated; // refresh local
        },
        error: (err) => {
          this.saving = false;
          console.error('❌ updatePatient failed:', err);
          this.msg.error('Update failed');
        }
      });
      return;
    }

    // CREATE mode
    this.patientService.createPatient(payload).subscribe({
      next: (created) => {
        this.saving = false;
        this.msg.success(`Patient registered. Id: ${created.id}`);
        this.foundPatient = created;
      },
      error: (err) => {
        this.saving = false;
        console.error('❌ createPatient failed:', err);
        this.msg.error('Register failed');
      }
    });
  }

  clear(): void {
    this.foundPatient = null;
    this.searchForm.reset();
    this.form.reset();
    this.form.get('email')?.enable();
  }
}
