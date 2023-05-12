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
      const user = {
        username: this.loginForm.value.username,
        password: this.loginForm.value.password,
      };
      this.userService.login(user).subscribe(
        (msg) => {
          console.log("data:",msg.auth_token);
          this.cookieService.set('token',msg.auth_token);
          this.authService.setToken(msg.auth_token);
          this.router.navigate(['/home-user']);
          console.log('Login: successful');
        },
        (err) => {
          console.log(err);
          console.log('Login ERROR');
        }
      );
    } else {
      console.log('Login: error');
    }
  }
}
