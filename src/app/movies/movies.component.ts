import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../services/movie.service';
import { MovieDetails } from '../model/movie-details';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})
export class MoviesComponent implements OnInit {
  itemID!: number;
  movie: any;
  imageUrl: string = '';
  baseUrl = 'https://image.tmdb.org/t/p/w200';
  movieDetails: MovieDetails = {} as MovieDetails;

  slideConfig = {
    slidesToShow: 5,
    slidesToScroll: 5,
    dots: true,
    arrows: false,
    centerPadding: '0px',
    infinite: false,
    responsive: [
      {
        settings: {
          breakpoint: 768,
          slidesToShow: 4,
          slidesToScroll: 4,
          //variableWidth: true,
          //width: 200 // aquí establecemos el ancho fijo para dispositivos de ancho menor a 768px
        }
      }
    ]
  };

  constructor(private route: ActivatedRoute, private movieService: MovieService, private router: Router) {
    this.movieDetails.castList = [];

  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.getMovieDetails(id);
    this.getMovieCast(id);
  }

  getMovieDetails(id:string) {
    this.movieService.getMovieDetails(id)
    .subscribe(response => {
      this.movie = response;
      this.imageUrl = `${this.baseUrl}${this.movie.poster_path}`;
    });
  }

  getMovieCast(id:string) {
    this.movieService.getMovieCast(id).subscribe((response) =>{
      let cast = response.cast;
      this.movieDetails.castList = cast;
      
      for (let i = 0; i < cast.length; i++) {
        this.movieDetails.castList[i].id = cast[i].id;
        this.movieDetails.castList[i].title = cast[i].name;
        this.movieDetails.castList[i].popularity = cast[i].popularity;
        this.movieDetails.castList[i].poster_path = cast[i].profile_path;
        this.movieDetails.castList[i].job = cast[i].known_for_department;
        this.movieDetails.castList[i].character = cast[i].character;
      }
      console.log(response);
    });
  }

  goBack(): void {
    this.router.navigate(['/home-user']);
  }

}
