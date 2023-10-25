import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ListService } from '../services/list.service';
import { MovieService } from '../services/movie.service';
import { environment } from 'src/environments';
import { AuthService } from '../services/auth.service';
import appConfig from 'src/app-config';
import { SeriesService } from '../services/series.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css'],
})
export class ListsComponent {
  lists: any[] = [];
  imgUrl: string = appConfig.tmdb.imgUrl;
  newList: any = {};
  selectedContent: any[] = [];
  listSource: string = 'listSource';
  token!: string;
  userData!: any;
  userId!: number;
  modalIsOpen!: boolean;
  listId!: number;
  searchInput!: string;
  searchResults: any[] = [];
  deleteModalIsOpen!: boolean;
  editModalIsOpen!: boolean;
  showMenu: boolean = false;

  constructor(
    private http: HttpClient,
    private listService: ListService,
    private movieService: MovieService,
    private seriesService: SeriesService,
    private authService: AuthService
  ) {
    if (this.authService.isLoggedIn()) {
      this.token = this.authService.getToken();
      this.userData = this.authService.getUserDataFromToken();
      this.userId = this.userData.id;
      this.getLists();
    }
  }

  getLists() {
    this.listService.getListsByUser(this.userId).subscribe((response) => {
      response.forEach((element: any) => {
        this.lists?.push(element);
      });
      this.lists.forEach((movie: any) => {
        this.newList = movie.selectedContent;
        this.newList.forEach((selectedContent: any) => {
          if (selectedContent.media_type === 'movie') {
            this.movieService
              .getMovieDetails(selectedContent.id)
              .subscribe((response: any) => {
                selectedContent.poster_path = this.movieService.getImages(
                  response.poster_path
                );
              });
          } else {
            this.seriesService
              .getSeriesDetails(selectedContent.id)
              .subscribe((response: any) => {
                selectedContent.poster_path = this.seriesService.getImages(
                  response.poster_path
                );
              });
          }
        });
      });
    });
  }

  addToList(listId: number) {
    let content: any = [];
    this.closeModal();
    this.selectedContent.forEach((response: any) => {
      if (response.media_type === 'movie') {
        content = [
          {
            id: response.id,
            title: response.title,
            media_type: response.media_type,
          },
        ];
      } else if (response.media_type === 'tv') {
        content = [
          {
            id: response.id,
            title: response.name,
            media_type: response.media_type,
          },
        ];
      }
    });
    this.listService
      .addContentToList(this.userId, listId, content)
      .subscribe(() => {
        const listIndex = this.lists.findIndex((list) => list.id === listId);
        if (listIndex > -1) {
          this.lists[listIndex].selectedContent = [
            ...this.lists[listIndex].selectedContent,
            ...content,
          ];
          content.forEach((selectedContent: any) => {
            if (selectedContent.media_type === 'movie') {
              this.movieService
                .getMovieDetails(selectedContent.id)
                .subscribe((response: any) => {
                  selectedContent.poster_path = this.movieService.getImages(
                    response.poster_path
                  );
                });
            } else if (selectedContent.media_type === 'tv') {
              this.seriesService
                .getSeriesDetails(selectedContent.id)
                .subscribe((response: any) => {
                  selectedContent.poster_path = this.seriesService.getImages(
                    response.poster_path
                  );
                });
            }
          });
        }
      });
    this.closeModal();
    window.location.reload();
  }

  openModal(listId: number) {
    this.modalIsOpen = true;
    this.listId = listId;
  }

  closeModal() {
    this.modalIsOpen = false;
  }

  openEditModal(listId: number) {
    this.editModalIsOpen = true;
    this.listId = listId;
  }

  openMenu(content: any) {
    const index = this.selectedContent.findIndex((item) => item === content);
    if (index !== -1) {
      this.selectedContent.splice(index, 1); // Cierra el menú
    } else {
      this.selectedContent.push(content); // Abre el menú
    }
  }

  isMenuOpen(content: any): boolean {
    return this.selectedContent.includes(content);
  }

  deleteList(listId: number) {
    this.listService.deleteList(listId, this.userId).subscribe(() => {
      window.location.reload();
    });
  }

  searchMovies(query: Event) {
    if ((query.target as HTMLInputElement).value.length > 0) {
      this.http
        .get(
          `${appConfig.tmdb.apiUrl}search/multi?query=${
            (query.target as HTMLInputElement).value
          }&api_key=${environment.apiKey}&language=es-ES`
        )
        .subscribe((response: any) => {
          this.searchResults = response.results;
        });
    } else {
      this.searchResults = [];
    }
  }

  onSelect(movie: any) {
    const index = this.selectedContent.findIndex((m) => m.id === movie.id);
    if (index > -1) {
      this.selectedContent.splice(index, 1);
    } else {
      this.selectedContent.push(movie);
    }
  }

  isSelected(movie: any) {
    return this.selectedContent.findIndex((m) => m.id === movie.id) > -1;
  }

  removeFromList(list: any, content: any): void {
    const index = list.selectedContent.findIndex(
      (item: any) => item.id === content.id
    );
    if (index !== -1) {
      list.selectedContent.splice(index, 1);
      this.listService
        .updateContentList(list.id, list.selectedContent)
        .subscribe((response: any) => {
          console.log('Contenido eliminado:', content);
          this.closeDeleteModal();
        });
    }
  }

  openDeleteModal(content: any, listId: number): void {
    this.selectedContent = content;
    this.listId = listId;
    this.deleteModalIsOpen = true;
  }

  closeDeleteModal(): void {
    this.deleteModalIsOpen = false;
  }
}
