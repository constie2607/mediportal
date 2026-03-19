import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared-module';
import { AuthService } from '../../services/auth';
import { AuthStateService } from '../../services/auth-state';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { AdminDashboard} from '../components/admin-dashboard/admin-dashboard';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedModule],
  templateUrl: './admin-login.html',
  styleUrls: ['./admin-login.scss']
})
export class AdminLoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private authState: AuthStateService,
    private message: NzMessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      remember: [false]
    });
  }

  submitForm(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const payload = this.loginForm.value;

    this.authService.loginAdmin(payload).subscribe({
      next: (user) => {
        this.loading = false;
         console.log('✅ loginAdmin response user:', user);
  console.log('✅ role:', user?.role);

  this.authState.setUser(user);
  console.log('✅ authState after setUser:', this.authState.getUser());
        

        // ✅ block non-admin accounts from using admin portal
        const role = user?.role;
        const isAdmin = role === 'ADMIN' || role === 'SUPERADMIN';

        if (!isAdmin) {
          this.message.error('This account is not an admin.', { nzDuration: 5000 });
          // optional: immediately log out to clear cookie
          this.authService.logout().subscribe({ next: () => {}, error: () => {} });
          return;
        }

        this.message.success('Admin login successful', { nzDuration: 3000 });
         this.authState.setUser(user);
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        console.error('❌ Admin login failed:', err);
        this.message.error('Invalid credentials.', { nzDuration: 5000 });
      }
    });
  }
}
