import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink],
  template: `
    <div class="sidebar">
      <div class="sidebar-logo">
        HR<span>MS</span>
        <small>Management System</small>
      </div>
      <nav class="sidebar-nav">
        <a class="nav-item" routerLink="/dashboard" [class.active]="isActive('/dashboard')">
          <mat-icon>dashboard</mat-icon> Dashboard
        </a>
        <a class="nav-item" routerLink="/employees" [class.active]="isActive('/employees')">
          <mat-icon>people</mat-icon> Employees
        </a>
        <a class="nav-item" routerLink="/salary" [class.active]="isActive('/salary')">
          <mat-icon>payments</mat-icon> Salary
        </a>
        <a class="nav-item" routerLink="/payroll" [class.active]="isActive('/payroll')">
          <mat-icon>receipt_long</mat-icon> Payroll
        </a>
      </nav>
      <div class="sidebar-footer">
        <a class="nav-item" (click)="logout()">
          <mat-icon>logout</mat-icon> Logout
        </a>
      </div>
    </div>
  `
})
export class SidebarComponent {
  constructor(private router: Router, private auth: AuthService) {}
  isActive(path: string) { return this.router.url === path; }
  logout() { this.auth.logout(); this.router.navigate(['/login']); }
}