import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { EmployeeService, Employee } from '../../services/employee';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatIconModule],
  template: `
    <div style="padding: 24px; min-width: 480px;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;">
        <div>
          <h2 style="font-size:18px;font-weight:600;color:#111827;margin:0;">
            {{data?.id ? 'Edit Employee' : 'Add New Employee'}}
          </h2>
          <p style="font-size:13px;color:#9ca3af;margin:4px 0 0;">
            {{data?.id ? 'Update employee information' : 'Fill in the details below'}}
          </p>
        </div>
        <button mat-dialog-close style="background:none;border:none;cursor:pointer;color:#9ca3af;padding:4px;">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
        <div style="grid-column:1/-1;">
          <label style="font-size:12px;font-weight:500;color:#374151;display:block;margin-bottom:6px;">Full Name</label>
          <input [(ngModel)]="emp.name" placeholder="e.g. John Doe"
            style="width:100%;padding:10px 14px;border:1px solid #e5e7eb;border-radius:8px;font-size:13px;outline:none;color:#111827;box-sizing:border-box;"
            (focus)="$event.target.style.borderColor='#0ea5e9'"
            (blur)="$event.target.style.borderColor='#e5e7eb'">
        </div>
        <div>
          <label style="font-size:12px;font-weight:500;color:#374151;display:block;margin-bottom:6px;">Email</label>
          <input [(ngModel)]="emp.email" placeholder="email@company.com" type="email"
            style="width:100%;padding:10px 14px;border:1px solid #e5e7eb;border-radius:8px;font-size:13px;outline:none;color:#111827;box-sizing:border-box;"
            (focus)="$event.target.style.borderColor='#0ea5e9'"
            (blur)="$event.target.style.borderColor='#e5e7eb'">
        </div>
        <div>
          <label style="font-size:12px;font-weight:500;color:#374151;display:block;margin-bottom:6px;">Phone</label>
          <input [(ngModel)]="emp.phone" placeholder="01XXXXXXXXX"
            style="width:100%;padding:10px 14px;border:1px solid #e5e7eb;border-radius:8px;font-size:13px;outline:none;color:#111827;box-sizing:border-box;"
            (focus)="$event.target.style.borderColor='#0ea5e9'"
            (blur)="$event.target.style.borderColor='#e5e7eb'">
        </div>
        <div>
          <label style="font-size:12px;font-weight:500;color:#374151;display:block;margin-bottom:6px;">Position</label>
          <input [(ngModel)]="emp.position" placeholder="e.g. Software Engineer"
            style="width:100%;padding:10px 14px;border:1px solid #e5e7eb;border-radius:8px;font-size:13px;outline:none;color:#111827;box-sizing:border-box;"
            (focus)="$event.target.style.borderColor='#0ea5e9'"
            (blur)="$event.target.style.borderColor='#e5e7eb'">
        </div>
        <div>
          <label style="font-size:12px;font-weight:500;color:#374151;display:block;margin-bottom:6px;">Department</label>
          <input [(ngModel)]="emp.department" placeholder="e.g. Engineering"
            style="width:100%;padding:10px 14px;border:1px solid #e5e7eb;border-radius:8px;font-size:13px;outline:none;color:#111827;box-sizing:border-box;"
            (focus)="$event.target.style.borderColor='#0ea5e9'"
            (blur)="$event.target.style.borderColor='#e5e7eb'">
        </div>
        <div>
          <label style="font-size:12px;font-weight:500;color:#374151;display:block;margin-bottom:6px;">Account Number</label>
          <input [(ngModel)]="emp.accountNumber" placeholder="Bank account number"
            style="width:100%;padding:10px 14px;border:1px solid #e5e7eb;border-radius:8px;font-size:13px;outline:none;color:#111827;box-sizing:border-box;"
            (focus)="$event.target.style.borderColor='#0ea5e9'"
            (blur)="$event.target.style.borderColor='#e5e7eb'">
        </div>
        <div style="grid-column:1/-1;">
          <label style="font-size:12px;font-weight:500;color:#374151;display:block;margin-bottom:6px;">Employment Status</label>
          <select [(ngModel)]="emp.employmentStatus"
            style="width:100%;padding:10px 14px;border:1px solid #e5e7eb;border-radius:8px;font-size:13px;outline:none;color:#111827;background:#fff;box-sizing:border-box;">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:24px;padding-top:20px;border-top:1px solid #f3f4f6;">
        <button mat-dialog-close
          style="padding:9px 20px;border:1px solid #e5e7eb;border-radius:8px;background:#fff;font-size:13px;cursor:pointer;color:#374151;">
          Cancel
        </button>
        <button (click)="save()"
          style="padding:9px 20px;border:none;border-radius:8px;background:#0ea5e9;color:#fff;font-size:13px;cursor:pointer;font-weight:500;">
          {{data?.id ? 'Update Employee' : 'Add Employee'}}
        </button>
      </div>
    </div>
  `
})
export class EmployeeFormComponent {
  emp: Employee = {
    id: 0, name: '', email: '', phone: '', position: '',
    department: '', accountNumber: '', employmentStatus: 'Active', joiningDate: ''
  };

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