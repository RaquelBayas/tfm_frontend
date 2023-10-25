import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import appConfig from 'src/app-config';
import { PersonService } from '../services/person.service';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css'],
})
export class PersonComponent {
  imgUrl: string = appConfig.tmdb.imgUrl;
  person_id: any;
  person: any;

  constructor(
    private route: ActivatedRoute,
    private personService: PersonService
  ) {
    let id = this.route.snapshot.params['id'];
    this.person_id = id;
  }
}
