import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CatalogComponent } from '../catalog/catalog.component';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { ListService } from '../services/list.service';
import { MovieDetails } from '../model/movie-details';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import appConfig from 'src/app-config';
import { MatDialog } from '@angular/material/dialog';
import { FollowersListComponent } from '../followers-list/followers-list.component';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.css'],
})
export class ProfileDetailsComponent implements OnChanges {
  @ViewChild(CatalogComponent) catalogComponent: CatalogComponent | undefined;
  @Input() username!: string;
  imgUrl: string = appConfig.tmdb.imgUrl;
  isLoggedIn!: boolean;
  isFollowing!: boolean;
  userData!: any;
  userId!: number;
  token!: string;
  lists: any[] = [];
  profileImg!: string;
  currentUser: any;
  viewerUser: any;
  viewerUserId!: number;

  selectedMovie: MovieDetails | undefined;
  selectedMovieModal: any = null;

  listId: number = this.lists.length > 0 ? this.lists[0].id : null; //ID película seleccionada en el dropdown
  profileImageUrl!: string;
  selectedListDescription!: string;

  //MODAL AÑADIR PELICULAS
  searchResults: any[] = [];
  selectedContent: any[] = [];

  totalFollowed!: number;
  totalFollowers!: number;
  listDescription: string =
    this.lists.length > 0 ? this.lists[0].description : '';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private listService: ListService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private dialog: MatDialog
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['username'] && !changes['username'].firstChange) {
      const newUsername = changes['username'].currentValue;
      this.loadUserProfile(newUsername);
    }
  }

  loadUserProfile(username: string) {
    this.userService.getUserByUsername(username).subscribe((response) => {
      this.viewerUser = response;
      this.viewerUserId = this.viewerUser.id;
      this.username = this.viewerUser.username;
      this.profileImg = this.viewerUser.profileImg;
      this.getProfileImage(this.viewerUser.id);
      this.getListsByUser(this.viewerUser.id);
      this.getFollowed(this.viewerUser.id);
      this.getFollowers(this.viewerUser.id);
      this.isFollowingUser();
    });
  }

  ngOnInit() {
    this.token = this.authService.getToken();
    this.isLoggedIn = this.authService.isLoggedIn();
    this.userData = this.authService.getUserDataFromToken();
    this.currentUser = {
      id: this.userData.id,
      username: this.userData.username,
    };
    console.log(this.listId);
    this.loadUserProfile(this.username);
  }

  getProfileImage(userId: number) {
    this.userService.getProfileImage(userId).subscribe((response: Blob) => {
      if (response) {
        this.profileImageUrl = URL.createObjectURL(response);
      } else {
        this.profileImageUrl = '../../assets/no-image-avilable.png';
      }
    });
  }

  getListsByUser(id: number) {
    this.listService.getListsByUser(id).subscribe((response) => {
      if (id === this.currentUser.id) {
        this.lists = response;
      } else {
        this.lists = response.filter((list) => list.privacy === 'public');
      }
      this.listId = this.lists.length > 0 ? this.lists[0].id : null;
      this.listDescription = this.lists[0].description;
      if (this.catalogComponent) {
        this.catalogComponent.getMoviesSeries(this.listId, id);
      }
    });
  }

  onListChange(listIdString: string): void {
    const listId = Number(listIdString);
    const selectedList = this.lists.find((list: any) => list.id === listId);

    this.listDescription = selectedList ? selectedList.description : '';
    if (this.catalogComponent) {
      this.catalogComponent.getMoviesSeries(listId, this.viewerUser.id);
    }
  }

  // AÑADIR PELICULAS
  isSelected(movie: any) {
    return this.selectedContent.findIndex((m) => m.id === movie.id) > -1;
  }

  searchMovies(query: Event) {
    const searchInput = (query.target as HTMLInputElement).value;
    if (searchInput.length > 0) {
      this.http
        .get(
          `${appConfig.tmdb.apiUrl}search/movie?language=es&query=${searchInput}&api_key=${environment.apiKey}`
        )
        .subscribe((response: any) => {
          this.searchResults = response.results;
          this.displaySearchResults();
        });
    } else {
      this.searchResults = [];
      this.displaySearchResults();
    }
  }

  displaySearchResults() {
    const searchResultsContainer = document.getElementById('searchResults');
    searchResultsContainer!.innerHTML = '';

    if (this.searchResults.length > 0) {
      this.searchResults.forEach((movie: any) => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');
        movieElement.innerHTML = `
          <img src="${appConfig.tmdb.imgUrl}${movie.poster_path}" alt="${movie.title}">
          <h4>${movie.title}</h4>
        `;
        movieElement.addEventListener('click', () => {
          this.showMovieDetails(movie);
        });
        searchResultsContainer!.appendChild(movieElement);
      });
    } else {
      searchResultsContainer!.innerHTML = 'No se encontraron resultados.';
    }
  }

  showMovieDetails(movie: any) {
    const movieDetailsContainer = document.getElementById('movieDetails');
    const moviePoster = document.getElementById(
      'moviePoster'
    ) as HTMLImageElement;
    const movieTitle = document.getElementById('movieTitle');
    const movieReview = document.getElementById(
      'movieReview'
    ) as HTMLTextAreaElement;

    moviePoster.src = `$${appConfig.tmdb.imgUrl}${movie.poster_path}`;
    movieTitle!.textContent = movie.title;
    movieReview.value = '';

    document.getElementById('searchResults')!.style.display = 'none';
    movieDetailsContainer!.style.display = 'block';
  }

  onSelect(movie: any) {
    const index = this.selectedContent.findIndex((m) => m.id === movie.id);
    if (index > -1) {
      this.selectedContent.splice(index, 1);
    } else {
      this.selectedContent.push(movie);
    }
  }

  openFollowersList(userId: number, type: string) {
    const dialogRef = this.dialog.open(FollowersListComponent, {
      data: { userId: userId, type: type },
    });
    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  followUser() {
    this.http
      .post(
        `${appConfig.backend.backendUrl}follow/${this.currentUser.id}/${this.viewerUser.id}`,
        {}
      )
      .subscribe((response: any) => {
        console.log(response);
        this.isFollowing = true;
      });
  }

  isFollowingUser() {
    if (this.currentUser.id !== this.viewerUser.id) {
      this.http
        .get(
          `${appConfig.backend.backendUrl}follow/${this.currentUser.id}/${this.viewerUser.id}`
        )
        .subscribe((response: any) => {
          this.isFollowing = response.isFollowing;
          this.getFollowed(this.viewerUser.id);
          this.getFollowers(this.viewerUser.id);
        });
    }
  }

  unfollowUser() {
    this.http
      .delete(
        `${appConfig.backend.backendUrl}follow/${this.currentUser.id}/${this.viewerUser.id}`
      )
      .subscribe((response: any) => {
        console.log(response);
        this.isFollowing = false;
        this.getFollowed(this.viewerUser.id);
        this.getFollowers(this.viewerUser.id);
      });
  }

  getFollowed(userId: number) {
    this.http
      .get(`${appConfig.backend.backendUrl}follow/${userId}/followedTotal`)
      .subscribe((response: any) => {
        this.totalFollowed = response.count;
      });
  }

  getFollowers(userId: number) {
    this.http
      .get(`${appConfig.backend.backendUrl}follow/${userId}/followersTotal`)
      .subscribe((response: any) => {
        this.totalFollowers = response.count;
      });
  }

  shouldShowCatalog(listId: number): boolean {
    const selectedList = this.lists.find((list) => list.id === listId);
    return (
      selectedList &&
      (selectedList.privacy === 'public' ||
        (selectedList.privacy === 'private' &&
          this.currentUser.id === this.viewerUserId))
    );
  }
}
