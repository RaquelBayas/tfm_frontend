import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../services/movie.service';
import { ListService } from '../services/list.service';
import { SeriesService } from '../services/series.service';
import { AuthService } from '../services/auth.service';
import appConfig from 'src/app-config';
import { environment } from 'src/environments';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css'],
})
export class CatalogComponent implements OnInit {
  content: any[] = [];
  userData!: any;
  imageUrl: string = '';
  currentPage = 1;
  totalPages = 1;
  isProfile!: boolean; //Variable para detectar si se utiliza Catalog desde profile
  @Input() listId!: number;
  @Input() userId!: number;
  @Input() source: string = 'catalog';
  @Input() selectedListId!: number;
  @Input() viewerId!: number;
  newListId!: number;
  modalIsOpen!: boolean;

  isSortedAZ!: boolean;
  isSortedZA!: boolean;
  filterSeries!: boolean;
  filterMovies!: boolean;
  genresMovies: any[] = [];
  genresSeries: any[] = [];
  selectedGenreMovies!: string;
  selectedGenreSeries!: string;
  selectedGenres: { id: number; selected: boolean }[] = [];
  showGenresDropdown: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private listService: ListService,
    private seriesService: SeriesService,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.getMovies();
    this.getSeries();
    this.getMoviesGenresList();
    this.getSeriesGenresList();
    this.isProfile = this.route.snapshot.data['isProfile'];
    this.userData = this.authService.getUserDataFromToken();
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('listId' in changes || 'userId' in changes) {
      this.getMoviesSeries(this.listId, this.userId);
    }
  }

  getMoviesSeries(listId?: number, userId?: number): void {
    this.content = [];
    this.listId = listId!;
    if (this.source === 'lists') {
      if (listId && userId) {
        this.listService
          .getListByIdAndUserId(listId, userId)
          .subscribe((response: any) => {
            this.content = response.selectedContent;
            this.totalPages = response.total_pages;

            this.content.forEach((content_item) => {
              if (content_item.media_type === 'movie') {
                this.movieService
                  .getMovieDetails(content_item.id)
                  .subscribe((response: any) => {
                    content_item.imageUrl = this.movieService.getImages(
                      response.poster_path
                    );
                  });
              } else {
                this.seriesService
                  .getSeriesDetails(content_item.id)
                  .subscribe((response: any) => {
                    content_item.imageUrl = this.seriesService.getImages(
                      response.poster_path
                    );
                  });
              }
            });
          });
      }
    }
  }

  getMovies(): void {
    this.content = [];
    if (this.source === 'catalog') {
      this.movieService
        .getPopularMovies(this.currentPage)
        .subscribe((response) => {
          this.content = this.content.concat(response.results);
          this.totalPages = response.total_pages;
          this.content.forEach((movie) => {
            movie.imageUrl = this.movieService.getImages(movie.poster_path);
          });
        });
    }
  }

  sortContentAtoZ(): void {
    this.isSortedAZ = true;
    this.content = [];

    this.movieService
      .getMoviesByTitleAsc(this.currentPage)
      .subscribe((response) => {
        this.content = this.content.concat(response.results);
        this.content.forEach((movie) => {
          movie.imageUrl = this.movieService.getImages(movie.poster_path);
        });
      });
  }

  sortContentZtoA(): void {
    this.isSortedZA = true;
    this.content = [];

    this.movieService
      .getMoviesByTitleDesc(this.currentPage)
      .subscribe((response) => {
        this.content = this.content.concat(response.results);
        this.content.forEach((movie) => {
          movie.imageUrl = this.movieService.getImages(movie.poster_path);
        });
      });
  }

  getMoviesGenresList() {
    this.movieService.getMoviesGenresList().subscribe((response: any) => {
      this.genresMovies = response.genres;
      this.showGenresDropdown = true;
    });
  }

  getSeriesGenresList() {
    this.seriesService.getSeriesGenresList().subscribe((response: any) => {
      this.genresSeries = response.genres;
      this.showGenresDropdown = true;
    });
  }

  getGenre(): string {
    let genre!: any;
    if (this.selectedGenreMovies) {
      genre = this.genresMovies.find(
        (genre) => genre.name === this.selectedGenreMovies
      );
    } else {
    }
    return genre;
  }

  getMoviesBySelectedGenre() {
    this.content = [];
    if (this.selectedGenreMovies) {
      const selected = this.genresMovies.find(
        (genre) => genre.name === this.selectedGenreMovies
      );
      if (selected) {
        this.movieService
          .getMoviesByGenre(selected.id.toString(), this.currentPage)
          .subscribe((response: any) => {
            this.content = response.results;

            this.totalPages = response.total_pages;
            this.content.forEach((movie) => {
              movie.imageUrl = this.movieService.getImages(movie.poster_path);
            });
          });
      }
    } else {
      this.getMovies();
      this.getSeries();
    }
  }

  getSeriesBySelectedGenre() {
    this.content = [];
    if (this.selectedGenreSeries) {
      this.filterSeries = true;
      const selected = this.genresSeries.find(
        (genre) => genre.name === this.selectedGenreSeries
      );
      if (selected) {
        this.seriesService
          .getSeriesByGenre(selected.id.toString(), this.currentPage)
          .subscribe((response: any) => {
            this.content = response.results;

            this.totalPages = response.total_pages;
            this.content.forEach((serie) => {
              serie.imageUrl = this.seriesService.getImages(serie.poster_path);
            });
            if (this.isSortedAZ) {
              this.content.sort((a, b) => {
                const nameA = a.name ?? '';
                const nameB = b.name ?? '';
                return nameA.localeCompare(nameB);
              });
            }
          });
      }
    } else {
      this.getMovies();
      this.getSeries();
    }
  }

  toggleGenresDropdown() {
    this.showGenresDropdown = !this.showGenresDropdown;
  }

  getSeries(): void {
    this.content = [];
    if (this.source === 'catalog') {
      this.seriesService
        .getPopularSeries(this.currentPage)
        .subscribe((response) => {
          this.content = this.content.concat(response.results);
          this.totalPages = response.total_pages;
          this.content.forEach((movie) => {
            movie.imageUrl = this.seriesService.getImages(movie.poster_path);
          });
        });
    }
  }

  restoreCatalog(): void {
    this.content = [];
    this.getMovies();
    this.getSeries();
  }

  getImageUrl(posterPath: string): string {
    return this.movieService.getImages(posterPath);
  }

  onScroll() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getMovies();
      this.getSeries();
    }
  }

  openModal() {
    this.modalIsOpen = true;
  }

  closeModal() {
    this.modalIsOpen = false;
  }

  goToNextPage() {
    this.content = [];
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      if (this.isSortedAZ) {
        this.sortContentAtoZ();
      } else if (this.isSortedZA) {
        this.sortContentZtoA();
      } else if (this.selectedGenreSeries) {
        this.getSeriesBySelectedGenre();
      } else if (this.selectedGenreMovies) {
        this.getMoviesBySelectedGenre();
      } else {
        this.getMovies();
        this.getSeries();
      }
    }
  }

  goToPreviousPage() {
    this.content = [];
    if (this.currentPage > 1) {
      this.currentPage--;
      if (this.isSortedAZ) {
        this.sortContentAtoZ();
      } else if (this.isSortedZA) {
        this.sortContentZtoA();
      } else if (this.selectedGenreSeries) {
        this.getSeriesBySelectedGenre();
      } else if (this.selectedGenreMovies) {
        this.getMoviesBySelectedGenre();
      } else {
        this.getMovies();
        this.getSeries();
      }
    }
  }
}
