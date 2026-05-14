import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { SalaryService, Salary } from '../../services/salary';
import { EmployeeService, Employee } from '../../services/employee';
import { SalaryFormComponent } from '../salary-form/salary-form';
import { NavbarComponent } from '../../shared/navbar/navbar';

@Component({
  selector: 'app-salary-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule, MatDialogModule, NavbarComponent],
  template: `
    <div class="page-container">
      <app-navbar></app-navbar>
      <div class="content-area">
        <div class="page-header">
          <div>
            <div class="page-title">Salary Management</div>
            <div class="page-subtitle">{{salaries.length}} salary records</div>
          </div>
          <button class="btn-primary" (click)="openForm()">
            <mat-icon style="font-size:16px;width:16px;height:16px;">add</mat-icon>
            Add Salary
          </button>
        </div>

        <div class="section-card">
          <table mat-table [dataSource]="salaries" style="width:100%">
            <ng-container matColumnDef="employee">
              <th mat-header-cell *matHeaderCellDef>Employee</th>
              <td mat-cell *matCellDef="let s">
                <div style="display:flex;align-items:center;gap:10px;">
                  <div class="avatar">
                    {{s.employee?.name?.charAt(0)?.toUpperCase() || '?'}}
                  </div>
                  <span style="font-weight:500;color:#111827;">
                    {{s.employee?.name || 'ID: '+s.employeeId}}
                  </span>
                </div>
              </td>
            </ng-container>
            <ng-container matColumnDef="basic">
              <th mat-header-cell *matHeaderCellDef>Basic Salary</th>
              <td mat-cell *matCellDef="let s">
                <span style="font-weight:500;">Tk. {{s.basicSalary | number}}</span>
              </td>
            </ng-container>
            <ng-container matColumnDef="bonus">
              <th mat-header-cell *matHeaderCellDef>Bonus</th>
              <td mat-cell *matCellDef="let s" style="color:#16a34a;">
                +Tk. {{s.bonus | number}}
              </td>
            </ng-container>
            <ng-container matColumnDef="deduction">
              <th mat-header-cell *matHeaderCellDef>Deduction</th>
              <td mat-cell *matCellDef="let s" style="color:#dc2626;">
                -Tk. {{s.deduction | number}}
              </td>
            </ng-container>
            <ng-container matColumnDef="net">
              <th mat-header-cell *matHeaderCellDef>Net</th>
              <td mat-cell *matCellDef="let s">
                <span style="font-weight:600;color:#0ea5e9;">
                  Tk. {{(s.basicSalary + s.bonus - s.deduction) | number}}
                </span>
              </td>
            </ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let s">
                <div style="display:flex;gap:6px;">
                  <button style="background:#f0f9ff;color:#0284c7;border:1px solid #bae6fd;padding:5px 10px;border-radius:6px;cursor:pointer;font-size:12px;display:flex;align-items:center;gap:4px;" (click)="openForm(s)">
                    <mat-icon style="font-size:13px;width:13px;height:13px;">edit</mat-icon> Edit
                  </button>
                  <button style="background:#fff;color:#dc2626;border:1px solid #fecaca;padding:5px 10px;border-radius:6px;cursor:pointer;font-size:12px;display:flex;align-items:center;gap:4px;" (click)="delete(s.id)">
                    <mat-icon style="font-size:13px;width:13px;height:13px;">delete</mat-icon> Delete
                  </button>
                </div>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="columns"></tr>
            <tr mat-row *matRowDef="let row; columns: columns;"></tr>
          </table>
          <div *ngIf="salaries.length===0"
            style="text-align:center;padding:48px;color:#9ca3af;">
            <mat-icon style="font-size:48px;width:48px;height:48px;display:block;margin:0 auto 12px;">
              payments</mat-icon>
            <div style="font-size:14px;">No salary records found.</div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SalaryListComponent implements OnInit {
  salaries: Salary[] = [];
  employees: Employee[] = [];
  columns = ['employee', 'basic', 'bonus', 'deduction', 'net', 'actions'];

  constructor(
    private salaryService: SalaryService,
    private empService: EmployeeService,
    public router: Router,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.load();
    this.loadEmployees();
  }

  load() {
    this.salaryService.getAll().subscribe(data => {
      this.salaries = [...data];
      this.cdr.detectChanges();
    });
  }

  loadEmployees() {
    this.empService.getAll().subscribe({
      next: (data) => {
        this.employees = data;
      }
    });
  }

  openForm(salary?: Salary) {
    const ref = this.dialog.open(SalaryFormComponent, {
      width: '420px',
      data: { salary, employees: this.employees }
    });
    ref.afterClosed().subscribe(result => { if (result) this.load(); });
  }

  delete(id: number) {
    if (confirm('Delete this salary record?'))
      this.salaryService.delete(id).subscribe(() => this.load());
  }
}
