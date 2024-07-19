import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { objectToQueryString } from '../queryStringHelper';
const baseUrl = environment.idApiUrl + 'PerRole';

@Injectable({
  providedIn: 'root'
})

export class PerRoleService {
  constructor(private http: HttpClient) { }

  getAll(query: any): Observable<any[]> {
    const queryString = objectToQueryString(query);
    return this.http.get<any[]>(`${baseUrl}?${queryString}`);
  }

  getAllNoPaging(): Observable<any[]> {
    return this.http.get<any[]>(`${baseUrl}/nopaging`);
  }

  getFunctionScopeByRole(query: any): Observable<any[]> {
    const queryString = objectToQueryString(query);
    return this.http.get<any[]>(`${baseUrl}/function-scope-by-role?${queryString}`);
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

  assignFuncToRole(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/assign-function-to-role`, data);
  }

  assignRoleToUser(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/assign-role-to-user`, data);
  }
}
