import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Employee {
  name: string;
}

export interface Payroll {
  id: number;
  employeeId: number;
  month: number;
  year: number;
  grossSalary: number;
  taxDeduction: number;
  netSalary: number;
  generatedDate: string;
  employee?: Employee;
}

@Injectable({ providedIn: 'root' })
export class PayrollService {
  private apiUrl = 'http://localhost:5011/api/payroll';
  constructor(private http: HttpClient) {}

  getAll() { return this.http.get<Payroll[]>(this.apiUrl); }
  getByMonth(month: number, year: number) {
    return this.http.get<Payroll[]>(`${this.apiUrl}/${month}/${year}`);
  }
  generate(month: number, year: number) {
    return this.http.post(`${this.apiUrl}/generate/${month}/${year}`, {});
  }
  delete(id: number) { return this.http.delete(`${this.apiUrl}/${id}`); }
}
