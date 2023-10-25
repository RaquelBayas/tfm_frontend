import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MovieService } from '../services/movie.service';
import { SeriesService } from '../services/series.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home-user',
  templateUrl: './home-user.component.html',
  styleUrls: ['./home-user.component.css'],
})
export class HomeUserComponent implements OnInit {
  trendingContentSeries: any[] = [];
  trendingContentMovies: any[] = [];

  constructor(
    private movieService: MovieService,
    private seriesService: SeriesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getTrendingContentMovies();
    this.getTrendingContentSeries();
    let username = this.authService.getToken(); 
  }

  Handle(event: number) {
    alert(`Rating: ${event}`);
  }

  getTrendingContentSeries() {
    this.seriesService.getTrendingContentSeries().subscribe((response: any) => {
      this.trendingContentSeries = response.results;
    });
  }

  getTrendingContentMovies() {
    this.movieService.getTrendingContentMovies().subscribe((response: any) => {
      this.trendingContentMovies = response.results;
    });
  }
}
