import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { UserService } from '../services/user.service';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  [x: string]: any;
  public registerForm!: FormGroup;
  
  constructor(private builder: FormBuilder, private userService: UserService) {
    this.createForm();
  }

  createForm()  {
    this.registerForm = this.builder.group({
      username: ['',[Validators.required, Validators.min(3)]],
      email: ['', [Validators.required, Validators.min(1)]],
      password: ['', [Validators.required, Validators.min(1)]]
    });
  }

  register() {
    if(this.registerForm.valid) {
      const user = {
        username: this.registerForm.value.username,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
      };
      this.userService.register(user).subscribe((response: any) => {
        console.log(response);console.log("Register: Successful")
      });
      
    } else {
      console.log("Register: There was an error");
    }
  } 

  
}