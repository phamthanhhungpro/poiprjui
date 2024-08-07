import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { objectToQueryString } from '../queryStringHelper';
const baseUrl = environment.idApiUrl + 'PerFunction';

@Injectable({
  providedIn: 'root'
})

export class PerFunctiontService {
  constructor(private http: HttpClient) { }

  getAll(query: any): Observable<any[]> {
    const queryString = objectToQueryString(query);
    return this.http.get<any[]>(`${baseUrl}?${queryString}`);
  }

  getAllNoPaging(): Observable<any[]> {
    return this.http.get<any[]>(`${baseUrl}/nopaging`);
  }

  getAllGrouping(): Observable<any[]> {
    return this.http.get<any[]>(`${baseUrl}/withgroup`);
  }
  get(id: any): Observable<any> {
    return this.http.get<any>(`${baseUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }

  assginApi(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/assign-api`, data);
  }

  assginScope(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/assign-scope`, data);
  }
}
