import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Result } from 'src/app/models/result.model';
import { RetiroDTO } from 'src/app/models/retiro.dto';

@Injectable({
  providedIn: 'root'
})
export class CajeroService {

  private apiUrl = "http://localhost:8080/api/cajero";

  constructor(private http: HttpClient) { }

  retirarDinero(retiro: RetiroDTO): Observable<Result> {
    return this.http.post<Result>(`${this.apiUrl}/retirar`, retiro);
  }

}
