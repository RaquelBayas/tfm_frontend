import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../model/user';
import { Subject } from 'rxjs';
import jwtDecode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  token: string = "";
  authState = new Subject<boolean>();

  constructor(private jwtHelper: JwtHelperService) {}

  public getSub(): string {
    const token : any = localStorage.getItem('token');
    const decodedToken = this.jwtHelper.decodeToken(token);
    console.log("decodedtoken: ",decodedToken.email);
    return decodedToken.email;
  }

  getUser(): User {
    const userString: any = localStorage.getItem('currentUser');
    const user: User = JSON.parse(userString);
    return user;
  }

  getToken() {
    return this.token;
  }

  setToken(token: string) {
    this.token = token;
    this.authState.next(true); // Notifica a los suscriptores que ha iniciado sesión
  }

  getUserDataFromToken() {
    const token = this.getToken();
    console.log("token getUserdata:",token);
    if (!token) {
      return null;
    }
    console.log("jwtdecode: ",jwtDecode(token));
    return jwtDecode(token);
  }

  isLoggedIn() {
    return !!this.token;
  }

  logOut() {
    this.token = "";
    this.authState.next(false); // Notifica a los suscriptores que ha cerrado sesión
  }
}
