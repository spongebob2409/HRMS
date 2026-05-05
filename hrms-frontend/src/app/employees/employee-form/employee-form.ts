import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { EmployeeService, Employee } from '../../services/employee';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatSelectModule],
  template: `
    <h2 mat-dialog-title>{{ data?.id ? 'Edit' : 'Add' }} Employee</h2>
    <mat-dialog-content>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Name</mat-label>
        <input matInput [(ngModel)]="emp.name">
      </mat-form-field>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Email</mat-label>
        <input matInput [(ngModel)]="emp.email">
      </mat-form-field>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Phone</mat-label>
        <input matInput [(ngModel)]="emp.phone">
      </mat-form-field>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Position</mat-label>
        <input matInput [(ngModel)]="emp.position">
      </mat-form-field>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Department</mat-label>
        <input matInput [(ngModel)]="emp.department">
      </mat-form-field>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Account Number</mat-label>
        <input matInput [(ngModel)]="emp.accountNumber">
      </mat-form-field>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Status</mat-label>
        <mat-select [(ngModel)]="emp.employmentStatus">
          <mat-option value="Active">Active</mat-option>
          <mat-option value="Inactive">Inactive</mat-option>
        </mat-select>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" (click)="save()">Save</button>
    </mat-dialog-actions>
  `,
  styles: [`.full-width { width: 100%; }`]
})
export class EmployeeFormComponent {
  emp: Employee = { id: 0, name: '', email: '', phone: '', position: '',
    department: '', accountNumber: '', employmentStatus: 'Active', joiningDate: '' };

  constructor(
    private empService: EmployeeService,
    private dialogRef: MatDialogRef<EmployeeFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Employee
  ) {
    if (data) this.emp = { ...data };
  }

  save() {
    if (this.emp.id)
      this.empService.update(this.emp.id, this.emp).subscribe(() => this.dialogRef.close(true));
    else
      this.empService.create(this.emp).subscribe(() => this.dialogRef.close(true));
  }
}
