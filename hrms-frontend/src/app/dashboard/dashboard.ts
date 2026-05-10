import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from '../shared/navbar/navbar';
import { EmployeeService } from '../services/employee';
import { SalaryService } from '../services/salary';
import { PayrollService } from '../services/payroll';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule, NavbarComponent],
  template: `
    <div class="page-container">
      <app-navbar></app-navbar>
      <div class="content-area">
        <div class="page-header">
          <div>
            <div class="page-title">Dashboard</div>
            <div class="page-subtitle">Welcome back! Here's what's happening.</div>
          </div>
        </div>

        <div class="stat-cards">
          <div class="stat-card">
            <div class="stat-icon" style="background:#f0f9ff;color:#0ea5e9;">
              <mat-icon>people</mat-icon>
            </div>
            <div>
              <div class="stat-label">Total Employees</div>
              <div class="stat-value">{{totalEmployees}}</div>
              <div class="stat-sub">Active staff</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background:#f0fdf4;color:#16a34a;">
              <mat-icon>payments</mat-icon>
            </div>
            <div>
              <div class="stat-label">Total Net Payroll</div>
              <div class="stat-value">Tk. {{totalNet | number:'1.0-0'}}</div>
              <div class="stat-sub">All time</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background:#fef9c3;color:#ca8a04;">
              <mat-icon>account_balance</mat-icon>
            </div>
            <div>
              <div class="stat-label">Total Tax</div>
              <div class="stat-value">Tk. {{totalTax | number:'1.0-0'}}</div>
              <div class="stat-sub">10% deducted</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background:#fdf4ff;color:#a21caf;">
              <mat-icon>receipt_long</mat-icon>
            </div>
            <div>
              <div class="stat-label">Salary Records</div>
              <div class="stat-value">{{totalSalaries}}</div>
              <div class="stat-sub">Configured</div>
            </div>
          </div>
        </div>

        <div class="section-card">
          <div class="section-header">
            <div>
              <h3>Quick Actions</h3>
              <p>Navigate to any module quickly</p>
            </div>
          </div>
          <div style="padding:20px;display:flex;gap:12px;flex-wrap:wrap;">
            <button class="btn-primary" (click)="router.navigate(['/employees'])">
              <mat-icon style="font-size:16px;width:16px;height:16px;">people</mat-icon>
              Manage Employees
            </button>
            <button class="btn-secondary" (click)="router.navigate(['/salary'])">
              <mat-icon style="font-size:16px;width:16px;height:16px;">payments</mat-icon>
              Manage Salary
            </button>
            <button class="btn-secondary" (click)="router.navigate(['/payroll'])">
              <mat-icon style="font-size:16px;width:16px;height:16px;">receipt_long</mat-icon>
              Generate Payroll
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  totalEmployees = 0;
  totalSalaries = 0;
  totalNet = 0;
  totalTax = 0;

  constructor(
    public router: Router,
    private empService: EmployeeService,
    private salaryService: SalaryService,
    private payrollService: PayrollService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.empService.getAll().subscribe(d => {
      this.totalEmployees = d.length;
      this.cdr.detectChanges();
    });
    this.salaryService.getAll().subscribe(d => {
      this.totalSalaries = d.length;
      this.cdr.detectChanges();
    });
    this.payrollService.getAll().subscribe(d => {
      this.totalNet = d.reduce((s, p) => s + p.netSalary, 0);
      this.totalTax = d.reduce((s, p) => s + p.taxDeduction, 0);
      this.cdr.detectChanges();
    });
  }
}