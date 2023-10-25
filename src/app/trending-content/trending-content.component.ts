import { Component, Input, OnInit } from '@angular/core';
import appConfig from 'src/app-config';

@Component({
  selector: 'app-trending-content',
  templateUrl: './trending-content.component.html',
  styleUrls: ['./trending-content.component.css'],
})
export class TrendingContentComponent implements OnInit {
  @Input() trendingContents: any[] = [];
  imgUrl!: string;

  slideConfig = {
    slidesToShow: 5,
    slidesToScroll: 5,
    dots: true,
    arrows: false,
    centerPadding: '0px',
    infinite: false,

    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          variableWidth: true,
          adaptativeHeight: true,
          //width: 200 // aquí establecemos el ancho fijo para dispositivos de ancho menor a 768px
        },
      },
      {
        breakpoint: 361,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          variableWidth: true,
          adaptativeHeight: true,
        }
      }
    ],
  };

  constructor() {
    this.imgUrl = appConfig.tmdb.imgUrl;
  }

  ngOnInit() {
  }

}
