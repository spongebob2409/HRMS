import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Salary {
  id: number;
  employeeId: number;
  basicSalary: number;
  bonus: number;
  deduction: number;
  effectiveDate: string;
}

@Injectable({ providedIn: 'root' })
export class SalaryService {
  private apiUrl = 'http://localhost:5011/api/salary';
  constructor(private http: HttpClient) {}

  getAll() { return this.http.get<Salary[]>(this.apiUrl); }
  getById(id: number) { return this.http.get<Salary>(`${this.apiUrl}/${id}`); }
  getByEmployee(empId: number) { return this.http.get<Salary[]>(`${this.apiUrl}/employee/${empId}`); }
  create(salary: Salary) { return this.http.post(this.apiUrl, salary); }
  update(id: number, salary: Salary) { return this.http.put(`${this.apiUrl}/${id}`, salary); }
  delete(id: number) { return this.http.delete(`${this.apiUrl}/${id}`); }
}
