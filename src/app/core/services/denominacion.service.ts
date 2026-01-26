import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Denominacion } from 'src/app/models/denominacion.model';
import { Result } from 'src/app/models/result.model';

@Injectable({
  providedIn: 'root',
})
export class DenominacionService {
  private apiUrl = 'http://localhost:8080/api/denominacion';

  constructor(private http: HttpClient) {}

  getDenominaciones(): Observable<Result<Denominacion[]>> {
    return this.http.get<Result<Denominacion[]>>(`${this.apiUrl}/listar`);
  }
}
