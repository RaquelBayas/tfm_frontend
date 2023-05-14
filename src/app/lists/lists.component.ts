import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ListService } from '../services/list.service';
import { MovieService } from '../services/movie.service';
import { CookieService } from 'ngx-cookie-service';
import jwtDecode from 'jwt-decode';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css'],
})
export class ListsComponent {
  lists: any[] = [];
  imageUrl: string = '';
  newList: any = {};
  selectedMovies!: any[];
  token!: string;
  userData!: any;
  userId!: number;

  slideConfig = {
    slidesToShow: 5,
    slidesToScroll: 5,
    dots: true,
    arrows: false,
    centerPadding: '0px',
    infinite: false,
  };

  constructor(
    private http: HttpClient,
    private listService: ListService,
    private movieService: MovieService,
    private cookieService: CookieService
  ) {
    this.token = this.cookieService.get('token');
    this.userData = jwtDecode(this.token);
    this.userId = this.userData.id;
    this.getLists();
  }

  getLists() {
    this.listService.getListsByUser(this.userId).subscribe((response) => {
      console.log('getLists:', response.length);
      response.forEach((element: any) => {
        this.lists?.push(element);
      });
      this.lists.forEach((movie: any) => {
        this.newList = movie.selectedMovies;
        movie.selectedMovies.forEach((selectedMovie: any) => {
          this.movieService
            .getMovieDetails(selectedMovie.id)
            .subscribe((response: any) => {
              selectedMovie.poster_path = this.movieService.getImages(
                response.poster_path
              );

              console.log('poster:', response.poster_path);
            });
        });
        console.log('movie:', movie.selectedMovies);
      });
    });
  }

  /*createList() {
    this.http.post('/api/lists', this.newList).subscribe(() => {
      this.newList = {};
      this.getLists();
    });
  }*/
  /*
  addMovieToList(listId: string, movieId: string) {
    this.http.post(`/api/lists/${listId}/movies`, { movieId }).subscribe(() => {
      this.getLists();
    });
  }*/
}
