import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { PayrollService, Payroll } from '../../services/payroll';
import { NavbarComponent } from '../../shared/navbar/navbar';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-payroll-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatIconModule, NavbarComponent],
  template: `
    <div class="page-container">
      <app-navbar></app-navbar>
      <div class="content-area">
        <div class="page-header">
          <div>
            <div class="page-title">Payroll Management</div>
            <div class="page-subtitle">Generate and manage monthly payrolls</div>
          </div>
          <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
            <div style="display:flex;align-items:center;gap:8px;background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:7px 14px;">
              <mat-icon style="font-size:16px;width:16px;height:16px;color:#9ca3af;">calendar_month</mat-icon>
              <input type="number" [value]="month" (change)="onMonthChange($event)"
                min="1" max="12" placeholder="Month"
                style="width:40px;border:none;outline:none;font-size:13px;color:#111827;">
              <span style="color:#e5e7eb;">/</span>
              <input type="number" [value]="year" (change)="onYearChange($event)"
                placeholder="Year"
                style="width:55px;border:none;outline:none;font-size:13px;color:#111827;">
            </div>
            <button class="btn-primary" (click)="generate()">
              <mat-icon style="font-size:16px;width:16px;height:16px;">play_arrow</mat-icon>
              Generate
            </button>
            <button class="btn-secondary" (click)="loadByMonth()">
              <mat-icon style="font-size:16px;width:16px;height:16px;">filter_list</mat-icon>
              Filter
            </button>
            <button class="btn-secondary" (click)="loadAll()">
              <mat-icon style="font-size:16px;width:16px;height:16px;">list</mat-icon>
              View All
            </button>
            <button class="btn-danger" (click)="exportPDF()" [disabled]="payrolls.length===0">
              <mat-icon style="font-size:16px;width:16px;height:16px;">picture_as_pdf</mat-icon>
              Export PDF
            </button>
          </div>
        </div>

        <div class="stat-cards" *ngIf="payrolls.length > 0">
          <div class="stat-card">
            <div class="stat-icon" style="background:#f0f9ff;color:#0ea5e9;">
              <mat-icon>people</mat-icon>
            </div>
            <div>
              <div class="stat-label">Employees</div>
              <div class="stat-value">{{payrolls.length}}</div>
              <div class="stat-sub">In current view</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background:#f0fdf4;color:#16a34a;">
              <mat-icon>payments</mat-icon>
            </div>
            <div>
              <div class="stat-label">Total Gross</div>
              <div class="stat-value">Tk. {{totalGross | number}}</div>
              <div class="stat-sub">Before tax</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background:#fef9c3;color:#ca8a04;">
              <mat-icon>account_balance</mat-icon>
            </div>
            <div>
              <div class="stat-label">Total Tax</div>
              <div class="stat-value">Tk. {{totalTax | number}}</div>
              <div class="stat-sub">10% rate</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background:#fdf4ff;color:#a21caf;">
              <mat-icon>account_balance_wallet</mat-icon>
            </div>
            <div>
              <div class="stat-label">Total Net</div>
              <div class="stat-value" style="color:#0ea5e9;">Tk. {{totalNet | number}}</div>
              <div class="stat-sub">Paid out</div>
            </div>
          </div>
        </div>

        <div class="section-card">
          <div class="section-header">
            <div>
              <h3>Payroll Records</h3>
              <p>Month {{month}}, Year {{year}}</p>
            </div>
          </div>
          <table mat-table [dataSource]="payrolls" style="width:100%"
            *ngIf="payrolls.length > 0">
            <ng-container matColumnDef="employee">
              <th mat-header-cell *matHeaderCellDef>Employee</th>
              <td mat-cell *matCellDef="let p">
                <div style="display:flex;align-items:center;gap:10px;">
                  <div class="avatar">
                    {{p.employee?.name?.charAt(0)?.toUpperCase() || '?'}}
                  </div>
                  <span style="font-weight:500;">
                    {{p.employee?.name || 'ID: '+p.employeeId}}
                  </span>
                </div>
              </td>
            </ng-container>
            <ng-container matColumnDef="period">
              <th mat-header-cell *matHeaderCellDef>Period</th>
              <td mat-cell *matCellDef="let p">{{p.month}}/{{p.year}}</td>
            </ng-container>
            <ng-container matColumnDef="gross">
              <th mat-header-cell *matHeaderCellDef>Gross</th>
              <td mat-cell *matCellDef="let p">Tk. {{p.grossSalary | number}}</td>
            </ng-container>
            <ng-container matColumnDef="tax">
              <th mat-header-cell *matHeaderCellDef>Tax (10%)</th>
              <td mat-cell *matCellDef="let p" style="color:#dc2626;">
                -Tk. {{p.taxDeduction | number}}
              </td>
            </ng-container>
            <ng-container matColumnDef="net">
              <th mat-header-cell *matHeaderCellDef>Net Salary</th>
              <td mat-cell *matCellDef="let p">
                <span style="font-weight:600;color:#0ea5e9;">
                  Tk. {{p.netSalary | number}}
                </span>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="columns"></tr>
            <tr mat-row *matRowDef="let row; columns: columns;"></tr>
          </table>
          <div *ngIf="payrolls.length===0"
            style="text-align:center;padding:48px;color:#9ca3af;">
            <mat-icon style="font-size:48px;width:48px;height:48px;display:block;margin:0 auto 12px;">
              receipt_long</mat-icon>
            <div style="font-size:14px;">No payroll records. Click Generate to start.</div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PayrollListComponent implements OnInit {
  payrolls: Payroll[] = [];
  columns = ['employee', 'period', 'gross', 'tax', 'net'];
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
    doc.setFontSize(20); doc.setTextColor(17, 24, 39);
    doc.text('HRMS Payroll Report', 14, 20);
    doc.setFontSize(11); doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Period: Month ${this.month}, Year ${this.year}`, 14, 37);
    doc.setTextColor(0);
    doc.text(`Total Employees: ${this.payrolls.length}`, 14, 47);
    doc.text(`Total Gross: Tk. ${this.totalGross.toLocaleString()}`, 14, 54);
    doc.text(`Total Tax: Tk. ${this.totalTax.toLocaleString()}`, 14, 61);
    doc.text(`Total Net: Tk. ${this.totalNet.toLocaleString()}`, 14, 68);
    autoTable(doc, {
      startY: 76,
      head: [['Employee', 'Period', 'Gross', 'Tax (10%)', 'Net Salary']],
      body: this.payrolls.map(p => [
        p.employee?.name || `ID ${p.employeeId}`,
        `${p.month}/${p.year}`,
        'Tk. ' + p.grossSalary.toLocaleString(),
        'Tk. ' + p.taxDeduction.toLocaleString(),
        'Tk. ' + p.netSalary.toLocaleString()
      ]),
      headStyles: { fillColor: [14, 165, 233], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [240, 249, 255] },
      foot: [['TOTAL', '',
        'Tk. ' + this.totalGross.toLocaleString(),
        'Tk. ' + this.totalTax.toLocaleString(),
        'Tk. ' + this.totalNet.toLocaleString()
      ]],
      footStyles: { fillColor: [14, 165, 233], textColor: 255, fontStyle: 'bold' }
    });
    doc.save(`Payroll_${this.month}_${this.year}.pdf`);
  }
}