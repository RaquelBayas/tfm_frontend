import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class UserStoreService {
  private _token!: string;

  constructor(private cookieService: CookieService) {}

  set token(token: string) {
    this._token = token;
    this.cookieService.set('token', this._token);
  }
  
  get token() {
    const cookieToken = this.cookieService.get('token');
    return this._token = cookieToken === '' ? this._token : cookieToken;
  }
  
  isLoggedIn() {
    return this.cookieService.check('token');
  }
  
}

