import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import appConfig from 'src/app-config';
import { environment } from 'src/environments';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  token!: string;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.token = this.authService.getToken();
  }

  searchMovies(query: string, page: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.token,
    });

    const url = `${appConfig.tmdb.apiUrl}search/movie?query=${query}&api_key=${environment.apiKey}&language=es&page=${page}`;
    return this.http.get(url, { headers });
  }

  getMoviesGenresList(): Observable<any> {
    const url = `${appConfig.tmdb.apiUrl}genre/movie/list?api_key=${environment.apiKey}`;
    return this.http.get(url);
  }

  getMoviesByGenre(genre: string, page: number): Observable<any> {
    const url = `${appConfig.tmdb.apiUrl}discover/movie?api_key=${environment.apiKey}&with_genres=${genre}&page=${page}`;
    return this.http.get(url);
  }

  getMoviesByGenreTitleAsc(genre: string, page: number): Observable<any> {
    const url = `${appConfig.tmdb.apiUrl}discover/movie?sort_by=original_title&api_key=${environment.apiKey}&with_genres=${genre}&page=${page}`;
    return this.http.get(url);
  }

  getMoviesFromList(listId: number): Observable<any> {
    return this.http
      .get(
        `${appConfig.tmdb.apiUrl}list/${listId}?api_key=${environment.apiKey}&language=es-ES`
      )
      .pipe(
        map((response: any) => {
          return response.items;
        })
      );
  }

  // Obtener películas populares del catálogo
  getPopularMovies(page: number, limit: number | null = null): Observable<any> {
    return this.http
      .get(
        `${appConfig.tmdb.apiUrl}movie/popular?api_key=${environment.apiKey}&language=es-ES&page=${page}`
      )
      .pipe(
        map((response: any) => {
          if (limit !== null) {
            response.results = response.results.slice(0, limit);
          }
          return response;
        })
      );
  }

  //ORDER ASC TITLE
  getMoviesByTitleAsc(page?: number): Observable<any> {
    const url = `${appConfig.tmdb.apiUrl}discover/movie?sort_by=original_title.asc&api_key=${environment.apiKey}&language=es-ES&page=${page}`;
    return this.http.get(url);
  }

  getMoviesByTitleDesc(page?: number): Observable<any> {
    const url = `${appConfig.tmdb.apiUrl}discover/movie?sort_by=original_title.desc&api_key=${environment.apiKey}&language=es-ES&page=${page}`;
    return this.http.get(url);
  }

  getLatestMovie(): Observable<any> {
    return this.http
      .get(
        `${appConfig.tmdb.apiUrl}movie/latest?api_key=${environment.apiKey}&language=es-ES`
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  getImages(query: string) {
    if (!query) {
      return 'assets/no-image.png';
    }
    return `${appConfig.tmdb.imgUrl}${query}`;
  }

  getMultiDetails(content: string) {
    const url = `${appConfig.tmdb.apiUrl}search/multi?query=${content}&api_key=${environment.apiKey}`;
    return this.http.get(url);
  }

  getMovieDetails(id: string | null) {
    const url = `${appConfig.tmdb.apiUrl}movie/${id}?language=es-ES&api_key=${environment.apiKey}`;
    return this.http.get(url);
  }

  getMovieSocialNetworks(id: string): Observable<any> {
    return this.http.get(
      `${appConfig.tmdb.apiUrl}movie/${id}/external_ids?api_key=${environment.apiKey}`
    );
  }

  getMovieCast(id: string): Observable<any> {
    return this.http.get(
      `${appConfig.tmdb.apiUrl}/movie/${id}/credits?api_key=${environment.apiKey}&language=es-ES`
    );
  }

  getMoviePosterUrl(posterPath: string): string {
    return `${appConfig.tmdb.imgUrl}${posterPath}`;
  }

  addCommentMovie(comment: any) {
    return this.http.post(
      `${appConfig.backend.backendUrl}movies/${comment.contentId}/comments`,
      comment
    );
  }

  getCommentsMovie(movieId: any) {
    return this.http.get(
      `${appConfig.backend.backendUrl}movies/${movieId}/comments`
    );
  }

  getTrendingContentMovies(): Observable<any> {
    return this.http
      .get(
        `${appConfig.tmdb.apiUrl}trending/movie/week?api_key=${environment.apiKey}&language=es-ES&page=1`
      )
      .pipe(
        map((response: any) => {
          console.log('trending:', response);
          return response;
        })
      );
  }
}
