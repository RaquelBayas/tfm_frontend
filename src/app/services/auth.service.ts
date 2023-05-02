import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
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

}
