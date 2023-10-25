import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  [x: string]: any;
  public registerForm!: FormGroup;
  showAlert = false;
  showSuccess = false;

  constructor(
    private builder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.createForm();
  }

  createForm() {
    this.registerForm = this.builder.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(16),
        ],
      ],
      profileImg: [''],
    });
  }

  register() {
    if (this.registerForm.valid) {
      const user = {
        username: this.registerForm.value.username,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        profileImg: '',
      };
      this.userService.register(user).subscribe(() => {
        this.showSuccess = true;
        this.router.navigate(['/login']); 
      });
    } else {
      this.showAlert = true;
      console.log('Se produjo un error en el registro');
    }
  }
}
