import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:5011/api/auth';

  constructor(private http: HttpClient) {}

  login(credentials: {username: string, password: string}) {
    return this.http.post<{token: string}>(`${this.apiUrl}/login`, credentials);
  }
  saveToken(token: string) { localStorage.setItem('token', token); }
  getToken() { return localStorage.getItem('token'); }
  isLoggedIn() { return !!this.getToken(); }
  logout() { localStorage.removeItem('token'); }
}
