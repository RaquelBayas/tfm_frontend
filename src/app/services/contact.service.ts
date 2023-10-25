import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import appConfig from 'src/app-config';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  constructor(private http: HttpClient) {}

  submitForm(formData: any): Observable<any> {
    const url = `${appConfig.backend.backendUrl}contact`;
    return this.http.post(url, formData);
  }
}
