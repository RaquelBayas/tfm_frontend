import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import appConfig from 'src/app-config';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
})
export class EditUserComponent implements OnInit {
  username!: string;
  password!: string;
  userData!: any;
  userId!: number;
  confirmPassword!: string;
  newUsername!: string;
  newPassword!: string;
  newEmail!: string;
  profileImageUrl!: string;

  showPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;
  missingPasswordAlert: boolean = false;
  oldPasswordAlert: boolean = false;
  passwordMismatchAlert: boolean = false;

  emailUpdated = false;
  emailUpdateError = false;
  showAlert = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.userData = this.authService.getUserDataFromToken();
    this.userId = this.userData.id;
  }

  ngOnInit(): void {
    this.getProfileImage(this.userId);
  }

  handleProfileImageChange(event: any) {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('profileImg', file);

    const ruta =
      appConfig.backend.backendUrl +
      `api/users/` +
      this.userId +
      `/upload-profileImg`;

    this.http.post(ruta, formData).subscribe(
      (response) => {
        window.location.reload();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getProfileImage(userId: number) {
    this.userService.getProfileImage(userId).subscribe((response: Blob) => {
      this.profileImageUrl = URL.createObjectURL(response);
    });
  }

  updatePassword() {
    if (!this.password) {
      this.missingPasswordAlert = true;
      setTimeout(() => {
        this.missingPasswordAlert = false;
      }, 1000);
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.passwordMismatchAlert = true;
      setTimeout(() => {
        this.passwordMismatchAlert = false;
      }, 1000);
      return;
    }
    if (this.newPassword.length < 8 || this.confirmPassword.length < 8) {
      alert('aaa');
    }

    this.userService
      .updatePassword(this.password, this.newPassword, this.userId)
      .subscribe(
        (updatePasswordResponse: any) => {
          console.log('Contraseña actualizada:', updatePasswordResponse);
          this.password = '';
          this.newPassword = '';
          this.confirmPassword = '';
        },
        (updatePasswordError: any) => {
          if (
            updatePasswordError.error.message === 'Contraseña actual incorrecta'
          ) {
            this.oldPasswordAlert = true;
            setTimeout(() => {
              this.oldPasswordAlert = false;
            }, 1000);
            return;
          } else {
            alert('Se ha producido un error');
          }
        }
      );
  }

  togglePasswordVisibility(field: string) {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else if (field === 'newPassword') {
      this.showNewPassword = !this.showNewPassword;
    } else if (field === 'confirmPassword') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  updateEmail() {
    this.userService.updateEmail(this.newEmail, this.userId).subscribe(
      (updateEmailResponse: any) => {
        console.log('Correo electrónico actualizado:', updateEmailResponse);
        this.emailUpdated = true;
        this.emailUpdateError = false;
        this.newEmail = '';
        this.showAlert = true;
        setTimeout(() => {
          this.showAlert = false;
        }, 3000);
      },
      (updateEmailError: any) => {
        console.error(
          'Error al actualizar el correo electrónico:',
          updateEmailError
        );
        this.emailUpdated = false;
        this.emailUpdateError = true;
        this.showAlert = true;
        setTimeout(() => {
          this.showAlert = false;
          this.emailUpdateError = false;
        }, 3000);
      }
    );
  }

  updateUsername() {
    this.userService.checkUsernameAvailability(this.username).subscribe(
      (response: any) => {
        // Nombre de usuario disponible, proceder con la actualización
        this.userService.updateUsername(this.username, this.userId).subscribe(
          (updateResponse: any) => {
            console.log('Nombre de usuario actualizado:', updateResponse);
          },
          (updateError: any) => {
            console.error(
              'Error al actualizar el nombre de usuario:',
              updateError
            );
          }
        );
      },
      (availabilityError: any) => {
        console.error(
          'Error al verificar la disponibilidad del nombre de usuario:',
          availabilityError
        );
      }
    );
  }
}
