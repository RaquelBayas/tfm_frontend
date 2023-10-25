import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent implements OnInit {
  @Input() data!: any;
  @Input() source!: any;
  imgUrl: string = 'https://image.tmdb.org/t/p/w1280';

  constructor() {}

  ngOnInit(): void { 
  }
}
