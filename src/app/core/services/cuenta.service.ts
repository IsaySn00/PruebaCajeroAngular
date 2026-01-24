import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Result } from 'src/app/models/result.model';

@Injectable({
  providedIn: 'root'
})
export class CuentaService {

  private apiUrl = "http://localhost:8080/api/cuenta"

  constructor(private http: HttpClient) { }

  getMontoCuentaUsuario(idUsuario:number): Observable<Result>{
    return this.http.get<Result>(`${this.apiUrl}/monto?idUsuario=${idUsuario}`);
  }
}
