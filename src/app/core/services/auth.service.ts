import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) { }

  login(numeroCuenta: string, nip: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, {
      numeroCuenta,
      nip
    });
  }

  guardarToken(token: string): void {
    localStorage.setItem('token', token);
  }

  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): Observable<any> {
    const token = this.obtenerToken();

    return this.http.post(
      `${this.baseUrl}/logout`,
      {},
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`
        })
      }
    ).pipe(
      tap(() => {
        this.limpiarSesion();
      })
    );
  }

  limpiarSesion(): void {
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.obtenerToken();
  }

  getTokenPayload(): any {
    const token = this.obtenerToken();
    if (!token) return null;

    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  }

  isAdmin(): boolean {
    const token = this.obtenerToken();
    if (!token) return false;

    const decoded: any = jwtDecode(token);

    return decoded.roles?.some((r: any) => r.authority === 'ROLE_admin');
  }

  getIdUsuario(): number | null {
    const token = this.obtenerToken();
    if (!token) return null;

    const decoded: any = jwtDecode(token);
    return decoded.idUsuario ?? null;
  }

}
