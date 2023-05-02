import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;

  constructor(private router: Router) {}
  
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    console.log("navbar token:",token);
    if (token) {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }
    console.log("logged:",this.isLoggedIn);
  }

  logout(): void {
    console.log("logged2:",this.isLoggedIn);
    localStorage.removeItem('token');
    this.isLoggedIn = false;
    console.log("logged3:",this.isLoggedIn);
    this.router.navigate(['/']);
  }
}
