import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private baseUrl = 'https://api.themoviedb.org/3';

  constructor(private http: HttpClient) {}
  
  //Buscar una persona
  searchPeople(query: string): Observable<any> {
    const url = `${this.baseUrl}/search/person?api_key=${environment.apiKey}&query=${query}`;
    return this.http.get(url);
  }

  getSearchPeoples(url: any): Observable<any> {
    return this.http.get(url);
  }

  getPopularPeopleDetails(id: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/person/${id}`).pipe((map((response) => {
      return response;
    })));
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