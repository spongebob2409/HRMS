import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink],
  template: `
    <nav class="top-nav">
      <div class="nav-logo">HR<span>MS</span></div>
      <div class="nav-links">
        <a class="nav-link" routerLink="/dashboard" [class.active]="isActive('/dashboard')">
          <mat-icon>dashboard</mat-icon> Dashboard
        </a>
        <a class="nav-link" routerLink="/employees" [class.active]="isActive('/employees')">
          <mat-icon>people</mat-icon> Employees
        </a>
        <a class="nav-link" routerLink="/salary" [class.active]="isActive('/salary')">
          <mat-icon>payments</mat-icon> Salary
        </a>
        <a class="nav-link" routerLink="/payroll" [class.active]="isActive('/payroll')">
          <mat-icon>receipt_long</mat-icon> Payroll
        </a>
      </div>
      <div class="nav-right">
        <div class="nav-user">
          <div class="nav-avatar">A</div>
          <span>Admin</span>
        </div>
        <button class="btn-secondary" style="padding:6px 12px;font-size:12px;" (click)="logout()">
          <mat-icon style="font-size:15px;width:15px;height:15px;">logout</mat-icon> Logout
        </button>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  constructor(private router: Router, private auth: AuthService) {}
  isActive(path: string) { return this.router.url === path; }
  logout() { this.auth.logout(); this.router.navigate(['/login']); }
}