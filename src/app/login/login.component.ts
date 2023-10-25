import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  public loginForm!: FormGroup;
  spinner: boolean = false;
  showAlert: boolean = false;

  constructor(
    private builder: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private cookieService: CookieService
  ) {
    this.createForm();
  }

  createForm() {
    this.loginForm = this.builder.group({
      username: ['', [Validators.required, Validators.min(1)]],
      password: ['', [Validators.required, Validators.min(1)]],
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.spinner = true;
      const user = {
        username: this.loginForm.value.username,
        password: this.loginForm.value.password,
      };
      this.userService.login(user).subscribe(
        (msg) => {
          this.spinner = false;
          this.cookieService.set('token', msg.auth_token);
          this.cookieService.set('currentUser', JSON.stringify(user));
          this.authService.setToken(msg.auth_token);
          this.router.navigate(['/home-user']);
          console.log('Login: successful');
        },
        (err) => {
          this.spinner = false;
          this.showAlert = true;
          console.log(err);
        }
      );
    } else {
      this.showAlert = true;
      console.log('Login: error');
    }
  }
}
