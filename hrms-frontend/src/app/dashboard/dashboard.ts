import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { SidebarComponent } from '../shared/sidebar/sidebar';
import { EmployeeService } from '../services/employee';
import { SalaryService } from '../services/salary';
import { PayrollService } from '../services/payroll';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule, SidebarComponent],
  template: `
    <div class="page-container">
      <app-sidebar></app-sidebar>
      <div class="main-content">
        <div class="top-bar">
          <div class="top-bar-title">Dashboard</div>
          <div class="top-bar-actions">
            <span style="font-size:13px;color:#9ca3af;">Welcome back, Admin</span>
          </div>
        </div>
        <div class="content-area">
          <div class="stat-cards">
            <div class="stat-card">
              <div class="stat-label">Total Employees</div>
              <div class="stat-value">{{totalEmployees}}</div>
              <div class="stat-sub">Active staff</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Total Payroll</div>
              <div class="stat-value">৳{{totalNet | number}}</div> 
              <div class="stat-sub">This month</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Total Tax</div>
              <div class="stat-value">৳{{totalTax | number}}</div>
              <div class="stat-sub">Deducted</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Salary Records</div>
              <div class="stat-value">{{totalSalaries}}</div>
              <div class="stat-sub">Configured</div>
            </div>
          </div>

          <div class="section-card">
            <div class="section-header">
              <h3>Quick Actions</h3>
            </div>
            <div style="padding: 20px; display: flex; gap: 12px; flex-wrap: wrap;">
              <button class="btn-primary" (click)="router.navigate(['/employees'])">
                <mat-icon style="font-size:16px;width:16px;height:16px;">people</mat-icon>
                Manage Employees
              </button>
              <button class="btn-primary" (click)="router.navigate(['/salary'])">
                <mat-icon style="font-size:16px;width:16px;height:16px;">payments</mat-icon>
                Manage Salary
              </button>
              <button class="btn-primary" (click)="router.navigate(['/payroll'])">
                <mat-icon style="font-size:16px;width:16px;height:16px;">receipt_long</mat-icon>
                Generate Payroll
              </button>
            </div>
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
    private payrollService: PayrollService
  ) {}

  ngOnInit() {
    this.empService.getAll().subscribe(d => this.totalEmployees = d.length);
    this.salaryService.getAll().subscribe(d => this.totalSalaries = d.length);
    this.payrollService.getAll().subscribe(d => {
      this.totalNet = d.reduce((s, p) => s + p.netSalary, 0);
      this.totalTax = d.reduce((s, p) => s + p.taxDeduction, 0);
    });
  }
}