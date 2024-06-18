import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { objectToQueryString } from './queryStringHelper';
import { User } from 'app/model/user.model';
const baseUrl = environment.idApiUrl + 'User';
const authUrl = environment.idApiUrl + 'auth'
@Injectable({
  providedIn: 'root'
})

export class UserApiService {
  constructor(private http: HttpClient) { }

  getAll(query: any): Observable<User[]> {
    const queryString = objectToQueryString(query);
    return this.http.get<User[]>(`${baseUrl}?${queryString}`);
  }

  getAllNoPaging(): Observable<User[]> {
    return this.http.get<User[]>(`${baseUrl}/nopaging`);
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

  login(credentials: any): Observable<any> {
    return this.http.post(`${authUrl}/login`, credentials);
  }
  getListUser(body: any): Observable<any> {
    return this.http.post(`${baseUrl}/list`, body);
  }

  uploadAvatar(avatar: File) {
    const fd = new FormData();
    fd.append('avatar', avatar, avatar.name);
    return this.http.post<any>(`${baseUrl}/avatar`, fd);
  }

  createUser(data: any): Observable<any> {
    return this.http.post(`${authUrl}/create-user`, data);
  }

  getByUserName(query): Observable<User[]> {
    const queryString = objectToQueryString(query);

    return this.http.get<User[]>(`${baseUrl}/username?${queryString}`);
  }

  resetPwd(data: any): Observable<any> {
    return this.http.post(`${authUrl}/resetPassword`, data);
  }

  getListCanbeManager(query): Observable<any[]> {
    const queryString = objectToQueryString(query);

    return this.http.get<User[]>(`${baseUrl}/can-be-manager?${queryString}`);
  }

  getListAppAdmin(): Observable<any[]> {
    return this.http.get<any[]>(`${baseUrl}/appadmin`);
  }

  getListMember(): Observable<any[]> {
    return this.http.get<any[]>(`${baseUrl}/member`);
  }

  getListAdmin(): Observable<any[]> {
    return this.http.get<any[]>(`${baseUrl}/admin`);
  }

  getUserToCreateHoSoNhanSu(): Observable<any[]> {
    return this.http.get<any[]>(`${baseUrl}/create-hosonhansu`);
  }

  getUserPhongBanInfo(query): Observable<any> {
    const queryString = objectToQueryString(query);

    return this.http.get<any>(`${baseUrl}/phongban?${queryString}`);
  }
}
