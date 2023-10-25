import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PersonService } from '../services/person.service';
import { MovieService } from '../services/movie.service';
import { SeriesService } from '../services/series.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css'],
})
export class SearchResultsComponent implements OnInit {
  peopleResults!: any[];
  movieResults!: any[];
  seriesResults!: any[];
  usersResults: any[] = [];
  isPerson!: boolean;
  profileImg!: string;

  currentPage: number = 1;
  totalPages!: number;

  constructor(
    private route: ActivatedRoute,
    private personService: PersonService,
    private movieService: MovieService,
    private seriesService: SeriesService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const query = params.get('query'); 
      this.searchPeople(query!);
      this.searchMovies(query!);
      this.searchSeries(query!);
      this.searchUsers(query!);
    });
  }

  searchPeople(query: string) {
    this.personService
      .searchPeople(query, this.currentPage)
      .subscribe((response) => {
        this.peopleResults = response.results;
        this.totalPages = response.total_pages;
      });
  }

  searchMovies(query: string) {
    this.movieService
      .searchMovies(query!, this.currentPage)
      .subscribe((response) => {
        this.movieResults = response.results;
        this.totalPages = response.total_pages;
        console.log("moviessss:::",response.results);
      });
  }

  searchSeries(query: string) {
    this.seriesService
      .searchSeries(query!, this.currentPage)
      .subscribe((response) => {
        this.seriesResults = response.results;
        this.totalPages = response.total_pages;
        console.log("seriesss:::",response.results);
      });
  }

  searchUsers(query: string) {
    this.userService.getUsers().subscribe((response: any[]) => {
      const normalizedQuery = query.toLowerCase();
      this.usersResults = response.filter((user: any) => {
        const normalizedUsername = user.username.toLowerCase();
        return normalizedUsername.includes(normalizedQuery);
      });

      this.usersResults.forEach((user: any) => {
        this.userService
          .getProfileImage(user.id)
          .subscribe((response: Blob) => {
            if (response) {
              this.profileImg = URL.createObjectURL(response);
            } else {
              this.profileImg = 'assets/no-image-available.png';               
            }
          });
      });
    });
  }

  previousPage(type: string) {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.searchMovies(this.route.snapshot.paramMap.get('query')!);
      //this.searchSeries(this.route.snapshot.paramMap.get('query')!);
    }
  }

  nextPage(type: string) {
      if(type === 'movies') {
        if (this.currentPage < this.totalPages) {
          this.currentPage++;
          console.log("type:::",type, "current page:",this.currentPage, "-totalpages:",this.totalPages);
          this.searchMovies(this.route.snapshot.paramMap.get('query')!);
        }
      } else if(type === 'series') {
        if (this.currentPage < this.totalPages) {
          this.currentPage++;
        console.log("type:::",type, "current page:",this.currentPage, "-totalpages:",this.totalPages);
        this.searchSeries(this.route.snapshot.paramMap.get('query')!);
        }
      }      
    
  }
}
