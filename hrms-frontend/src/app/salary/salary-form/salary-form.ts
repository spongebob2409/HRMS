import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { SalaryService, Salary } from '../../services/salary';
import { EmployeeService, Employee } from '../../services/employee';

@Component({
  selector: 'app-salary-form',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatIconModule],
  template: `
    <div style="padding: 24px; min-width: 420px;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;">
        <div>
          <h2 style="font-size:18px;font-weight:600;color:#111827;margin:0;">
            {{data?.id ? 'Edit Salary' : 'Add Salary Record'}}
          </h2>
          <p style="font-size:13px;color:#9ca3af;margin:4px 0 0;">
            Set salary details for an employee
          </p>
        </div>
        <button mat-dialog-close style="background:none;border:none;cursor:pointer;color:#9ca3af;padding:4px;">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div style="display:flex;flex-direction:column;gap:16px;">
        <div>
          <label style="font-size:12px;font-weight:500;color:#374151;display:block;margin-bottom:6px;">Employee</label>
          <select [(ngModel)]="salary.employeeId"
            style="width:100%;padding:10px 14px;border:1px solid #e5e7eb;border-radius:8px;font-size:13px;outline:none;color:#111827;background:#fff;box-sizing:border-box;">
            <option value="0" disabled>Select an employee</option>
            <option *ngFor="let emp of employees" [value]="emp.id">
              {{emp.name}} — {{emp.position}}
            </option>
          </select>
        </div>

        <div>
          <label style="font-size:12px;font-weight:500;color:#374151;display:block;margin-bottom:6px;">Basic Salary (Tk.)</label>
          <input [(ngModel)]="salary.basicSalary" type="number" placeholder="e.g. 20000"
            style="width:100%;padding:10px 14px;border:1px solid #e5e7eb;border-radius:8px;font-size:13px;outline:none;color:#111827;box-sizing:border-box;"
            (focus)="$event.target.style.borderColor='#0ea5e9'"
            (blur)="$event.target.style.borderColor='#e5e7eb'">
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div>
            <label style="font-size:12px;font-weight:500;color:#16a34a;display:block;margin-bottom:6px;">Bonus (Tk.)</label>
            <input [(ngModel)]="salary.bonus" type="number" placeholder="0"
              style="width:100%;padding:10px 14px;border:1px solid #e5e7eb;border-radius:8px;font-size:13px;outline:none;color:#111827;box-sizing:border-box;"
              (focus)="$event.target.style.borderColor='#16a34a'"
              (blur)="$event.target.style.borderColor='#e5e7eb'">
          </div>
          <div>
            <label style="font-size:12px;font-weight:500;color:#dc2626;display:block;margin-bottom:6px;">Deduction (Tk.)</label>
            <input [(ngModel)]="salary.deduction" type="number" placeholder="0"
              style="width:100%;padding:10px 14px;border:1px solid #e5e7eb;border-radius:8px;font-size:13px;outline:none;color:#111827;box-sizing:border-box;"
              (focus)="$event.target.style.borderColor='#dc2626'"
              (blur)="$event.target.style.borderColor='#e5e7eb'">
          </div>
        </div>

        <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:12px 16px;">
          <div style="font-size:12px;color:#0369a1;margin-bottom:4px;">Net Salary Preview</div>
          <div style="font-size:20px;font-weight:600;color:#0ea5e9;">
            Tk. {{(salary.basicSalary + salary.bonus - salary.deduction) | number}}
          </div>
          <div style="font-size:11px;color:#7dd3fc;margin-top:2px;">
            After 10% tax: Tk. {{((salary.basicSalary + salary.bonus - salary.deduction) * 0.9) | number}}
          </div>
        </div>
      </div>

      <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:24px;padding-top:20px;border-top:1px solid #f3f4f6;">
        <button mat-dialog-close
          style="padding:9px 20px;border:1px solid #e5e7eb;border-radius:8px;background:#fff;font-size:13px;cursor:pointer;color:#374151;">
          Cancel
        </button>
        <button (click)="save()"
          style="padding:9px 20px;border:none;border-radius:8px;background:#0ea5e9;color:#fff;font-size:13px;cursor:pointer;font-weight:500;">
          {{data?.id ? 'Update Salary' : 'Add Salary'}}
        </button>
      </div>
    </div>
  `
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