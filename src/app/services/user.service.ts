import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../model/user';
import { Observable, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiUrl = 'http://localhost:3002/api';
  
  constructor(private http: HttpClient) { }

  login(user: User): Observable<any> {
    return this.http.post<User>('http://localhost:3002/api/login',user).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        console.log("response login:",response);
      }));
  }

  register(user: User): Observable<User> {
    return this.http.post<User>('http://localhost:3002/api/signup',user);
  }

  registerUser(user:User): Observable<any> {
    return this.checkUsernameAvailability(user.username).pipe(
      map((response: any) => {
        if (response.available) {
          console.log('user disponible');
          return this.http.post<User>(`${this.apiUrl}/signup`, { user });
        } else {
          throw new Error(`Username ${user.username} is already taken`);
        }
      })
    );
  }

  checkUsernameAvailability(username: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users?username=${username}`).pipe(
      map((response: any) => {
        console.log("checkUser: "+response);
        if (response.length === 0) {
          return { available: true };
        } else {
          return { available: false };
        }
      })
    );
  }

  getUserEmail(): Observable<any> {
    const token = localStorage.getItem('token');
    console.log("token user serv. ",token);
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    console.log("headers: ",headers);
    return this.http.get(this.apiUrl+`/api/user`, { headers });
  }

  public getUsername(email: string): Observable<string> {
    //return "";
    return this.http.get(`${this.apiUrl}/users:${email}`).pipe(
      map((response: any) => {
        console.log("checkUser: "+response);
        return response;
      })
    );
  }
  
  getUser(email: string) {
    return this.http.get(`${this.apiUrl}/user?email=${email}`).pipe(map((data)=> {
      console.log("data:",data);
      return data;
    }))
  
  }

  getToken(): string {
    return localStorage.getItem('token')!;
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }
}
