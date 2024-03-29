import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import appConfig from 'src/app-config';
import { PersonService } from '../services/person.service';

@Component({
  selector: 'app-person-details',
  templateUrl: './person-details.component.html',
  styleUrls: ['./person-details.component.css'],
})
export class PersonDetailsComponent {
  apiPersonUrl: string = appConfig.tmdb.personBaseUrl;
  imgUrl: string = appConfig.tmdb.imgUrl;

  person_id: any;
  person: any;
  socialNetworks: any;

  credits: any = [];
  listTvCast: any = [];
  listMoviesCast: any = [];
  listTvCrew: any = [];
  listMoviesCrew: any = [];

  constructor(
    private route: ActivatedRoute,
    private personService: PersonService
  ) {
    let id = this.route.snapshot.params['id'];
    this.person_id = id;

    this.getPersonDetails();
  }

  getPersonDetails() {
    let personUrl =
      this.apiPersonUrl +
      this.person_id +
      '?api_key=' +
      appConfig.tmdb.apikey +
      '&language=es-ES';
    this.getPersonDetailsData(personUrl);

    let socialNetworksUrl =
      this.apiPersonUrl +
      this.person_id +
      '/external_ids?api_key=' +
      appConfig.tmdb.apikey +
      '&language=es-ES';
    this.getPersonSocialNetworks(socialNetworksUrl);

    let moviesTvShowsUrl =
      this.apiPersonUrl +
      this.person_id +
      '/combined_credits?api_key=' +
      appConfig.tmdb.apikey +
      '&language=es-ES&sort_by=release_date.desc';
    this.getPersonCredits(moviesTvShowsUrl);
  }

  getPersonDetailsData(apiUrl: string) {
    this.personService.getPersonDetails(apiUrl).subscribe((response) => {
      this.person = response;
    });
  }

  getPersonSocialNetworks(socialNetworksUrl: string) {
    this.personService
      .getPersonSocialNetworks(socialNetworksUrl)
      .subscribe((response) => {
        this.socialNetworks = response;
      });
  }

  getBiography(biography: string) {
    if (!biography) {
      return ["No tenemos datos acerca de su biografía"];
    }
    return biography.split('\n\n');
  }

  getPersonCredits(socialNetworksUrl: string) {
    let tvCastCounter = 0,
      movieCastCounter = 0;
    let creditsTemp: any;

    this.personService
      .getPersonCredits(socialNetworksUrl)
      .subscribe((response) => {
        creditsTemp = response;
        this.credits = creditsTemp;
        this.credits.cast.forEach((credit: any) => {
          if (credit.media_type === 'movie') {
            this.listMoviesCast.push(credit);
            movieCastCounter++;
          } else {
            this.listTvCast.push(credit);
            tvCastCounter++;
          }
        });
        response.cast.sort((a: any, b: any) => {
          // Ordenar por fecha de lanzamiento de forma descendente
          const dateA = new Date(a.release_date || a.first_air_date);
          const dateB = new Date(b.release_date || b.first_air_date);
          return dateB.getTime() - dateA.getTime();
        });
      });
  }
}
