// book-appointment.ts (UPDATED)

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzDividerModule } from 'ng-zorro-antd/divider';

import { Triage } from '../../../../services/triage/triage';

type Priority = 'EMERGENCY' | 'URGENT' | 'ROUTINE' | 'SELF_CARE';

@Component({
  selector: 'app-book-appointment',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    NzCardModule,
    NzStepsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzUploadModule,
    NzIconModule,
    NzAlertModule,
    NzDividerModule
  ],
  templateUrl: './book-appointment.html',
  styleUrls: ['./book-appointment.scss']
})
export class BookAppointment implements OnInit {
  loading = false;
  step = 0; // 0=Emergency, 1=Problem, 2=More details, 3=Review
  form!: FormGroup;

  // Keep files client-side for now (no auto upload)
  fileList: any[] = [];

  priority: Priority = 'ROUTINE';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private triageService: Triage,
    private msg: NzMessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Build form
    this.form = this.fb.group({
      problem: ['', [Validators.required, Validators.maxLength(500)]],
      duration: ['', [Validators.required, Validators.maxLength(500)]],
      tried: ['', [Validators.maxLength(500)]],
      worried: ['', [Validators.maxLength(500)]],
      helpWanted: ['', [Validators.maxLength(500)]],
      bestTimes: ['', [Validators.maxLength(500)]]
    });

    // Read priority from URL (e.g. ?priority=URGENT)
    this.route.queryParamMap.subscribe(params => {
      const p = (params.get('priority') || 'ROUTINE').toUpperCase();

      if (['EMERGENCY', 'URGENT', 'ROUTINE', 'SELF_CARE'].includes(p)) {
        this.priority = p as Priority;
      } else {
        this.priority = 'ROUTINE';
      }

      // Optional UX: skip emergency step if not EMERGENCY
      if (this.priority !== 'EMERGENCY') {
        this.step = 1;
      } else {
        this.step = 0;
      }
    });
  }

  next(): void {
    // When leaving step 1 (health problem), validate required fields
    if (this.step === 1) {
      this.form.get('problem')?.markAsTouched();
      this.form.get('duration')?.markAsTouched();

      if (this.form.get('problem')?.invalid || this.form.get('duration')?.invalid) return;
    }

    if (this.step < 3) this.step += 1;
  }

  prev(): void {
    if (this.step > 0) this.step -= 1;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.value;

    this.loading = true;
    this.triageService.createRequest(payload).subscribe({
      next: () => {
        this.loading = false;
        this.msg.success('Request submitted');
        this.router.navigate(['/patient/dashboard']);
      },
      error: (err: any) => {
        this.loading = false;
        const message = typeof err?.error === 'string' ? err.error : 'Submit failed';
        this.msg.error(message);
      }
    });
  }

  // Prevent auto upload; store files locally
  beforeUpload = (file: any): boolean => {
    this.fileList = [...this.fileList, file].slice(0, 5);
    return false;
  };

  removeFile = (file: any): boolean => {
    this.fileList = this.fileList.filter(f => f.uid !== file.uid);
    return true;
  };

  count(field: string): number {
    return (this.form.get(field)?.value?.length ?? 0);
  }
}
