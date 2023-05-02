import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  @Input() data!: any;
  imgUrl: string = 'https://image.tmdb.org/t/p/w200';
  @Input() isCollections: boolean = false;

  constructor() {}

  ngOnInit(): void {}
  float2int(value: any) {
    return value | 0;
  }
}
