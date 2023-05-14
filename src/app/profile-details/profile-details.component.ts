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
import { ActivatedRoute, Router } from '@angular/router';

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

  currentUser: any;
  viewedUser: any;

  modalIsOpen!: boolean;
  selectedMovie: MovieDetails | undefined;

  listId: number = this.lists.length > 0 ? this.lists[0].id : null;
  //Lista seleccionada del dropdown

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private cookieService: CookieService,
    private listService: ListService,
    private movieService: MovieService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.token = this.cookieService.get('token');
    this.userData = jwtDecode(this.token);
    this.userId = this.userData.id;
    console.log('userdata:', this.userData.username, ' token.', this.token, " userId:",this.userId);
    //this.getLists();

    // Define this.currentUser
    this.currentUser = { id: this.userData.id, username: this.userData.username};

    const username = this.route.snapshot.paramMap.get('username');
    console.log("profile-details-username:",username + " current: "+this.currentUser.username);
    // Comprueba si el nombre de usuario es el del usuario actual
    if (username === this.currentUser.username) {
      // Si es el usuario actual, muestra su perfil
      this.viewedUser = this.currentUser;
      this.getListsByUser(this.viewedUser.id);
    } else {
      // Si es otro usuario, carga su perfil desde el servidor
      this.loadUserProfile(username!);
    }
  }

  loadUserProfile(username: string) {
    this.userService.getUserByUsername(username).subscribe((response) => {
      this.viewedUser = response;
      console.log('loadUserProfile: ', response);
    });
  }

  getListsByUser(id: number) {
    this.listService.getListsByUser(id).subscribe((response) => {
      this.lists = response;
      this.listId = this.lists.length > 0 ? this.lists[0].id : null;
      console.log('PROFILE-DETAILS-LISTID:', this.listId);
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
    this.catalogComponent!.getMovies(listId, this.viewedUser.id!); //this.userData.id
  }

  openModal(movie: MovieDetails) {
    this.selectedMovie = movie;
    this.modalIsOpen = true;
  }

  closeModal() {
    this.selectedMovie = undefined;
    this.modalIsOpen = false;
  }

  visitProfile(id: number): void {
    this.router.navigate(['/profile', id]);
  }
}
