import { Component } from '@angular/core';
import { SeriesService } from '../services/series.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SeriesDetails } from '../model/series-details';
import { Comment } from '../model/comment';
import appConfig from 'src/app-config';
import { List } from '../model/list';
import { ListService } from '../services/list.service';
import { Observable, map, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.css'],
})
export class SeriesComponent {
  serieId!: string;
  serie: any;
  imageUrl: string = '';
  serieDetails: SeriesDetails = {} as SeriesDetails;
  serieDirector!: any;
  comments: Comment[] = [];
  newComment: string = '';
  username!: string;
  userData!: any;
  userId!: number;
  socialNetworks: any;
  releaseDate!: any;

  favoriteList: List | null = null;
  favoriteStatus: { [movieId: string]: boolean } = {};

  constructor(
    private route: ActivatedRoute,
    private seriesService: SeriesService,
    private router: Router,
    private authService: AuthService,
    private listService: ListService
  ) {
    this.serieDetails.castList = [];
  }

  ngOnInit(): void {
    this.serieId = this.route.snapshot.paramMap.get('id')!;
    this.getSeriesDetails(this.serieId);
    this.getSeriesCast(this.serieId);

    if (this.authService.isLoggedIn()) {
      this.username = this.authService.getUser().username;
      this.userData = this.authService.getUserDataFromToken();
      this.userId = this.userData.id;
      this.isFavorite(Number(this.serieId)).subscribe((isFavorite) => {
        this.favoriteStatus[this.serieId] = isFavorite;
      });
    }
  }

  getSeriesDetails(id: string) {
    this.seriesService.getSeriesDetails(id).subscribe((response: any) => {
      this.serie = response;
      this.releaseDate = new Date(response.last_air_date).getFullYear();

      if (this.serie.poster_path) {
        this.imageUrl = `${appConfig.tmdb.imgUrl}${this.serie.poster_path}`;
      } else {
        this.imageUrl = 'assets/no-image-available.png';
      }
    });
    this.getSerieSocialNetworks(id);
  }

  getDescription(description: string) {
    if (!description) {
      return ['No tenemos datos acerca de su descripción'];
    }
    return description.split('\n\n');
  }

  getSerieSocialNetworks(id: string) {
    this.seriesService.getSerieSocialNetworks(id).subscribe((response) => {
      this.socialNetworks = response;
    });
  }

  getSeriesCast(id: string) {
    this.seriesService.getSeriesCast(id).subscribe((response) => {
      let cast = response.cast;
      this.serieDetails.castList = cast;
      this.serieDetails.crewList = response.crew;
      this.serie.director = this.serieDetails.crewList.find(
        (person: any) => person.job === 'Creator' || person.job === 'Director'
      );

      for (let i = 0; i < cast.length; i++) {
        this.serieDetails.castList[i].id = cast[i].id;
        this.serieDetails.castList[i].title = cast[i].name;
        this.serieDetails.castList[i].popularity = cast[i].popularity;
        this.serieDetails.castList[i].poster_path = cast[i].profile_path;
        this.serieDetails.castList[i].job = cast[i].known_for_department;
        this.serieDetails.castList[i].character = cast[i].character;
      }
    });
  }

  addToFavorites(serie: any) {
    this.listService
      .getListMeGusta('Me gusta', this.userId)
      .pipe(
        switchMap((list: List | null) => {
          if (list) {
            const content = [
              {
                id: serie.id,
                title: serie.name,
                media_type: 'tv',
              },
            ];
            console.log(list);
            return this.listService.addContentToList(
              this.userId,
              list.id,
              content
            );
          } else {
            const content = [
              {
                id: serie.id,
                title: serie.name,
                media_type: 'tv',
              },
            ];
            const favList = {
              title: 'Me gusta',
              description: '',
              privacy: 'private',
              userId: this.userId,
              selectedContent: content,
            };
            console.log('create');
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

  isFavorite(serieId: number): Observable<boolean> {
    if (this.favoriteStatus[serieId] !== undefined) {
      return of(this.favoriteStatus[serieId]);
    } else {
      return this.listService.getListMeGusta('Me gusta', this.userId).pipe(
        map((response: any) => {
          const favoriteList: List = response;
          if (favoriteList) {
            return favoriteList.selectedContent.some((content) => {
              return content.id === serieId && content.media_type === 'tv';
            });
          } else {
            return false;
          }
        }),
        tap((isFavorite) => {
          this.favoriteStatus[serieId] = isFavorite;
        })
      );
    }
  }

  toggleFavorites(serie: SeriesDetails): void {
    this.isFavorite(serie.id).subscribe((isFavorite) => {
      if (isFavorite) {
        this.removeFromFavorites(serie);
        this.favoriteStatus[serie.id] = false;
      } else {
        this.addToFavorites(serie);
        this.favoriteStatus[serie.id] = true;
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

  removeFromFavorites(serie: SeriesDetails): void {
    // Comprueba si la lista 'Me gusta' existe
    this.listService
      .getListMeGusta('Me gusta', this.userId)
      .pipe(
        switchMap((list: List | null) => {
          if (list) {
            // Si la lista 'Me gusta' existe, elimina el contenido correspondiente
            const updatedContent = list.selectedContent.filter((content) => {
              return content.id !== serie.id || content.media_type !== 'tv';
            });

            return this.listService.updateContentList(list.id, updatedContent);
          } else {
            return of(null);
          }
        })
      )
      .subscribe((response) => {
        console.log('Contenido eliminado de favoritos:', response);
        this.updateFavoriteList();
      });
  }

  goBack(): void {
    this.router.navigate(['/home-user']);
  }
}
