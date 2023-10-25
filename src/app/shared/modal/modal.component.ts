import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent {
  @Input() movie: any;
  @Input() modalIsOpen!: boolean;
  constructor() {}

  addReview(review: string) {
    // código para guardar la reseña en la base de datos o en un servicio
  }

  openModal() {
    this.modalIsOpen = true;
    console.log('abrir modal', this.modalIsOpen);
  }

  closeModal() {
    // Lógica para cerrar el modal
    this.modalIsOpen = false;
    console.log('cerrar modal');
  }
}
