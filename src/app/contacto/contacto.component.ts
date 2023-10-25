import { Component } from '@angular/core';
import { ContactService } from '../services/contact.service';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css'],
})
export class ContactoComponent {
  formData = {
    name: '',
    email: '',
    subject: '',
    message: '',
  };

  constructor(private contactService: ContactService) {}

  submitForm() {
    console.log(this.formData);

    this.contactService.submitForm(this.formData).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.error(error);
      }
    );

    this.formData = {
      name: '',
      email: '',
      subject: '',
      message: '',
    };
  }
}
