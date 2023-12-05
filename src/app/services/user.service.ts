import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../model/user';
import {
  Observable,
  catchError,
  map,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import appConfig from 'src/app-config';
import { AuthService } from './auth.service';
import { environment } from 'src/environments';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiUrl =  `${appConfig.backend.backendUrl}/api`//'http://localhost:8080/api';
  token!: string;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private cookieService: CookieService
  ) {
    this.token = this.authService.getToken();
  }

  login(user: any): Observable<any> {
    return this.http
      .post<User>(`${appConfig.backend.backendUrl}api/auth/signin`, user)
      .pipe(
        tap((response: any) => {
          this.cookieService.set('token', response.token);
        })
      );
  }

  register(user: User): Observable<User> {
    return this.http.post<User>(
      `${appConfig.backend.backendUrl}api/auth/signup`,
      user
    );
  }

  registerUser(user: User): Observable<any> {
    return this.checkUsernameAvailability(user.username).pipe(
      map((response: any) => {
        if (response.available) {
          console.log('user disponible');
          return this.http.post<User>(
            `${appConfig.backend.backendUrl}api/signup`,
            { user }
          );
        } else {
          throw new Error(`Nombre de usuario ${user.username} ya registrado`);
        }
      })
    );
  }

  checkUsernameAvailability(username: string): Observable<any> {
    return this.http
      .get(`${appConfig.backend.backendUrl}api/users?username=${username}`)
      .pipe(
        map((response: any) => {
          console.log('checkUser: ' + response);
          if (response.length === 0) {
            return { available: true };
          } else {
            return { available: false };
          }
        })
      );
  }

  getProfileImage(userId: number): Observable<Blob> {
    const apiUrl = `${appConfig.backend.backendUrl}api/users/${userId}/profileImg`;
    return this.http.get(apiUrl, { responseType: 'blob' }).pipe(
      catchError((error: any) => {
        if (error.status === 404) {
          return this.getDefaultImage();
        } else {
          throw error;
        }
      })
    );
  }

  getDefaultImage(): Observable<Blob> {
    const defaultImg =
      'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541';
    return this.http.get(defaultImg, { responseType: 'blob' });
  }

  getUserByUsername(username: string): Observable<User> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.authService.getToken(),
    });
    return this.http.get<User>(
      `${appConfig.backend.backendUrl}api/users/${username}`,
      { headers }
    );
  }

  getUsernameByID(id: number): Observable<string> {
    return this.http.get<string>(
      `${appConfig.backend.backendUrl}api/users/${id}/username`
    );
  }

  updateUsername(username: string, userId: number) {
    return this.checkUsernameAvailability(username).pipe(
      switchMap((response: any) => {
        // Si el nombre de usuario está disponible, procede con la actualización
        const updateUrl = `${appConfig.backend.backendUrl}api/users/${userId}`;
        const updateBody = { username: username };
        return this.http.put(updateUrl, updateBody);
      }),
      catchError((error: any) => {
        return throwError('Nombre de usuario no disponible.');
      })
    );
  }

  updateEmail(email: string, userId: number): Observable<any> {
    return this.http.post(
      `${appConfig.backend.backendUrl}api/users/${userId}/updateEmail`,
      { newEmail: email }
    );
  }

  updatePassword(password: string, newPassword: string, userId: number) {
    return this.http.post(
      `${appConfig.backend.backendUrl}api/users/${userId}/updatePassword`,
      { oldPassword: password, newPassword: newPassword }
    );
  }

  getUsers(): Observable<any> {
    return this.http.get<any[]>(`${appConfig.backend.backendUrl}api/users`);
  }

  searchUsersByUsername(username: string): Observable<any[]> {
    return this.http.get<any[]>(`${appConfig.backend.backendUrl}api/users`, {
      params: { username },
    });
  }

  getFollowers(userId: number): Observable<any> {
    return this.http.get(
      `${appConfig.backend.backendUrl}follow/${userId}/followersTotal`
    );
  }

  getFollowersList(userId: number): Observable<any> {
    return this.http.get<any[]>(
      `${appConfig.backend.backendUrl}follow/${userId}/followersList`
    );
  }

  getFollowingList(userId: number): Observable<any> {
    return this.http.get<any[]>(
      `${appConfig.backend.backendUrl}follow/${userId}/followingList`
    );
  }

  verifyPassword(password: string, userId: number): Observable<any> {
    return this.http.post(`${appConfig.backend.backendUrl}api/auth/${userId}`, {
      password,
    });
  }
}
