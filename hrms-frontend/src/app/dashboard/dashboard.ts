import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatToolbarModule],
  template: `
    <mat-toolbar color="primary">
      <span>HRMS - Human Resource Management System</span>
      <span class="spacer"></span>
      <button mat-button (click)="logout()">
        <mat-icon>logout</mat-icon> Logout
      </button>
    </mat-toolbar>

    <div class="dashboard-container">
      <h2>Welcome to HRMS Dashboard</h2>
      <div class="cards">
        <mat-card (click)="navigate('/employees')">
          <mat-card-content>
            <mat-icon>people</mat-icon>
            <h3>Employees</h3>
            <p>Manage employee records</p>
          </mat-card-content>
        </mat-card>

        <mat-card (click)="navigate('/salary')">
          <mat-card-content>
            <mat-icon>attach_money</mat-icon>
            <h3>Salary</h3>
            <p>Manage salary details</p>
          </mat-card-content>
        </mat-card>

        <mat-card (click)="navigate('/payroll')">
          <mat-card-content>
            <mat-icon>receipt</mat-icon>
            <h3>Payroll</h3>
            <p>Generate monthly payroll</p>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .spacer { flex: 1; }
    .dashboard-container { padding: 32px; }
    .cards { display: flex; gap: 24px; margin-top: 24px; flex-wrap: wrap; }
    mat-card { width: 200px; cursor: pointer; text-align: center; padding: 16px; }
    mat-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
    mat-icon { font-size: 48px; width: 48px; height: 48px; color: #1976d2; }
    h3 { margin: 8px 0 4px; }
    p { color: #666; font-size: 13px; }
  `]
})
export class DashboardComponent {
  constructor(private auth: AuthService, private router: Router) {}
  navigate(path: string) { this.router.navigate([path]); }
  logout() { this.auth.logout(); this.router.navigate(['/login']); }
}