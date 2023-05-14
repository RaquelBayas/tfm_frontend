import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import jwtDecode from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import { PersonService } from '../services/person.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  source: string = 'catalog';
  userData!: any;
  username!: string;
  token!: string;
  searchTerm!: string;
  searchResults!: any[];

  constructor(
    private router: Router,
    private authService: AuthService,
    private cookieService: CookieService,
    private personService: PersonService
  ) {
    this.token = this.cookieService.get('token');
    this.userData = jwtDecode(this.token);
    this.username = this.userData.username;
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.authService.authState.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    this.cookieService.delete('token');
    this.authService.logOut();

    this.isLoggedIn = false;
    console.log('logged3:', this.isLoggedIn);
    this.router.navigate(['/']);
  }

  getToken() {
    const cookies = document.cookie.split(';');
    let authToken = null;

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith('auth_token')) {
        authToken = cookie.substring('auth_token'.length, cookie.length);
        console.log('authToken navbar:', authToken);
      }
    }
    return authToken;
  }

  onClickCatalog() {
    this.source = 'catalog'; // se establece el valor de source en 'catalog'
  }

  search(): void {
    this.router.navigate(['/search-results', this.searchTerm]);
  }
}
