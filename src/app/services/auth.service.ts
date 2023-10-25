import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../model/user';
import { Subject } from 'rxjs';
import jwtDecode from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  token: string = '';
  authState = new Subject<boolean>();

  constructor(
    private jwtHelper: JwtHelperService,
    private cookieService: CookieService
  ) {
    this.token = this.cookieService.get('token');
    this.authState.next(!!this.token);
  }

  public getSub(): string {
    const token: any = this.cookieService.get('token');
    const decodedToken = this.jwtHelper.decodeToken(token);
    return decodedToken.email;
  }

  getUser(): User {
    const userString: any = this.cookieService.get('currentUser');
    const user: User = JSON.parse(userString);
    return user;
  }

  getToken() {
    return this.cookieService.get('token');
  }

  setToken(token: string) {
    this.token = token;
    this.cookieService.set('token', token);
    this.authState.next(true); // Notifica a los suscriptores que ha iniciado sesión
  }

  getUserDataFromToken() {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    return jwtDecode(token);
  }

  isLoggedIn() {
    return !!this.token;
  }

  logOut() {
    this.cookieService.delete('token');
    this.cookieService.delete('currentUser');
    this.authState.next(false); // Notifica a los suscriptores que ha cerrado sesión
  }
}
