import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { objectToQueryString } from './queryStringHelper';
const baseUrl = environment.idApiUrl + 'File';

@Injectable({
  providedIn: 'root'
})

export class FileService {
  constructor(private http: HttpClient) { }

  uploadFile(formData: FormData): Observable<any> {
    return this.http.post(`${baseUrl}/upload`, formData);
  }

}
