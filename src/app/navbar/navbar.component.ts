import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  source: string = 'catalog';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.authService.authState.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });
    console.log('navbar token:', this.isLoggedIn);
  }

  logout(): void {
    console.log('logged2:', this.isLoggedIn);
    localStorage.removeItem('token');
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
}
