import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments';
import { MovieService } from '../services/movie.service';
import { map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import jwtDecode from 'jwt-decode';
import { ListService } from '../services/list.service';

@Component({
  selector: 'app-list-form',
  templateUrl: './list-form.component.html',
  styleUrls: ['./list-form.component.css']
})
export class ListFormComponent {
  listForm!: FormGroup;
  searchResults: any[] = [];
  apiKey: any = environment.apiKey;
  selectedMovies: any[] = [];
  token!: string;
  userId!: number;
  moviesTVShows: any[string] = [];

  constructor(private fb: FormBuilder, private http: HttpClient, private movieService: MovieService, private cookieService: CookieService
    , private listService: ListService) {
     
      this.listForm = this.fb.group({
        title: [null, Validators.required],
        description: [null],
        privacy: [null, Validators.required],
        userId: null,
        selectedMovies: this.fb.array([])
      });
      
  }

  ngOnInit() {
  }

  setUserId() {
    this.token = this.cookieService.get('token');
    if (this.token) {
      const decodedToken: any = jwtDecode(this.token);
      this.userId = decodedToken.id;
      console.log('decoded token:', decodedToken.id);
      this.listForm.patchValue({userId: this.userId});
    }
  }

  onSubmit() {
    this.setUserId();
    console.log(this.listForm.value);
      const listData = this.listForm.value;
      this.listService.createList(listData)
        .subscribe(
          response => {
            console.log("list form on submit:",response);
            this.listForm.reset();
            this.searchResults = [];
            this.selectedMovies = [];
            // La lista se ha creado correctamente
            // Realiza las acciones necesarias, como redirigir a la página de la lista creada
          },
          error => {
            console.log(error);
            // Ha ocurrido un error al crear la lista
            // Muestra un mensaje de error al usuario
          }
        );
        
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

    this.listForm.setControl('selectedMovies', this.moviesControls(this.selectedMovies));
    this.listForm.patchValue({ selectedMovies: this.selectedMovies });
    
  }

  moviesControls(selectedMovies: any[]) {
    const movieControls = selectedMovies.map((movie) => {
    return this.fb.group({
      id: [movie.id],
      title: [movie.title]
    });
  });

  return this.fb.array(movieControls);
  }


  isSelected(movie: any) {
    return this.selectedMovies.findIndex((m) => m.id === movie.id) > -1;
  }

  getMoviePosterUrl(posterPath: string): string {
    return this.movieService.getMoviePosterUrl(posterPath);
  }

}
