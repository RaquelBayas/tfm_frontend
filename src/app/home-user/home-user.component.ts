import { Component, EventEmitter, Output } from '@angular/core';
import { MovieService } from '../services/movie.service';


@Component({
  selector: 'app-home-user',
  templateUrl: './home-user.component.html',
  styleUrls: ['./home-user.component.css']
})
export class HomeUserComponent {
  movies: any[] = [];
  query: string = '';
  imageUrl: string = '';
  baseUrl = 'https://image.tmdb.org/t/p/';

  @Output() onSelected = new EventEmitter<any>(); //Enviar datos al componente item
  
  constructor(private movieService: MovieService) { }

  Handle(event:number) {
    alert(`Rating: ${event}`);
  }

  search() {
    this.movieService.searchMovies(this.query)
      .subscribe((response:any) => {
        this.movies = response.results;
        this.imageUrl = `https://image.tmdb.org/t/p/w500/${response.results.poster_path}`;
       console.log(this.imageUrl);
       console.log(response.results.poster_path);
       console.log(response.results);
      });
  }

  /*getMoviesImages() {
    this.movieService.getImages(this.query)
    .subscribe((response:any) => {

      this.imageUrl = `https://image.tmdb.org/t/p/w500/${response.results.poster_path}`;
    })
  }*/

}