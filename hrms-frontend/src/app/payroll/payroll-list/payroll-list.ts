import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { PayrollService, Payroll } from '../../services/payroll';
import { SidebarComponent } from '../../shared/sidebar/sidebar';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-payroll-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatIconModule, SidebarComponent],
  template: `
    <div class="page-container">
      <app-sidebar></app-sidebar>
      <div class="main-content">
        <div class="top-bar">
          <div class="top-bar-title">Payroll Management</div>
          <div class="top-bar-actions">
            <div style="display:flex;align-items:center;gap:8px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:7px;padding:6px 12px;">
              <label style="font-size:12px;color:#9ca3af;">Month</label>
              <input type="number" [value]="month" (change)="onMonthChange($event)" min="1" max="12"
                style="width:40px;border:none;background:transparent;outline:none;font-size:13px;font-weight:500;color:#1a1f2e;">
              <label style="font-size:12px;color:#9ca3af;">Year</label>
              <input type="number" [value]="year" (change)="onYearChange($event)"
                style="width:55px;border:none;background:transparent;outline:none;font-size:13px;font-weight:500;color:#1a1f2e;">
            </div>
            <button class="btn-primary" (click)="generate()">
              <mat-icon style="font-size:16px;width:16px;height:16px;">play_arrow</mat-icon> Generate
            </button>
            <button class="btn-secondary" (click)="loadByMonth()">
              <mat-icon style="font-size:16px;width:16px;height:16px;">filter_list</mat-icon> Filter
            </button>
            <button class="btn-secondary" (click)="loadAll()">
              <mat-icon style="font-size:16px;width:16px;height:16px;">list</mat-icon> All
            </button>
            <button class="btn-danger" (click)="exportPDF()" [disabled]="payrolls.length === 0">
              <mat-icon style="font-size:16px;width:16px;height:16px;">picture_as_pdf</mat-icon> Export PDF
            </button>
          </div>
        </div>

        <div class="content-area">
          <div class="stat-cards" *ngIf="payrolls.length > 0">
            <div class="stat-card">
              <div class="stat-label">Total Employees</div>
              <div class="stat-value">{{payrolls.length}}</div>
              <div class="stat-sub">In current view</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Total Gross</div>
              <div class="stat-value">৳{{totalGross | number}}</div>
              <div class="stat-sub">Before deductions</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Total Tax</div>
              <div class="stat-value">৳{{totalTax | number}}</div>
              <div class="stat-sub">10% deducted</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Total Net</div>
              <div class="stat-value" style="color:#5b8dee;">৳{{totalNet | number}}</div>
              <div class="stat-sub">Paid to employees</div>
            </div>
          </div>

          <div class="section-card">
            <div class="section-header">
              <h3>Payroll Records</h3>
              <span style="font-size:12px;color:#9ca3af;">Month {{month}}, Year {{year}}</span>
            </div>
            <table mat-table [dataSource]="payrolls" style="width:100%" *ngIf="payrolls.length > 0">
              <ng-container matColumnDef="employee">
                <th mat-header-cell *matHeaderCellDef>Employee</th>
                <td mat-cell *matCellDef="let p">
                  <div style="display:flex;align-items:center;gap:10px;">
                    <div style="width:32px;height:32px;border-radius:50%;background:#e0e7ff;color:#4338ca;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;">
                      {{p.employee?.name?.charAt(0)?.toUpperCase() || '?'}}
                    </div>
                    <span style="font-weight:500;">{{p.employee?.name || p.employeeId}}</span>
                  </div>
                </td>
              </ng-container>
              <ng-container matColumnDef="month">
                <th mat-header-cell *matHeaderCellDef>Period</th>
                <td mat-cell *matCellDef="let p">{{p.month}}/{{p.year}}</td>
              </ng-container>
              <ng-container matColumnDef="gross">
                <th mat-header-cell *matHeaderCellDef>Gross</th>
                <td mat-cell *matCellDef="let p">৳{{p.grossSalary | number}}</td>
              </ng-container>
              <ng-container matColumnDef="tax">
                <th mat-header-cell *matHeaderCellDef>Tax (10%)</th>
                <td mat-cell *matCellDef="let p" style="color:#dc2626;">-৳{{p.taxDeduction | number}}</td>
              </ng-container>
              <ng-container matColumnDef="net">
                <th mat-header-cell *matHeaderCellDef>Net Salary</th>
                <td mat-cell *matCellDef="let p" style="font-weight:600;color:#5b8dee;">৳{{p.netSalary | number}}</td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="columns"></tr>
              <tr mat-row *matRowDef="let row; columns: columns;"></tr>
            </table>
            <div *ngIf="payrolls.length === 0" style="text-align:center;padding:48px;color:#9ca3af;">
              <mat-icon style="font-size:48px;width:48px;height:48px;margin-bottom:12px;">receipt_long</mat-icon>
              <div style="font-size:14px;">No payroll records. Click Generate to create payroll.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PayrollListComponent implements OnInit {
  payrolls: Payroll[] = [];
  columns = ['employee', 'month', 'gross', 'tax', 'net'];
  month: number = new Date().getMonth() + 1;
  year: number = new Date().getFullYear();
  totalGross = 0; totalTax = 0; totalNet = 0;

  constructor(
    private payrollService: PayrollService,
    public router: Router,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit() { this.loadAll(); }

  onMonthChange(e: any) { this.month = parseInt(e.target.value); }
  onYearChange(e: any) { this.year = parseInt(e.target.value); }

  updateTotals() {
    this.totalGross = this.payrolls.reduce((s, p) => s + p.grossSalary, 0);
    this.totalTax = this.payrolls.reduce((s, p) => s + p.taxDeduction, 0);
    this.totalNet = this.payrolls.reduce((s, p) => s + p.netSalary, 0);
  }

  loadAll() {
    this.payrollService.getAll().subscribe(data => {
      this.ngZone.run(() => {
        this.payrolls = [...data];
        this.updateTotals();
        this.cdr.detectChanges();
      });
    });
  }

  loadByMonth() {
    this.payrollService.getByMonth(this.month, this.year).subscribe(data => {
      this.ngZone.run(() => {
        this.payrolls = [...data];
        this.updateTotals();
        this.cdr.detectChanges();
      });
    });
  }

  generate() {
    this.payrollService.generate(this.month, this.year).subscribe({
      next: (res: any) => {
        this.ngZone.run(() => {
          alert(res.message);
          this.loadAll();
        });
      },
      error: (err) => alert(err.error?.message || 'Error generating payroll')
    });
  }

  exportPDF() {
    const doc = new jsPDF();
    doc.setFontSize(20); doc.setTextColor(26, 31, 46);
    doc.text('HRMS Payroll Report', 14, 20);
    doc.setFontSize(11); doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Period: Month ${this.month}, Year ${this.year}`, 14, 37);
    doc.setFontSize(11); doc.setTextColor(0);
    doc.text(`Employees: ${this.payrolls.length}`, 14, 47);
    doc.text(`Total Gross: ${this.totalGross.toLocaleString()}`, 14, 54);
    doc.text(`Total Tax: ${this.totalTax.toLocaleString()}`, 14, 61);
    doc.text(`Total Net: ${this.totalNet.toLocaleString()}`, 14, 68);
    autoTable(doc, {
      startY: 76,
      head: [['Employee', 'Period', 'Gross', 'Tax (10%)', 'Net Salary']],
      body: this.payrolls.map(p => [
        p.employee?.name || `ID ${p.employeeId}`,
        `${p.month}/${p.year}`,
        '৳' + p.grossSalary.toLocaleString(),
        '৳' + p.taxDeduction.toLocaleString(),
        '৳' + p.netSalary.toLocaleString()
      ]),
      headStyles: { fillColor: [26, 31, 46], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 246, 250] },
      foot: [['TOTAL', '', '৳'+this.totalGross.toLocaleString(), '৳'+this.totalTax.toLocaleString(), '৳'+this.totalNet.toLocaleString()]],
      footStyles: { fillColor: [91, 141, 238], textColor: 255, fontStyle: 'bold' }
    });
    doc.save(`Payroll_${this.month}_${this.year}.pdf`);
  }
}