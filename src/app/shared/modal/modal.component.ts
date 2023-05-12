import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {

  @Input() movie: any;

  constructor() {}

  addReview(review: string) {
    // código para guardar la reseña en la base de datos o en un servicio
  }

}
