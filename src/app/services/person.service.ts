import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import appConfig from 'src/app-config';
import { environment } from 'src/environments';

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  private baseUrl = `${appConfig.tmdb.apiUrl}`;

  constructor(private http: HttpClient) {}

  //Buscar una persona
  searchPeople(query: string, page: number): Observable<any> {
    const url = `${this.baseUrl}search/person?api_key=${environment.apiKey}&query=${query}&language=es${page}`;
    return this.http.get(url);
  }

  getSearchPeoples(url: any): Observable<any> {
    return this.http.get(url);
  }

  getPopularPeopleDetails(id: any): Observable<any> {
    return this.http.get(`${this.baseUrl}person/${id}`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getPersonDetails(url: any): Observable<any> {
    return this.http.get(url);
  }

  getSocialLinks(url: any): Observable<any> {
    return this.http.get(url);
  }

  getCredits(url: any): Observable<any> {
    return this.http.get(url);
  }

  getPersonSocialNetworks(url: any): Observable<any> {
    return this.http.get(url);
  }

  getPersonCredits(url: any): Observable<any> {
    return this.http.get(url);
  }
}
