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
    private router: Router,
    private cookieService: CookieService
  ) {
    this.createForm();
  }

  createForm() {
    this.loginForm = this.builder.group({
      email: ['', [Validators.required, Validators.min(1)]],
      password: ['', [Validators.required, Validators.min(1)]],
    });
  }

  login() {
    if (this.loginForm.valid) {
      const user = {
        username: "",
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
      };
      this.userService.login(user).subscribe(
        (msg) => {
          console.log("data:",msg);
          this.cookieService.set('token',msg.token);
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
