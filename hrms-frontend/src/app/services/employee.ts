import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  accountNumber: string;
  employmentStatus: string;
  joiningDate: string;
}

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private apiUrl = 'http://localhost:5011/api/employee';
  constructor(private http: HttpClient) {}

  getAll(search?: string) {
    return this.http.get<Employee[]>(`${this.apiUrl}?search=${search || ''}`);
  }
  getById(id: number) { return this.http.get<Employee>(`${this.apiUrl}/${id}`); }
  create(emp: Employee) { return this.http.post(this.apiUrl, emp); }
  update(id: number, emp: Employee) { return this.http.put(`${this.apiUrl}/${id}`, emp); }
  delete(id: number) { return this.http.delete(`${this.apiUrl}/${id}`); }
}