import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="min-height:100vh;display:flex;background:#f9fafb;">

      <!-- Left Panel -->
      <div style="flex:1;background:linear-gradient(135deg,#0ea5e9 0%,#0284c7 50%,#0369a1 100%);display:flex;flex-direction:column;justify-content:center;align-items:center;padding:48px;color:#fff;">
        <div style="max-width:360px;text-align:center;">
          <div style="font-size:48px;font-weight:700;letter-spacing:-1px;margin-bottom:8px;">
            HR<span style="color:#bae6fd;">MS</span>
          </div>
          <div style="font-size:18px;font-weight:400;opacity:0.85;margin-bottom:40px;">
            Human Resource Management System
          </div>
          <div style="display:flex;flex-direction:column;gap:20px;text-align:left;">
            <div style="display:flex;align-items:flex-start;gap:14px;">
              <div style="width:36px;height:36px;background:rgba(255,255,255,0.15);border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:18px;">👥</div>
              <div>
                <div style="font-weight:500;font-size:14px;">Employee Management</div>
                <div style="font-size:12px;opacity:0.7;margin-top:2px;">Add, edit and manage all employee records</div>
              </div>
            </div>
            <div style="display:flex;align-items:flex-start;gap:14px;">
              <div style="width:36px;height:36px;background:rgba(255,255,255,0.15);border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:18px;">💰</div>
              <div>
                <div style="font-weight:500;font-size:14px;">Salary Management</div>
                <div style="font-size:12px;opacity:0.7;margin-top:2px;">Configure salaries, bonuses and deductions</div>
              </div>
            </div>
            <div style="display:flex;align-items:flex-start;gap:14px;">
              <div style="width:36px;height:36px;background:rgba(255,255,255,0.15);border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:18px;">📋</div>
              <div>
                <div style="font-weight:500;font-size:14px;">Payroll Generation</div>
                <div style="font-size:12px;opacity:0.7;margin-top:2px;">Auto-generate payroll with tax calculations</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Panel -->
      <div style="width:480px;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:48px;background:#fff;">
        <div style="width:100%;max-width:360px;">

          <div style="margin-bottom:32px;">
            <h1 style="font-size:24px;font-weight:700;color:#111827;margin:0 0 8px;">Welcome back</h1>
            <p style="font-size:14px;color:#9ca3af;margin:0;">Sign in to your HRMS account</p>
          </div>

          <div style="display:flex;flex-direction:column;gap:16px;">

            <div>
              <label style="font-size:13px;font-weight:500;color:#374151;display:block;margin-bottom:6px;">Username</label>
              <div style="position:relative;">
                <span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#9ca3af;font-size:16px;">👤</span>
                <input
                  [(ngModel)]="username"
                  (keyup.enter)="login()"
                  placeholder="Enter your username"
                  autocomplete="username"
                  style="width:100%;padding:11px 14px 11px 38px;border:1.5px solid #e5e7eb;border-radius:10px;font-size:14px;outline:none;color:#111827;box-sizing:border-box;transition:border-color 0.15s;"
                  (focus)="$event.target.style.borderColor='#0ea5e9'"
                  (blur)="$event.target.style.borderColor='#e5e7eb'">
              </div>
            </div>

            <div>
              <label style="font-size:13px;font-weight:500;color:#374151;display:block;margin-bottom:6px;">Password</label>
              <div style="position:relative;">
                <span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#9ca3af;font-size:16px;">🔒</span>
                <input
                  [(ngModel)]="password"
                  [type]="showPassword ? 'text' : 'password'"
                  (keyup.enter)="login()"
                  placeholder="Enter your password"
                  autocomplete="current-password"
                  style="width:100%;padding:11px 44px 11px 38px;border:1.5px solid #e5e7eb;border-radius:10px;font-size:14px;outline:none;color:#111827;box-sizing:border-box;transition:border-color 0.15s;"
                  (focus)="$event.target.style.borderColor='#0ea5e9'"
                  (blur)="$event.target.style.borderColor='#e5e7eb'">
                <button (click)="showPassword=!showPassword"
                  style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:#9ca3af;font-size:18px;padding:0;line-height:1;">
                  {{showPassword ? 'Hide' : 'Show'}}
                </button>
              </div>
            </div>

            <div *ngIf="errorMsg"
              style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:10px 14px;font-size:13px;color:#dc2626;display:flex;align-items:center;gap:8px;">
              ⚠️ {{errorMsg}}
            </div>

            <button (click)="login()" [disabled]="loading"
              style="width:100%;padding:12px;background:#0ea5e9;color:#fff;border:none;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;transition:background 0.15s;margin-top:4px;"
              [style.background]="loading ? '#7dd3fc' : '#0ea5e9'">
              {{loading ? 'Signing in...' : 'Sign In'}}
            </button>

          </div>

          <div style="margin-top:32px;padding-top:24px;border-top:1px solid #f3f4f6;text-align:center;">
            <p style="font-size:12px;color:#9ca3af;margin:0;">
              AIUB — Software Development Department
            </p>
          </div>
        </div>
      </div>

    </div>
  `
})
export class LoginComponent {
  username = '';
  password = '';
  showPassword = false;
  loading = false;
  errorMsg = '';

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    if (!this.username || !this.password) {
      this.errorMsg = 'Please enter both username and password';
      return;
    }
    this.loading = true;
    this.errorMsg = '';

    this.auth.login({ username: this.username, password: this.password }).subscribe({
      next: (res) => {
        this.auth.saveToken(res.token);
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.errorMsg = 'Invalid username or password. Please try again.';
        this.loading = false;
      }
    });
  }
}