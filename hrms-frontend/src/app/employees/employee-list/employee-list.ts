import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { EmployeeService, Employee } from '../../services/employee';
import { EmployeeFormComponent } from '../employee-form/employee-form';
import { SidebarComponent } from '../../shared/sidebar/sidebar';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatIconModule, MatDialogModule, SidebarComponent],
  template: `
    <div class="page-container">
      <app-sidebar></app-sidebar>
      <div class="main-content">
        <div class="top-bar">
          <div class="top-bar-title">Employee Management</div>
          <div class="top-bar-actions">
            <div class="search-bar">
              <mat-icon>search</mat-icon>
              <input [(ngModel)]="search" (input)="loadEmployees()" placeholder="Search name or department...">
            </div>
            <button class="btn-primary" (click)="openForm()">
              <mat-icon style="font-size:16px;width:16px;height:16px;">add</mat-icon> Add Employee
            </button>
          </div>
        </div>
        <div class="content-area">
          <div class="section-card">
            <table mat-table [dataSource]="employees" style="width:100%">
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Name</th>
                <td mat-cell *matCellDef="let e">
                  <div style="display:flex;align-items:center;gap:10px;">
                    <div style="width:32px;height:32px;border-radius:50%;background:#e0e7ff;color:#4338ca;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;">
                      {{e.name?.charAt(0)?.toUpperCase()}}
                    </div>
                    <div>
                      <div style="font-weight:500;color:#1a1f2e;">{{e.name}}</div>
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
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let e">
                  <span [class]="e.employmentStatus === 'Active' ? 'badge-active' : 'badge-inactive'">
                    {{e.employmentStatus}}
                  </span>
                </td>
              </ng-container>
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let e">
                  <div style="display:flex;gap:6px;">
                    <button style="background:#eff6ff;color:#2563eb;border:none;padding:6px 10px;border-radius:6px;cursor:pointer;font-size:12px;" (click)="openForm(e)">
                      <mat-icon style="font-size:14px;width:14px;height:14px;vertical-align:middle;">edit</mat-icon> Edit
                    </button>
                    <button style="background:#fee2e2;color:#dc2626;border:none;padding:6px 10px;border-radius:6px;cursor:pointer;font-size:12px;" (click)="delete(e.id)">
                      <mat-icon style="font-size:14px;width:14px;height:14px;vertical-align:middle;">delete</mat-icon> Delete
                    </button>
                  </div>
                </td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="columns"></tr>
              <tr mat-row *matRowDef="let row; columns: columns;"></tr>
            </table>
            <div *ngIf="employees.length === 0" style="text-align:center;padding:40px;color:#9ca3af;">
              <mat-icon style="font-size:40px;width:40px;height:40px;margin-bottom:8px;">people_outline</mat-icon>
              <div>No employees found</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  columns = ['name', 'position', 'department', 'status', 'actions'];
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