import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../services/movie.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {
  movies: any[] = [];
  query: string = '';
  imageUrl: string = '';
  baseUrl = 'https://image.tmdb.org/t/p/';
  currentPage = 1;
  totalPages = 1;

  ngOnInit() {
    this.getMovies();
  }

  constructor(private route: ActivatedRoute, private movieService: MovieService, private router: Router) {
    //this.getMovies();
  }

  getMovies(): void {
    this.movieService.getMovies().subscribe((response) => {
      //this.movies = response.results;
      this.movies = this.movies.concat(response.results);
      this.totalPages = response.total_pages;
      this.movies.forEach((movie) => {
        movie.imageUrl = this.movieService.getImages(movie.poster_path);
      });
    })
  }

  

  getImageUrl(posterPath: string): string {
    return this.movieService.getImages(posterPath);
  }

  onScroll() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getMovies();
    }
  }
}
