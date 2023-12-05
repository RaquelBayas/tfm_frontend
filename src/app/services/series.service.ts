import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import appConfig from 'src/app-config';
import { environment } from 'src/environments';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SeriesService {
  token!: string;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.token = this.authService.getToken();
  }

  searchSeries(query: string, page: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.token,
    });
    const url = `${appConfig.tmdb.apiUrl}search/tv?query=${query}&api_key=${environment.apiKey}&language=es${page}`;
    return this.http.get(url, { headers });
  }

  getSeriesGenresList(): Observable<any> {
    const url = `${appConfig.tmdb.apiUrl}genre/tv/list?api_key=${environment.apiKey}`;
    return this.http.get(url);
  }

  getSeriesByGenre(genre: string, page: number): Observable<any> {
    const url = `${appConfig.tmdb.apiUrl}discover/tv?api_key=${environment.apiKey}&with_genres=${genre}&page=${page}`;
    return this.http.get(url);
  }

  getSeriesByGenreTitleAsc(genre: string, page: number): Observable<any> {
    const url = `${appConfig.tmdb.apiUrl}discover/tv?sort_by=original_title&api_key=${environment.apiKey}&with_genres=${genre}&page=${page}`;
    return this.http.get(url);
  }

  getSeriesDetails(id: string | null) {
    const url = `${appConfig.tmdb.apiUrl}tv/${id}?language=es-ES&api_key=${environment.apiKey}`;
    return this.http.get(url);
  }

  getSerieSocialNetworks(id: string): Observable<any> {
    return this.http.get(
      `${appConfig.tmdb.apiUrl}tv/${id}/external_ids?api_key=${environment.apiKey}`
    );
  }

  getSeriesCast(id: string): Observable<any> {
    return this.http.get(
      `${appConfig.tmdb.apiUrl}/tv/${id}/aggregate_credits?api_key=${environment.apiKey}&language=es-ES`
    );
  }

  getSeriesPosterUrl(posterPath: string): string {
    return `${appConfig.tmdb.imgUrl}${posterPath}`;
  }

  getImages(query: string) {
    if (!query) {
      return 'assets/images/placeholder.png';
    }
    return `${appConfig.tmdb.imgUrl}${query}`;
  }

  getPopularSeries(page: number, limit: number | null = null): Observable<any> {
    return this.http
      .get(
        `${appConfig.tmdb.apiUrl}tv/popular?api_key=${environment.apiKey}&language=es-ES&page=${page}`
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

  getSeriesByTitleAsc(page?: number): Observable<any> {
    const url = `${appConfig.tmdb.apiUrl}discover/tv?sort_by=original_name.asc&api_key=${environment.apiKey}&language=es-ES&page=${page}`;
    console.log(url);
    return this.http.get(url);
  }

  getSeriesByTitleDesc(page?: number): Observable<any> {
    const url = `${appConfig.tmdb.apiUrl}discover/tv?sort_by=original_name.desc&api_key=${environment.apiKey}&language=es-ES&page=${page}`;
    return this.http.get(url);
  }

  getLatestSerie(limit: number): Observable<any> {
    return this.http
      .get(
        `${appConfig.tmdb.apiUrl}trending/all/week?api_key=${environment.apiKey}&language=es-ES&page=1`
      )
      .pipe(
        map((response: any) => {
          if (limit !== null) {
            console.log('latest series:', response);
            //response.results = response.results.slice(0, limit);
          }
          return response;
        })
      );
  }

  //Devuelve películas y series de la categoría Trending de toda la semana
  getTrendingContentSeries(): Observable<any> {
    return this.http
      .get(
        `${appConfig.tmdb.apiUrl}trending/tv/week?api_key=${environment.apiKey}&language=es-ES&page=1`
      )
      .pipe(
        map((response: any) => {
          console.log('trending:', response);
          return response;
        })
      );
  }

  addCommentSeries(comment: any) {
    return this.http.post(
      `${appConfig.backend.backendUrl}series/${comment.contentId}/comments`,
      comment
    );
  }

  getCommentsSeries(serieId: any) {
    return this.http.get(
      `${appConfig.backend.backendUrl}series/${serieId}/comments`
    );
  }
}
