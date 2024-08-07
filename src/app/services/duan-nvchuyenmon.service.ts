import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { objectToQueryString } from './queryStringHelper';
const baseUrl = environment.prjApiUrl + 'DuAnNvChuyenMon';

@Injectable({
  providedIn: 'root'
})

export class DuAnNvChuyenMonService {
  constructor(private http: HttpClient) { }

  getAll(query: any): Observable<any[]> {
    const queryString = objectToQueryString(query);
    return this.http.get<any[]>(`${baseUrl}?${queryString}`);
  }

  getAllNoPaging(): Observable<any[]> {
    return this.http.get<any[]>(`${baseUrl}/nopaging`);
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

  getAllNvChuyenMon(): Observable<any[]> {
    return this.http.get<any[]>(`${baseUrl}/nvchuyenmon-nopaging`);
  }

  getAllDuAn(): Observable<any[]> {
    return this.http.get<any[]>(`${baseUrl}/duan-nopaging`);
  }

  getViecCaNhan(): Observable<any> {
    return this.http.get<any[]>(`${baseUrl}/canhan`);
  }

  getHoatDongDuan(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/hoatdongduan`, data);
  }

  getTongQuanDuAn(query): Observable<any> {
    const queryString = objectToQueryString(query);
    return this.http.get<any>(`${baseUrl}/tongquanduan?${queryString}`);
  }

  getTopHoatDong(query): Observable<any> {
    const queryString = objectToQueryString(query);
    return this.http.get<any>(`${baseUrl}/topHoatDong?${queryString}`);
  }

  openCloseDuAn(data: any): Observable<any> {
    return this.http.put(`${baseUrl}/open-close`, data);
  }
}
