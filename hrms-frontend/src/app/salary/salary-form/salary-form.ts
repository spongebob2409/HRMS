import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { SalaryService, Salary } from '../../services/salary';
import { EmployeeService, Employee } from '../../services/employee';

@Component({
  selector: 'app-salary-form',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatSelectModule],
  template: `
    <h2 mat-dialog-title>{{ data?.id ? 'Edit' : 'Add' }} Salary</h2>
    <mat-dialog-content>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Employee</mat-label>
        <mat-select [(ngModel)]="salary.employeeId">
          <mat-option *ngFor="let emp of employees" [value]="emp.id">
            {{emp.name}} (ID: {{emp.id}})
          </mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Basic Salary</mat-label>
        <input matInput type="number" [(ngModel)]="salary.basicSalary">
      </mat-form-field>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Bonus</mat-label>
        <input matInput type="number" [(ngModel)]="salary.bonus">
      </mat-form-field>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Deduction</mat-label>
        <input matInput type="number" [(ngModel)]="salary.deduction">
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" (click)="save()">Save</button>
    </mat-dialog-actions>
  `,
  styles: [`.full-width { width: 100%; }`]
})
export class SalaryFormComponent implements OnInit {
  employees: Employee[] = [];
  salary: Salary = { id: 0, employeeId: 0, basicSalary: 0, bonus: 0, deduction: 0, effectiveDate: '' };

  constructor(
    private salaryService: SalaryService,
    private empService: EmployeeService,
    private dialogRef: MatDialogRef<SalaryFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Salary
  ) {
    if (data) this.salary = { ...data };
  }

  ngOnInit() {
    this.empService.getAll().subscribe(data => this.employees = data);
  }

  save() {
    if (this.salary.id)
      this.salaryService.update(this.salary.id, this.salary).subscribe(() => this.dialogRef.close(true));
    else
      this.salaryService.create(this.salary).subscribe(() => this.dialogRef.close(true));
  }
}