import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PatientProfileDto, PatientProfileService } from '../../../services/patient-profile/patient-profile';


@Component({
  selector: 'app-patient-profile',
  standalone: true,
  templateUrl: './patient-profile.html',
  styleUrls: ['./patient-profile.scss'],
  imports: [
    CommonModule,
    FormsModule,
    NzCardModule,
    NzButtonModule,
    NzModalModule,
    NzInputModule,
    NzIconModule,
    NzAlertModule,
    NzSpinModule,
    
  ]
})
export class PatientProfile implements OnInit, OnDestroy {
  loading = true;
  saving = false;
  errorMsg: string | null = null;

  editModalOpen = false;

  profile: PatientProfileDto | null = null;

  editForm = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    emergencyContactName: '',
    emergencyContactPhone: ''
  };

  private destroy$ = new Subject<void>();

  constructor(
    private patientProfileService: PatientProfileService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.fetchProfile();
  }

  fetchProfile(): void {
    this.loading = true;
    this.errorMsg = null;

    this.patientProfileService.getMyProfile()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.profile = res;
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.errorMsg = err?.error?.message || 'Failed to load profile.';
        }
      });
  }

  openEditModal(): void {
    if (!this.profile) return;

    this.editForm = {
      firstName: this.profile.firstName || '',
      lastName: this.profile.lastName || '',
      email: this.profile.email || '',
      phoneNumber: this.profile.phoneNumber || '',
      address: this.profile.address || '',
      emergencyContactName: this.profile.emergencyContactName || '',
      emergencyContactPhone: this.profile.emergencyContactPhone || ''
    };

    this.editModalOpen = true;
  }

  closeEditModal(): void {
    if (this.saving) return;
    this.editModalOpen = false;
  }

  saveProfile(): void {
    if (!this.editForm.firstName.trim() || !this.editForm.lastName.trim() || !this.editForm.email.trim()) {
      this.message.error('First name, last name, and email are required.');
      return;
    }

    this.saving = true;

    this.patientProfileService.updateMyProfile({
      firstName: this.editForm.firstName.trim(),
      lastName: this.editForm.lastName.trim(),
      email: this.editForm.email.trim(),
      phoneNumber: this.editForm.phoneNumber.trim() || null,
      address: this.editForm.address.trim() || null,
      emergencyContactName: this.editForm.emergencyContactName.trim() || null,
      emergencyContactPhone: this.editForm.emergencyContactPhone.trim() || null
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (updated) => {
        this.profile = updated;
        this.saving = false;
        this.editModalOpen = false;
        this.message.success('Profile updated successfully.');
      },
      error: (err) => {
        this.saving = false;
        this.message.error(err?.error?.message || 'Failed to update profile.');
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}