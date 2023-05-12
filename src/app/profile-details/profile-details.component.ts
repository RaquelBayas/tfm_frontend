import { Component, ViewChild } from '@angular/core';
import { CatalogComponent } from '../catalog/catalog.component';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { User } from '../model/user';
import { CookieService } from 'ngx-cookie-service';
import jwtDecode from 'jwt-decode';
import { ListService } from '../services/list.service';
import { MovieService } from '../services/movie.service';
import { MovieDetails } from '../model/movie-details';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.css'],
})
export class ProfileDetailsComponent {
  @ViewChild(CatalogComponent) catalogComponent: CatalogComponent | undefined;

  email: string | undefined;
  username: string = '';
  user!: User;
  userData!: any;
  userId!: number;
  token!: string;
  lists: any[] = [];

  modalIsOpen!: boolean;
  selectedMovie: MovieDetails | undefined;

  listId: number = this.lists.length > 0 ? this.lists[0].id : null;
  //Lista seleccionada del dropdown

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private cookieService: CookieService,
    private listService: ListService,
    private movieService: MovieService
  ) {}

  ngOnInit() {
    this.token = this.cookieService.get('token');
    this.userData = jwtDecode(this.token);
    this.userId = this.userData.id;
    console.log('userdata:', this.userData.username);
    //this.getLists();

    this.listService.getListsByUser(this.userData.id).subscribe((response) => {
      this.lists = response;
      this.listId = this.lists.length > 0 ? this.lists[0].id : null;
      console.log("PROFILE-DETAILS-LISTID:",this.listId);
      this.catalogComponent!.getMovies(this.listId, this.userData.id!);
    });
    
    
    
  }

  //Esto devuelve todas las listas de la bbdd
  getLists() {
    this.listService.getLists().subscribe((response) => {
      console.log('getLists:', response);
      this.lists = response;
      console.log('profile - lists2: ', this.lists);
    });
  }

  // Función para obtener las películas de la lista seleccionada
  getMoviesByList(listId: number): void {
    this.movieService.getMoviesFromList(listId).subscribe((response) => {
      //this.movies = response;
      console.log('GET MOVIES BY LIST: ', response);
    });
  }

  onListChange(listId: number): void {
    this.catalogComponent!.getMovies(listId, this.userData.id!);
  }

  openModal(movie: MovieDetails) {
    this.selectedMovie = movie;
    this.modalIsOpen = true;
  }

  closeModal() {
    this.selectedMovie = undefined;
    this.modalIsOpen = false;
  }
}
