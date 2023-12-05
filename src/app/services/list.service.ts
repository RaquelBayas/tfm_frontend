import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import { Observable, map } from 'rxjs';
import { List } from '../model/list';
import { environment } from 'src/environments';
import appConfig from 'src/app-config';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ListService implements OnInit {
  apiUrl = `${appConfig.backend.backendUrl}`;
  apiTmdbUrl = 'https://api.themoviedb.org/3';
  token!: string;
  userData!: any;
  userId!: number;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.token = this.authService.getToken();
    this.userData = this.authService.getUserDataFromToken();
  }

  ngOnInit(): void {
    this.token = this.authService.getToken();
    this.userData = this.authService.getUserDataFromToken();
  }

  createList(listData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.authService.getToken(),
    });

    return this.http.post(
      `${appConfig.backend.backendUrl}api/lists`,
      listData,
      {
        headers,
      }
    );
  }

  //Eliminar una lista del usuario
  deleteList(id: number, userId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.token,
    });
    console.log('deleteListService');
    return this.http.delete(
      `${appConfig.backend.backendUrl}api/users/${userId}/lists/${id}`,
      { headers }
    );
  }

  getLists(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.token,
    });
    return this.http.get(`${appConfig.backend.backendUrl}api/lists`, {
      headers,
    });
  }

  getMoviesFromList(listId: number): Observable<any> {
    return this.http.get(
      `${this.apiTmdbUrl}list/${listId}?api_key=${appConfig.tmdb.apikey}&language=es-ES`
    );
  }

  // Obtener listas del usuario
  getListsByUser(userId: number): Observable<any[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.token,
    });
    const url = `${this.apiUrl}/api/users/${userId}/lists`;
    return this.http.get<any[]>(url, { headers });
  }

  getListByIdAndUserId(listId: number, userId: number): Observable<List> {
    return this.http.get<any>(
      `${this.apiUrl}/api/users/${userId}/lists/${listId}`
    );
  }

  getListMeGusta(title: string, userId: number): Observable<List | null> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.token,
    });
    return this.http
      .get<any>(`${appConfig.backend.backendUrl}api/lists/${userId}/${title}`, {
        headers,
      })
      .pipe(
        map((response: any) => {
          if (response) {
            const list: List = {
              id: response.id,
              title: response.title,
              description: response.description,
              privacy: response.privacy,
              userId: response.userId,
              selectedContent: response.selectedContent,
            };
            return list;
          } else {
            return null;
          }
        })
      );
  }

  addContentToList(
    userId: number,
    listId: number,
    content: any[]
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.token,
    });
    /*return this.http.post(
      `${appConfig.backend.backendUrl}api/lists/${listId}`,
      content,
      { headers }
    );*/
    return this.http.post(
      `${appConfig.backend.backendUrl}api/users/${userId}/lists/${listId}`,
      content,
      { headers }
    );
  }

  updateContentList(listId: number, content: any[]): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.token,
    });
    return this.http.put(
      `${appConfig.backend.backendUrl}api/lists/${listId}`,
      content,
      { headers }
    );
  }
}
