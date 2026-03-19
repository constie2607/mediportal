import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth'; // adjust path

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzCardModule
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private msg: NzMessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]], // input type="date"
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { id, dateOfBirth, password, confirmPassword } = this.form.value;

    if (password !== confirmPassword) {
      this.msg.error('Passwords do not match');
      return;
    }

    this.loading = true;

    this.auth.activateAccount({ id, dateOfBirth, password }).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.msg.success(typeof res === 'string' ? res : 'Account activated. You can now log in.');

        // redirect to login
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        const backendMsg = err?.error;
        this.msg.error(typeof backendMsg === 'string' ? backendMsg : 'Activation failed');
      }
    });
  }
}
