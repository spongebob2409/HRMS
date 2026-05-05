import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { EmployeeService, Employee } from '../../services/employee';
import { EmployeeFormComponent } from '../employee-form/employee-form';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatButtonModule,
    MatIconModule, MatInputModule, MatFormFieldModule, MatToolbarModule, MatDialogModule],
  template: `
    <mat-toolbar color="primary">
      <button mat-icon-button (click)="router.navigate(['/dashboard'])">
        <mat-icon>arrow_back</mat-icon>
      </button>
      <span>Employee Management</span>
      <span class="spacer"></span>
      <button mat-raised-button (click)="openForm()">
        <mat-icon>add</mat-icon> Add Employee
      </button>
    </mat-toolbar>

    <div class="container">
      <mat-form-field appearance="outline">
        <mat-label>Search</mat-label>
        <input matInput [(ngModel)]="search" (ngModelChange)="loadEmployees()" placeholder="Search by name or department">
        <mat-icon matSuffix>search</mat-icon>
      </mat-form-field>

      <table mat-table [dataSource]="employees" class="mat-elevation-z2">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Name</th>
          <td mat-cell *matCellDef="let e">{{e.name}}</td>
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
          <td mat-cell *matCellDef="let e">{{e.employmentStatus}}</td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let e">
            <button mat-icon-button color="primary" (click)="openForm(e)"><mat-icon>edit</mat-icon></button>
            <button mat-icon-button color="warn" (click)="delete(e.id)"><mat-icon>delete</mat-icon></button>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="columns"></tr>
        <tr mat-row *matRowDef="let row; columns: columns;"></tr>
      </table>
    </div>
  `,
  styles: [`
    .spacer { flex: 1; }
    .container { padding: 24px; }
    mat-form-field { width: 300px; margin-bottom: 16px; }
    table { width: 100%; }
  `]
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  columns = ['name', 'position', 'department', 'status', 'actions'];
  search = '';

  constructor(private empService: EmployeeService, public router: Router, private dialog: MatDialog) {}

  ngOnInit() { this.loadEmployees(); }

  loadEmployees() {
    this.empService.getAll(this.search).subscribe(data => this.employees = data);
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
