import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  public registerForm!: FormGroup;
  
  constructor(private builder: FormBuilder) {
    this.createForm();
  }

  createForm()  {
    this.registerForm = this.builder.group({
      email: ['', [Validators.required, Validators.min(1)]],
      password: ['', [Validators.required, Validators.min(1)]]
    });
  }

  register() {
    if(this.registerForm.valid) {
      const user = {
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
      };
      console.log("Register: Successful")
    } else {
      console.log("Register: There was an error");
    }
  } 
}