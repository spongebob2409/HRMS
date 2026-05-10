import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { EmployeeService, Employee } from '../../services/employee';
import { EmployeeFormComponent } from '../employee-form/employee-form';
import { NavbarComponent } from '../../shared/navbar/navbar';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatIconModule, MatDialogModule, NavbarComponent],
  template: `
    <div class="page-container">
      <app-navbar></app-navbar>
      <div class="content-area">
        <div class="page-header">
          <div>
            <div class="page-title">Employees</div>
            <div class="page-subtitle">{{employees.length}} total records</div>
          </div>
          <div style="display:flex;gap:10px;align-items:center;">
            <div class="search-bar">
              <mat-icon>search</mat-icon>
              <input [(ngModel)]="search" (input)="loadEmployees()"
                placeholder="Search name or department...">
            </div>
            <button class="btn-primary" (click)="openForm()">
              <mat-icon style="font-size:16px;width:16px;height:16px;">add</mat-icon>
              Add Employee
            </button>
          </div>
        </div>

        <div class="section-card">
          <table mat-table [dataSource]="employees" style="width:100%">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Employee</th>
              <td mat-cell *matCellDef="let e">
                <div style="display:flex;align-items:center;gap:10px;padding:4px 0;">
                  <div class="avatar">{{e.name?.charAt(0)?.toUpperCase()}}</div>
                  <div>
                    <div style="font-weight:500;color:#111827;font-size:13px;">{{e.name}}</div>
                    <div style="font-size:11px;color:#9ca3af;">{{e.email}}</div>
                  </div>
                </div>
              </td>
            </ng-container>
            <ng-container matColumnDef="position">
              <th mat-header-cell *matHeaderCellDef>Position</th>
              <td mat-cell *matCellDef="let e">{{e.position}}</td>
            </ng-container>
            <ng-container matColumnDef="department">
              <th mat-header-cell *matHeaderCellDef>Department</th>
              <td mat-cell *matCellDef="let e">{{e.department}}</td>
            </ng-container>
            <ng-container matColumnDef="phone">
              <th mat-header-cell *matHeaderCellDef>Phone</th>
              <td mat-cell *matCellDef="let e">{{e.phone}}</td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let e">
                <span [class]="e.employmentStatus==='Active'?'badge-active':'badge-inactive'">
                  {{e.employmentStatus}}
                </span>
              </td>
            </ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let e">
                <div style="display:flex;gap:6px;">
                  <button style="background:#f0f9ff;color:#0284c7;border:1px solid #bae6fd;padding:5px 10px;border-radius:6px;cursor:pointer;font-size:12px;display:flex;align-items:center;gap:4px;" (click)="openForm(e)">
                    <mat-icon style="font-size:13px;width:13px;height:13px;">edit</mat-icon> Edit
                  </button>
                  <button style="background:#fff;color:#dc2626;border:1px solid #fecaca;padding:5px 10px;border-radius:6px;cursor:pointer;font-size:12px;display:flex;align-items:center;gap:4px;" (click)="delete(e.id)">
                    <mat-icon style="font-size:13px;width:13px;height:13px;">delete</mat-icon> Delete
                  </button>
                </div>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="columns"></tr>
            <tr mat-row *matRowDef="let row; columns: columns;"></tr>
          </table>
          <div *ngIf="employees.length===0"
            style="text-align:center;padding:48px;color:#9ca3af;">
            <mat-icon style="font-size:48px;width:48px;height:48px;display:block;margin:0 auto 12px;">
              people_outline</mat-icon>
            <div style="font-size:14px;">No employees found. Add your first employee!</div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  columns = ['name', 'position', 'department', 'phone', 'status', 'actions'];
  search = '';

  constructor(
    private empService: EmployeeService,
    public router: Router,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() { this.loadEmployees(); }

  loadEmployees() {
    this.empService.getAll(this.search).subscribe(data => {
      this.employees = [...data];
      this.cdr.detectChanges();
    });
  }

  openForm(emp?: Employee) {
    const ref = this.dialog.open(EmployeeFormComponent, { width: '500px', data: emp });
    ref.afterClosed().subscribe(result => { if (result) this.loadEmployees(); });
  }

  delete(id: number) {
    if (confirm('Delete this employee?'))
      this.empService.delete(id).subscribe(() => this.loadEmployees());
  }
}