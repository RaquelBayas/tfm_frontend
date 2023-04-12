import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public loginForm!: FormGroup;

  constructor(private builder: FormBuilder) {
    this.createForm();
  }

  createForm() {
    this.loginForm = this.builder.group({
      email: ['',[Validators.required, Validators.min(1)]],
      password: ['',[Validators.required, Validators.min(1)]]
    })
  }

  login() {
    if(this.loginForm.valid) {
      console.log("Login: successful");
    } else {
      console.log("Login: error");
    }
  }
}
