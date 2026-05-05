import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PayrollService, Payroll } from '../../services/payroll';

@Component({
  selector: 'app-payroll-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatButtonModule,
    MatIconModule, MatToolbarModule, MatFormFieldModule, MatInputModule],
  template: `
    <mat-toolbar color="primary">
      <button mat-icon-button (click)="router.navigate(['/dashboard'])">
        <mat-icon>arrow_back</mat-icon>
      </button>
      <span>Payroll Management</span>
    </mat-toolbar>

    <div class="container">
      <div class="generate-section">
        <mat-form-field appearance="outline">
          <mat-label>Month (1-12)</mat-label>
          <input matInput type="number" [(ngModel)]="month" min="1" max="12">
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Year</mat-label>
          <input matInput type="number" [(ngModel)]="year">
        </mat-form-field>
        <button mat-raised-button color="primary" (click)="generate()">
          <mat-icon>play_arrow</mat-icon> Generate Payroll
        </button>
        <button mat-raised-button (click)="load()">
          <mat-icon>search</mat-icon> View Payroll
        </button>
      </div>

      <table mat-table [dataSource]="payrolls" class="mat-elevation-z2">
        <ng-container matColumnDef="employee">
          <th mat-header-cell *matHeaderCellDef>Employee</th>
          <td mat-cell *matCellDef="let p">{{p.employee?.name || p.employeeId}}</td>
        </ng-container>
        <ng-container matColumnDef="month">
          <th mat-header-cell *matHeaderCellDef>Month/Year</th>
          <td mat-cell *matCellDef="let p">{{p.month}}/{{p.year}}</td>
        </ng-container>
        <ng-container matColumnDef="gross">
          <th mat-header-cell *matHeaderCellDef>Gross</th>
          <td mat-cell *matCellDef="let p">{{p.grossSalary | number}}</td>
        </ng-container>
        <ng-container matColumnDef="tax">
          <th mat-header-cell *matHeaderCellDef>Tax</th>
          <td mat-cell *matCellDef="let p">{{p.taxDeduction | number}}</td>
        </ng-container>
        <ng-container matColumnDef="net">
          <th mat-header-cell *matHeaderCellDef>Net Salary</th>
          <td mat-cell *matCellDef="let p">{{p.netSalary | number}}</td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="columns"></tr>
        <tr mat-row *matRowDef="let row; columns: columns;"></tr>
      </table>
    </div>
  `,
  styles: [`
    .spacer{flex:1}
    .container{padding:24px}
    .generate-section{display:flex;gap:16px;align-items:center;margin-bottom:24px;flex-wrap:wrap}
    table{width:100%}
  `]
})
export class PayrollListComponent implements OnInit {
  payrolls: Payroll[] = [];
  columns = ['employee', 'month', 'gross', 'tax', 'net'];
  month = new Date().getMonth() + 1;
  year = new Date().getFullYear();

  constructor(private payrollService: PayrollService, public router: Router) {}

  ngOnInit() { this.load(); }

  load() {
    this.payrollService.getAll().subscribe(data => this.payrolls = data);
  }

  generate() {
    this.payrollService.generate(this.month, this.year).subscribe({
      next: (res: any) => {
        alert(`${res.message}`);
        this.load();
      },
      error: () => alert('Error generating payroll')
    });
  }
}