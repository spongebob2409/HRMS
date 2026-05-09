import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { SalaryService, Salary } from '../../services/salary';
import { SalaryFormComponent } from '../salary-form/salary-form';
import { SidebarComponent } from '../../shared/sidebar/sidebar';

@Component({
  selector: 'app-salary-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule, MatDialogModule, SidebarComponent],
  template: `
    <div class="page-container">
      <app-sidebar></app-sidebar>
      <div class="main-content">
        <div class="top-bar">
          <div class="top-bar-title">Salary Management</div>
          <div class="top-bar-actions">
            <button class="btn-primary" (click)="openForm()">
              <mat-icon style="font-size:16px;width:16px;height:16px;">add</mat-icon> Add Salary
            </button>
          </div>
        </div>
        <div class="content-area">
          <div class="section-card">
            <table mat-table [dataSource]="salaries" style="width:100%">
              <ng-container matColumnDef="employee">
                <th mat-header-cell *matHeaderCellDef>Employee</th>
                <td mat-cell *matCellDef="let s">
                  <div style="display:flex;align-items:center;gap:10px;">
                    <div style="width:32px;height:32px;border-radius:50%;background:#e0e7ff;color:#4338ca;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;">
                      {{s.employee?.name?.charAt(0)?.toUpperCase() || '?'}}
                    </div>
                    <span style="font-weight:500;color:#1a1f2e;">{{s.employee?.name || 'ID: '+s.employeeId}}</span>
                  </div>
                </td>
              </ng-container>
              <ng-container matColumnDef="basic">
                <th mat-header-cell *matHeaderCellDef>Basic Salary</th>
                <td mat-cell *matCellDef="let s" style="font-weight:500;color:#1a1f2e;">৳{{s.basicSalary | number}}</td>
              </ng-container>
              <ng-container matColumnDef="bonus">
                <th mat-header-cell *matHeaderCellDef>Bonus</th>
                <td mat-cell *matCellDef="let s" style="color:#16a34a;">+৳{{s.bonus | number}}</td>
              </ng-container>
              <ng-container matColumnDef="deduction">
                <th mat-header-cell *matHeaderCellDef>Deduction</th>
                <td mat-cell *matCellDef="let s" style="color:#dc2626;">-৳{{s.deduction | number}}</td>
              </ng-container>
              <ng-container matColumnDef="net">
                <th mat-header-cell *matHeaderCellDef>Net</th>
                <td mat-cell *matCellDef="let s" style="font-weight:600;color:#5b8dee;">৳{{(s.basicSalary + s.bonus - s.deduction) | number}}</td>
              </ng-container>
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let s">
                  <div style="display:flex;gap:6px;">
                    <button style="background:#eff6ff;color:#2563eb;border:none;padding:6px 10px;border-radius:6px;cursor:pointer;font-size:12px;" (click)="openForm(s)">
                      <mat-icon style="font-size:14px;width:14px;height:14px;vertical-align:middle;">edit</mat-icon> Edit
                    </button>
                    <button style="background:#fee2e2;color:#dc2626;border:none;padding:6px 10px;border-radius:6px;cursor:pointer;font-size:12px;" (click)="delete(s.id)">
                      <mat-icon style="font-size:14px;width:14px;height:14px;vertical-align:middle;">delete</mat-icon> Delete
                    </button>
                  </div>
                </td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="columns"></tr>
              <tr mat-row *matRowDef="let row; columns: columns;"></tr>
            </table>
            <div *ngIf="salaries.length === 0" style="text-align:center;padding:40px;color:#9ca3af;">
              <mat-icon style="font-size:40px;width:40px;height:40px;margin-bottom:8px;">payments</mat-icon>
              <div>No salary records found</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SalaryListComponent implements OnInit {
  salaries: Salary[] = [];
  columns = ['employee', 'basic', 'bonus', 'deduction', 'net', 'actions'];

  constructor(
    private salaryService: SalaryService,
    public router: Router,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() { this.load(); }

  load() {
    this.salaryService.getAll().subscribe(data => {
      this.salaries = [...data];
      this.cdr.detectChanges();
    });
  }

  openForm(salary?: Salary) {
    const ref = this.dialog.open(SalaryFormComponent, { width: '420px', data: salary });
    ref.afterClosed().subscribe(result => { if (result) this.load(); });
  }

  delete(id: number) {
    if (confirm('Delete this salary record?'))
      this.salaryService.delete(id).subscribe(() => this.load());
  }
}