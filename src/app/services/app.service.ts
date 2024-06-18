import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { App } from 'app/model/app.model';
import { objectToQueryString } from './queryStringHelper';
const baseUrl = environment.idApiUrl + 'App';

@Injectable({
  providedIn: 'root'
})

export class AppService {
  constructor(private http: HttpClient) { }

  getAll(query: any): Observable<App[]> {
    const queryString = objectToQueryString(query);
    return this.http.get<App[]>(`${baseUrl}?${queryString}`);
  }

  getAllNoPaging(): Observable<App[]> {
    return this.http.get<App[]>(`${baseUrl}/nopaging`);
  }

  getByUser(): Observable<App[]> {
    return this.http.get<App[]>(`${baseUrl}/byUser?userId=${localStorage.getItem('userId')}`);
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

  updateAppUser(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/appUser/${id}`, data);
  }
}
