import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments';
import { MovieService } from '../services/movie.service';
import { ListService } from '../services/list.service';
import appConfig from 'src/app-config';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-form',
  templateUrl: './list-form.component.html',
  styleUrls: ['./list-form.component.css'],
})
export class ListFormComponent {
  listForm!: FormGroup;
  searchResults: any[] = [];
  apiKey: any = environment.apiKey;
  selectedContent: any[] = [];
  token!: string;
  userData!: any;
  userId!: number;
  moviesTVShows: any[string] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private movieService: MovieService,
    private authService: AuthService,
    private listService: ListService,
    private router: Router
  ) {
    this.listForm = this.fb.group({
      title: [null, Validators.required],
      description: [null],
      privacy: [null, Validators.required],
      userId: null,
      selectedContent: this.fb.array([]),
    });
  }

  ngOnInit() {
    this.token = this.authService.getToken();
    this.userData = this.authService.getUserDataFromToken();
    this.userId = this.userData.id;
  }

  setUserId() {
    if (this.token) {
      this.listForm.patchValue({ userId: this.userId });
    }
  }

  onSubmit() {
    this.setUserId();
    const listData = this.listForm.value;
    this.listService.createList(listData).subscribe(
      (response) => {
        this.listForm.reset();
        this.searchResults = [];
        this.selectedContent = [];
        this.router.navigate(['/lists']);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  searchContent(query: Event) {
    if ((query.target as HTMLInputElement).value.length > 0) {
      this.http
        .get(
          `${appConfig.tmdb.apiUrl}search/multi?query=${
            (query.target as HTMLInputElement).value
          }&api_key=${this.apiKey}`
        )
        .subscribe((response: any) => {
          this.searchResults = response.results;
        });
    } else {
      this.searchResults = [];
    }
  }

  onSelect(movie: any) {
    const index = this.selectedContent.findIndex((m) => m.id === movie.id);
    if (index > -1) {
      this.selectedContent.splice(index, 1);
    } else {
      this.selectedContent.push(movie);
    }

    this.listForm.setControl(
      'selectedContent',
      this.moviesControls(this.selectedContent)
    );
    this.listForm.patchValue({ selectedContent: this.selectedContent });
  }

  moviesControls(selectedContent: any[]) {
    const movieControls = selectedContent.map((content) => {
      if (content.media_type === 'movie') {
        return this.fb.group({
          id: [content.id],
          media_type: [content.media_type],
          title: [content.title],
        });
      } else if (content.media_type === 'tv') {
        return this.fb.group({
          id: [content.id],
          media_type: [content.media_type],
          title: [content.name],
        });
      } else {
        return null;
      }
    });
    return this.fb.array(movieControls.filter((control) => control !== null));
  }

  isSelected(movie: any) {
    return this.selectedContent.findIndex((m) => m.id === movie.id) > -1;
  }

  getMoviePosterUrl(posterPath: string): string {
    return this.movieService.getMoviePosterUrl(posterPath);
  }
}
