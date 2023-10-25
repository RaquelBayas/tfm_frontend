import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../services/movie.service';
import { MovieDetails } from '../model/movie-details';
import { AuthService } from '../services/auth.service';
import appConfig from 'src/app-config';
import { ListService } from '../services/list.service';
import { List } from '../model/list';
import { Observable, map, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css'],
})
export class MoviesComponent implements OnInit {
  movieId!: string;
  movie: any = {};
  imageUrl: string = '';
  movieDetails: MovieDetails = {} as MovieDetails;
  username!: string;
  userData!: any;
  userId!: number;
  socialNetworks: any;

  isLoggedIn!: boolean;
  favoriteList: List | null = null;
  favoriteStatus: { [movieId: string]: boolean } = {};
  releaseDate!: number;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private listService: ListService,
    private router: Router,
    private authService: AuthService
  ) {
    this.movieDetails.castList = [];
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.movieId = this.route.snapshot.paramMap.get('id')!;
    this.getMovieDetails(this.movieId);
    this.getMovieCast(this.movieId);
    if (this.authService.isLoggedIn()) {
      this.username = this.authService.getUser().username;
      this.userData = this.authService.getUserDataFromToken();
      this.userId = this.userData.id;
      this.isFavorite(Number(this.movieId)).subscribe((isFavorite) => { 
        this.favoriteStatus[this.movieId] = isFavorite;
      });
    }
  }

  getMovieDetails(id: string) {
    this.movieService.getMovieDetails(id).subscribe((response:any) => {
      this.movie = response;
      this.releaseDate = new Date(response.release_date).getFullYear();
      if (this.movie.poster_path) {
        this.imageUrl = `${appConfig.tmdb.imgUrl}${this.movie.poster_path}`;
      } else {
        this.imageUrl = 'assets/no-image.png';
      }
    });
    this.getMovieSocialNetworks(id);
  }

  getMovieSocialNetworks(id: string) {
    this.movieService
      .getMovieSocialNetworks(id)
      .subscribe((response) => {
        this.socialNetworks = response;
      });
  }

  getMovieCast(id: string) {
    this.movieService.getMovieCast(id).subscribe((response) => {
      let cast = response.cast;
      this.movieDetails.castList = cast; 
      this.movieDetails.crewList = response.crew;
      this.movie.director = this.movieDetails.crewList.find(
        (person: any) => person.job === 'Director' || person.job === 'Creator'
      );

      for (let i = 0; i < cast.length; i++) {
        this.movieDetails.castList[i].id = cast[i].id;
        this.movieDetails.castList[i].title = cast[i].name;
        this.movieDetails.castList[i].popularity = cast[i].popularity;
        this.movieDetails.castList[i].poster_path = cast[i].profile_path;
        this.movieDetails.castList[i].job = cast[i].known_for_department;
        this.movieDetails.castList[i].character = cast[i].character;
      }
    });
  }

  addToFavorites(movie: MovieDetails) { 
    this.listService
      .getListMeGusta('Me gusta', this.userId)
      .pipe(
        switchMap((list: List | null) => {
          if (list) { 
            // Si la lista 'Me gusta' ya existe, se agrega contenido a esa lista
            const content = [
              {
                id: movie.id,
                title: movie.title,
                media_type: 'movie',
              },
            ];

            return this.listService.addContentToList(this.userId, list.id, content);
          } else {
            // Si la lista 'Me gusta' no existe, se crea una nueva lista y agrega el contenido
            const content = [
              {
                id: movie.id,
                title: movie.title,
                media_type: 'movie',
              },
            ];
            const favList = {
              title: 'Me gusta',
              description: '',
              privacy: 'private',
              userId: this.userId,
              selectedContent: content,
            };

            return this.listService.createList(favList).pipe(
              tap((createdList: List) => { 
                list = createdList;
              })
            );
          }
        })
      )
      .subscribe((response) => {
        console.log('Operación completada:', response);
        this.updateFavoriteList();
      });
  }

  isFavorite(movieId: number): Observable<boolean> {
    if (this.favoriteStatus[movieId] !== undefined) {
      return of(this.favoriteStatus[movieId]);
    } else {
      return this.listService.getListMeGusta('Me gusta', this.userId).pipe(
        map((response: any) => {
          const favoriteList: List = response;
          if (favoriteList && favoriteList.selectedContent) {
            return favoriteList.selectedContent.some((content) => {
              return content.id === movieId && content.media_type === 'movie';
            });
          } else {
            return false;
          }
        }),
        tap((isFavorite) => {
          this.favoriteStatus[movieId] = isFavorite;
        })
      );
    }
  }
  

  toggleFavorites(movie: MovieDetails): void {
    this.isFavorite(movie.id).subscribe((isFavorite) => {
      if (isFavorite) { 
         this.removeFromFavorites(movie); 
        this.favoriteStatus[movie.id] = false;
      } else {
        this.addToFavorites(movie);
        this.favoriteStatus[movie.id] = true;
      }
    });
  }

  private updateFavoriteList(): void {
    this.listService
      .getListMeGusta('Me gusta', this.userId)
      .subscribe((response: any) => {
        this.favoriteList = response;
      });
  }

  removeFromFavorites(movie: MovieDetails): void {
    // Comprueba si la lista 'Me gusta' existe
    this.listService.getListMeGusta('Me gusta', this.userId).pipe(
      switchMap((list: List | null) => {
        if (list) {
          // Si la lista 'Me gusta' existe, elimina el contenido correspondiente
          const updatedContent = list.selectedContent.filter((content) => {
            return content.id !== movie.id || content.media_type !== 'movie';
          });
    
          return this.listService.updateContentList(list.id, updatedContent);
        } else {
          // Si la lista 'Me gusta' no existe, no se puede eliminar el contenido
          return of(null);
        }
      })
    ).subscribe((response) => {
      console.log('Contenido eliminado de favoritos:', response);
      this.updateFavoriteList();
    });
  }
  
  goBack(): void {
    this.router.navigate(['/home-user']);
  }
}
