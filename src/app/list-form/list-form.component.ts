import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments';
import { MovieService } from '../services/movie.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-list-form',
  templateUrl: './list-form.component.html',
  styleUrls: ['./list-form.component.css']
})
export class ListFormComponent {
  listForm: FormGroup;
  searchResults: any[] = [];
  apiKey: any = environment.apiKey;
  selectedMovies: any[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient, private movieService: MovieService) {
    this.listForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      privacy: ['public', Validators.required]
    });
  }

  ngOnInit() {
  }

  onSubmit() {
    console.log(this.listForm.value);
  }

  searchMovies(query: Event) {
    if ((query.target as HTMLInputElement).value.length > 0) {
      this.http.get(`https://api.themoviedb.org/3/search/movie?query=${(query.target as HTMLInputElement).value}&api_key=${this.apiKey}`)
        .subscribe((response: any) => {
          console.log("searchmovies: ",response);
          this.searchResults = response.results;
        });
    } else {
      this.searchResults = [];
    }
  }

  onSelect(movie: any) {
    const index = this.selectedMovies.findIndex((m) => m.id === movie.id);
    if (index > -1) {
      this.selectedMovies.splice(index, 1);
    } else {
      this.selectedMovies.push(movie);
    }
  }

  isSelected(movie: any) {
    return this.selectedMovies.findIndex((m) => m.id === movie.id) > -1;
  }

  getMoviePosterUrl(posterPath: string): string {
    return this.movieService.getMoviePosterUrl(posterPath);
  }

}
