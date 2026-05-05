import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./auth/login/login').then(m => m.LoginComponent) },
  { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard').then(m => m.DashboardComponent), canActivate: [authGuard] },
  { path: 'employees', loadComponent: () => import('./employees/employee-list/employee-list').then(m => m.EmployeeListComponent), canActivate: [authGuard] },
  { path: 'salary', loadComponent: () => import('./salary/salary-list/salary-list').then(m => m.SalaryListComponent), canActivate: [authGuard] },
  { path: 'payroll', loadComponent: () => import('./payroll/payroll-list/payroll-list').then(m => m.PayrollListComponent), canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' }
];
