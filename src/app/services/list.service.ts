import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import { Observable, map } from 'rxjs';
import { List } from '../model/list';
import { environment } from 'src/environments';

@Injectable({
  providedIn: 'root',
})
export class ListService {
  apiUrl = 'http://localhost:8080';
  apiTmdbUrl = 'https://api.themoviedb.org/3';
  token!: string;

  constructor(private http: HttpClient, private cookieService: CookieService) {
    const token = this.cookieService.get('token');
    this.token = token;
  }

  createList(listData: any): Observable<any> {
    console.log('createList - service: ', this.token);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.token, // Agrega el token al header "Authorization"
    });

    return this.http.post('http://localhost:8080/api/lists', listData, {
      headers,
    });
  }

  getLists(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.token, // Agrega el token al header "Authorization"
    });
    return this.http.get(this.apiUrl + '/api/lists', { headers });
  }

  getMoviesFromList(listId: number): Observable<any> {
    return this.http.get(
      `${this.apiTmdbUrl}list/${listId}?api_key=${environment.apiKey}&language=es-ES`
    );
  }

  // Obtener listas del usuario
  getListsByUser(userId: number): Observable<any[]> {
    const url = `${this.apiUrl}/api/users/${userId}/lists`;
    return this.http.get<any[]>(url);
  }

  // Obtener una
  getListByIdAndUserId(listId: number, userId: number): Observable<List> {
    console.log('GET LIST BY ID AND USER ID');
    return this.http.get<any>(
      `${this.apiUrl}/api/users/${userId}/lists/${listId}`
    );
  }
}
