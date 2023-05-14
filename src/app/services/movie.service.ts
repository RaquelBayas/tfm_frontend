import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, map } from 'rxjs';
import appConfig from 'src/app-config';
import { environment } from 'src/environments';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private baseUrl = 'https://api.themoviedb.org/3';
  private apiKey = '5e0095c06a8d84d9261ec398c35d130c';
  private imageUrl = 'https://image.tmdb.org/t/p/';
  token!: string;
  
  constructor(private http: HttpClient, private cookieService: CookieService) {
    this.token = this.cookieService.get('token');
    console.log("movieservice-token:",this.token);
   }

  /*
  searchMovies(query: string) {
    //const url = `${this.baseUrl}/search/movie?api_key=${this.apiKey}&query=${query}`;
    const url = `https://api.themoviedb.org/3/trending/all/week?api_key=5e0095c06a8d84d9261ec398c35d130c`;
    return this.http.get(url).pipe((
      map((response: any) => {
        return response;
      })
    ));
  }*/

  searchMovies(query: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.token // Agrega el token al header "Authorization"
    });

    const url = `${this.baseUrl}/search/movie?query=${query}&api_key=${environment.apiKey}`;

    return this.http.get(url, { headers });
  }

  searchSeries(query: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.token, // Agrega el token al header "Authorization"
    });
    const url = `${this.baseUrl}/search/tv?query=${query}&api_key=${environment.apiKey}`;
    return this.http.get(url, { headers });
  }

  getMoviesFromList(listId: number): Observable<any> {
    return this.http.get(`${appConfig.tmdb.apiUrl}list/${listId}?api_key=${this.apiKey}&language=es-ES`)
      .pipe(
        map((response: any) => {
          console.log("GET MOVIES FROM LIST:",response);
          return response.items;
        })
      );
  }
  

  // Obtener películas populares del catálogo
  getPopularMovies(): Observable<any> {
    return this.http.get(`${appConfig.tmdb.apiUrl}movie/popular?api_key=${this.apiKey}&language=es-ES`)
    .pipe((
      map((response:any) => {
        return response;
      })
    ));
  }

  getImages(query:string) {
    console.log("QUERY IMG: ",query);
    if (!query) {
      return 'assets/images/placeholder.png';
    }
    return `${appConfig.tmdb.imgUrl}${query}`;
  }

  getMovieDetails(id: string | null) {
    const url = `${appConfig.tmdb.apiUrl}/movie/${id}?api_key=${this.apiKey}`;
    return this.http.get(url);
  }

  getMovieCast(id: string):Observable<any> {
    return this.http.get(`${appConfig.tmdb.apiUrl}/movie/${id}/credits?api_key=${this.apiKey}`);
  }

  getMoviePosterUrl(posterPath: string): string {
    return `${appConfig.tmdb.imgUrl}${posterPath}`;
  }
}
