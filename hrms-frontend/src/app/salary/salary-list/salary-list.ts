import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { SalaryService, Salary } from '../../services/salary';
import { SalaryFormComponent } from '../salary-form/salary-form';

@Component({
  selector: 'app-salary-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatToolbarModule, MatDialogModule],
  template: `
    <mat-toolbar color="primary">
      <button mat-icon-button (click)="router.navigate(['/dashboard'])">
        <mat-icon>arrow_back</mat-icon>
      </button>
      <span>Salary Management</span>
      <span class="spacer"></span>
      <button mat-raised-button (click)="openForm()">
        <mat-icon>add</mat-icon> Add Salary
      </button>
    </mat-toolbar>

    <div class="container">
      <table mat-table [dataSource]="salaries" class="mat-elevation-z2">
        <ng-container matColumnDef="employee">
          <th mat-header-cell *matHeaderCellDef>Employee</th>
          <td mat-cell *matCellDef="let s">{{s.employee?.name || s.employeeId}}</td>
        </ng-container>
        <ng-container matColumnDef="basic">
          <th mat-header-cell *matHeaderCellDef>Basic Salary</th>
          <td mat-cell *matCellDef="let s">{{s.basicSalary | number}}</td>
        </ng-container>
        <ng-container matColumnDef="bonus">
          <th mat-header-cell *matHeaderCellDef>Bonus</th>
          <td mat-cell *matCellDef="let s">{{s.bonus | number}}</td>
        </ng-container>
        <ng-container matColumnDef="deduction">
          <th mat-header-cell *matHeaderCellDef>Deduction</th>
          <td mat-cell *matCellDef="let s">{{s.deduction | number}}</td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let s">
            <button mat-icon-button color="primary" (click)="openForm(s)"><mat-icon>edit</mat-icon></button>
            <button mat-icon-button color="warn" (click)="delete(s.id)"><mat-icon>delete</mat-icon></button>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="columns"></tr>
        <tr mat-row *matRowDef="let row; columns: columns;"></tr>
      </table>
    </div>
  `,
  styles: [`.spacer{flex:1} .container{padding:24px} table{width:100%}`]
})
export class SalaryListComponent implements OnInit {
  salaries: Salary[] = [];
  columns = ['employee', 'basic', 'bonus', 'deduction', 'actions'];

  constructor(private salaryService: SalaryService, public router: Router, private dialog: MatDialog) {}

  ngOnInit() { this.load(); }

  load() { this.salaryService.getAll().subscribe(data => this.salaries = data); }

  openForm(salary?: Salary) {
    const ref = this.dialog.open(SalaryFormComponent, { width: '400px', data: salary });
    ref.afterClosed().subscribe(result => { if (result) this.load(); });
  }

  delete(id: number) {
    if (confirm('Delete this salary record?'))
      this.salaryService.delete(id).subscribe(() => this.load());
  }
}