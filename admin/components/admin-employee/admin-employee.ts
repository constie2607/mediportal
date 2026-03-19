import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { StaffService, StaffUser, StaffUpdateRequest } from '../../../services/staff/staff';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzButtonModule,
    NzTagModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    ReactiveFormsModule,
    NzCardModule,
    NzListModule,
    NzIconModule,
    NzEmptyModule,
    NzSelectModule
  ],
  templateUrl: './admin-employee.html',
  styleUrls: ['./admin-employee.scss']
})
export class EmployeesComponent implements OnInit {
  loading = false;
  staff: StaffUser[] = [];

  editOpen = false;
  editForm!: FormGroup;
  selected?: StaffUser;

  constructor(
    private staffService: StaffService,
    private fb: FormBuilder,
    private msg: NzMessageService,
    private modal: NzModalService
  ) {}
  mode: 'create' | 'edit' = 'edit';

  ngOnInit(): void {
    this.editForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      address: ['', [Validators.required]],
      dateOfBirth: ['',[Validators.required]],
      phoneNumber: [''],
      email:['', [Validators.required]],
      role: ['', [Validators.required]]
    });

    this.loadStaff();
  }

  

  openEdit(user: StaffUser): void {
  this.mode = 'edit';
  this.selected = user;

  this.editForm.patchValue({
    firstName: user.firstName ?? '',
    lastName: user.lastName ?? '',
    address: user.address ?? '',
    email: user.email ?? '',
    dateOfBirth: user.dateOfBirth ?? '',
    phoneNumber: user.phoneNumber ?? '',
    role: user.role ?? ''
  });

  this.editOpen = true;
  }

  closeEdit(): void {
    this.editOpen = false;
    this.selected = undefined;
    this.editForm.reset();
  }

  saveEdit(): void {
    
  // If you accidentally opened edit without a selected user, fail gracefully
  if (!this.selected?.id) {
    this.msg.error('No staff member selected to update');
    return;
  }

  if (this.editForm.invalid) {
    this.editForm.markAllAsTouched();
    return;
  }

  // Ensure date format is LocalDate-friendly: "YYYY-MM-DD"
  const raw = this.editForm.value;

  const payload: StaffUpdateRequest = {
    ...raw,
    dateOfBirth: raw.dateOfBirth
      ? new Date(raw.dateOfBirth).toISOString().slice(0, 10)
      : null
  };

  this.loading = true;

  this.staffService.updateStaff(this.selected.id, payload).subscribe({
    next: (updated: any) => {
      this.loading = false;

      // depending on your API, the updated user might be returned or not
      const id = updated?.id ?? this.selected?.id;

      this.msg.success(`Staff updated. Id: ${id}`);
      this.closeEdit();
      this.loadStaff();
    },
    error: (err) => {
      this.loading = false;
      console.error('❌ updateStaff failed:', err);
      console.error('❌ payload sent:', payload);
      this.msg.error('Update failed');
    }
  });
}

  

  saveStaff(): void {
  if (this.editForm.invalid) {
    this.editForm.markAllAsTouched();
    return;
  }

  this.loading = true;
  const payload = this.editForm.value;

  // ✅ CREATE
  if (this.mode === 'create') {
    this.staffService.createStaff(payload).subscribe({
      next: (res) => {
        this.loading = false;
        this.msg.success(`Staff registered. Id: ${res.id}`, { nzDuration: 4000 });
        this.closeEdit();
        this.loadStaff();
      },
      error: (err) => {
        this.loading = false;
        console.error('❌ createStaff failed:', err);
        this.msg.error('Register staff failed');
      }
    });
    return;
  }

  // ✅ EDIT
  // if (!this.selected) {
  //   this.loading = false;
  //   return;
  // }

  // this.staffService.updateStaff(this.selected.id, payload).subscribe({
  //   next: () => {
  //     this.loading = false;
  //     this.msg.success('Staff updated');
  //     this.closeEdit();
  //     this.loadStaff();
  //   },
  //   error: (err) => {
  //     this.loading = false;
  //     console.error('❌ updateStaff failed:', err);
  //     this.msg.error('Update failed');
  //   }
  // });
}



  roleColor(role: string): string {
    if (role === 'SUPERADMIN') return 'gold';
    if (role === 'ADMIN') return 'blue';
    if (role === 'DOCTOR') return 'purple';
    if (role === 'NURSE') return 'green';
    if (role === 'RECEPTIONIST') return 'orange';

    return 'default';
  }

  openNewStaff() {
  // either open a modal (same form but empty) or route to a create page
  // easiest: reuse your edit modal with a "create mode"
   this.mode = 'create';
  this.selected = undefined;
  this.editForm.reset({
    firstName: '',
    lastName: '',
    address: '',
    dateOfBirth: '',
    phoneNumber: '',
    email: '',
    role: ''
  });
  this.editOpen = true;
}

loadStaff(): void {
    this.loading = true;
    this.staffService.getStaff().subscribe({
      next: (res: StaffUser[]) => {
        this.staff = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.msg.error('Failed to load staff');
      }
    });
  }

  onSubmit(): void {
  if (this.mode === 'create') {
    this.saveStaff();
  } else {
    this.saveEdit(); // or whatever your edit save method is called
  }
}
deleteStaff(id: string): void {
  this.loading = true;

  this.staffService.deleteStaff(id).subscribe({
    next: () => {
      this.loading = false;
      this.msg.success('Staff deleted');
      this.loadStaff();
    },
    error: (err) => {
      this.loading = false;
      console.error('❌ deleteStaff failed:', err);
      this.msg.error('Delete failed');
    }
  });
}



confirmDelete(s: any) {
  // use NzModalService.confirm ideally, then call delete API
  if (s.role === 'SUPERADMIN') {
  this.msg.warning('Super admin cannot be deleted');
  return;
}

   this.modal.confirm({
    nzTitle: 'Delete staff member',
    nzContent: `Are you sure you want to delete ${s.firstName} ${s.lastName}?`,
    nzOkDanger: true,
    nzOnOk: () => this.deleteStaff(s.id)
  });
}

}
