import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.css']
})
export class StarRatingComponent implements OnInit {

  @Input() maxRating = 5;
  maxRatingArr: any = [];
  @Input() selectedStar: number = 0;
  previousSelection = 0;

  @Input() reviewRating!: number;
  @Output() onRating: EventEmitter<number> = new EventEmitter<number>();
  
  constructor() {}

  ngOnInit() {
    this.maxRatingArr = Array(this.maxRating).fill(0);
    this.selectedStar = this.reviewRating;
  }

  HandleMouseEnter(index: number) {
    this.selectedStar = index + 1;
  }

  HandleMouseLeave(index: number) {
    if(this.previousSelection!==0) {
      this.selectedStar = this.previousSelection;
    } else {
      this.selectedStar = 0;
    }
  }

  rating(index:number) {
    this.selectedStar = index + 1;
    this.previousSelection = this.selectedStar;
    this.onRating.emit(this.selectedStar);  
  }

}
