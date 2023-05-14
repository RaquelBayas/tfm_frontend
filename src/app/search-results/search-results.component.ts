import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PersonService } from '../services/person.service';
import { MovieService } from '../services/movie.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css'],
})
export class SearchResultsComponent implements OnInit {
  peopleResults!: any[];
  movieResults!: any[];
  seriesResults!: any[];
  isPerson!: boolean;

  constructor(
    private route: ActivatedRoute,
    private personService: PersonService,
    private movieService: MovieService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const query = params.get('query');
      //const searchType = query!.startsWith('movie:') ? 'movies' : query!.startsWith('series:') ? 'series' : 'people';
      this.searchPeople(query!);
      this.searchMovies(query!);
      this.searchSeries(query!);
      this.searchPeople(query!);
    });
  }

  searchPeople(query: string) {
    this.personService.searchPeople(query).subscribe((response) => {
      this.peopleResults = response.results;
      console.log('searchPeople',this.peopleResults);
    });
  }

  searchMovies(query: string) {
    this.movieService.searchMovies(query!).subscribe((response) => {
      this.movieResults = response.results;
      console.log('searchMovies',this.movieResults);
    });
  }

  searchSeries(query: string) {
    this.movieService.searchSeries(query!).subscribe((response) => {
      this.seriesResults = response.results;
      console.log('searchSeries',this.seriesResults);
    });
  }
}
