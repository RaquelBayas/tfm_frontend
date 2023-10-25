import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CookieService } from 'ngx-cookie-service';

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
  searchTerm!: string;
  searchResults!: any[];

  isNavOpen!: boolean;

  constructor(
    private router: Router,
    private authService: AuthService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.authService.authState.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
      this.userData = this.authService.getUserDataFromToken();
      if (this.userData) {
        this.username = this.userData.username;
      }
    });
    this.userData = this.authService.getUserDataFromToken();
    if (this.userData) {
      this.username = this.userData.username;
    }
  }

  navigateToProfile() {
    const username = this.username;
    const token = this.authService.getToken();
    this.router.navigate(['/profile', username], { state: { token } });
  }

  togglenav() {
    console.log('toggle');
    this.isNavOpen = !this.isNavOpen;
  }

  logout(): void {
    this.authService.logOut();

    this.isLoggedIn = false;
    this.router.navigate(['/']);
  }

  goToLists() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['lists']);
    } else {
      this.router.navigate(['not-found']);
    }
  }

  onClickCatalog() {
    this.source = 'catalog'; // se establece el valor de source en 'catalog'
  }

  search(): void {
    if (this.searchTerm) {
      this.router.navigate(['/search-results', this.searchTerm]);
    }
    this.searchTerm = '';
  }
}
