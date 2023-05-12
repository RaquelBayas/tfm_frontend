import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../services/movie.service';
import { Observable } from 'rxjs';
import { ListService } from '../services/list.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css'],
})
export class CatalogComponent implements OnInit {
  movies: any[] = [];
  query: string = '';
  imageUrl: string = '';
  baseUrl = 'https://image.tmdb.org/t/p/';
  currentPage = 1;
  totalPages = 1;
  isProfile!: boolean; //Variable para detectar si se utiliza desde profile
  @Input() listId!: number;
  @Input() userId!: number;
  @Input() source: string = 'catalog';
  @Input() selectedListId!: number;
 modalIsOpen!: boolean;

  ngOnInit() {
    this.getMovies();
    this.isProfile = this.route.snapshot.data['isProfile'];
    console.log("CATALOG-COMPONENT: PROFILE - ",this.isProfile);
    console.log("CATALOG-COMPONENT: MODALISOPEN - ",this.modalIsOpen);

  }

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private listService: ListService,
    private router: Router
  ) {
  }

  getMovies(listId?: number, userId?: number): void {
    if (this.source === 'catalog') {
      this.movieService.getPopularMovies().subscribe((response) => {
        //this.movies = response.results;
        this.movies = this.movies.concat(response.results);
        this.totalPages = response.total_pages;
        this.movies.forEach((movie) => {
          movie.imageUrl = this.movieService.getImages(movie.poster_path);
        });
      });
    } else if (this.source === 'lists') {
      if (listId && userId) {
        this.listService
          .getListByIdAndUserId(listId, userId)
          .subscribe((response: any) => {
            this.movies = response.selectedMovies;
            console.log("catalog-movies:",this.movies);
            this.totalPages = response.total_pages;
            this.movies.forEach((movie) => {
              this.movieService
                .getMovieDetails(movie.id)
                .subscribe((response: any) => {
                
                  movie.imageUrl = this.movieService.getImages(
                    response.poster_path
                  );
                });
            });
          });
      }
    }
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

  openModal() {
    this.modalIsOpen = true;
    console.log("abrir modal",this.modalIsOpen);
  }
  
  closeModal() {
    // Lógica para cerrar el modal
    this.modalIsOpen = false;
    console.log("cerrar modal");
  }
}
