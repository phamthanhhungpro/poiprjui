import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { objectToQueryString } from './queryStringHelper';
const baseUrl = environment.prjApiUrl + 'CongViec';

@Injectable({
  providedIn: 'root'
})

export class CongViecService {
  constructor(private http: HttpClient) { }

  getNoPagingByDuAn(query: any): Observable<any[]> {
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

  getCongViecGrid(query: any): Observable<any[]> {
    const queryString = objectToQueryString(query);
    return this.http.get<any[]>(`${baseUrl}/GetCongViecGrid?${queryString}`);
  }

  getCongViecKanban(query: any): Observable<any[]> {
    const queryString = objectToQueryString(query);
    return this.http.get<any[]>(`${baseUrl}/GetCongViecKanban?${queryString}`);
  }

  updateKanbanStatus(data: any): Observable<any> {
    return this.http.put(`${baseUrl}/UpdateKanbanStatus`, data);
  }

  giaHanCongViec(data: any): Observable<any> {
    return this.http.put(`${baseUrl}/GiaHanCongViec`, data);
  }

  getCongViecGridByTrangThai(query: any): Observable<any[]> {
    const queryString = objectToQueryString(query);
    return this.http.get<any[]>(`${baseUrl}/GetCongViecGridByTrangThai?${queryString}`);
  }

  approveGiaHan(data: any): Observable<any> {
    return this.http.put(`${baseUrl}/ApproveGiaHanCongViec`, data);
  }

  approveTrangThai(data: any): Observable<any> {
    return this.http.put(`${baseUrl}/ApproveTrangThaiCongViec`, data);
  }

  duyetDeXuat(data: any): Observable<any> {
    return this.http.put(`${baseUrl}/ApproveDeXuatCongViec`, data);
  }
}
