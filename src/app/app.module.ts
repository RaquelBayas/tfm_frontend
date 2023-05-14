import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS  } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './profile/profile.component';
import { UpcomingMoviesSeriesComponent } from './shared/upcoming-movies-series/upcoming-movies-series.component';
import { HomeUserComponent } from './home-user/home-user.component';
import { FormsModule } from '@angular/forms';
import { CardComponent } from './shared/card/card.component';
import { MoviesComponent } from './movies/movies.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { CatalogComponent } from './catalog/catalog.component';
import { ListsComponent } from './lists/lists.component';
import { ListFormComponent } from './list-form/list-form.component';
import { HomeComponent } from './home/home.component';
import { ProfileDetailsComponent } from './profile-details/profile-details.component';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import {MatSelectModule} from '@angular/material/select';
import {MatMenu, MatMenuModule} from '@angular/material/menu'; 
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PersonComponent } from './person/person.component';
import { PersonDetailsComponent } from './person-details/person-details.component';
import { OtherProfileComponent } from './other-profile/other-profile.component';
import { ModalComponent } from './shared/modal/modal.component';
import { StarRatingComponent } from './star-rating/star-rating.component';
import { ReviewComponent } from './review/review.component';
import { SettingsComponent } from './settings/settings.component';
import { SearchResultsComponent } from './search-results/search-results.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    UpcomingMoviesSeriesComponent,
    HomeUserComponent,
    CardComponent,
    MoviesComponent,
    CatalogComponent,
    ListsComponent,
    ListFormComponent,
    HomeComponent,
    ProfileDetailsComponent,
    PersonComponent,
    PersonDetailsComponent,
    OtherProfileComponent,
    ModalComponent,
    StarRatingComponent,
    ReviewComponent,
    SettingsComponent,
    SearchResultsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatInputModule,
    MatRadioModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    NgbModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    SlickCarouselModule,
    MatSelectModule,
    MatMenuModule,
    InfiniteScrollModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('token');
        }
      }
    }),
 
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [JwtHelperService],
  bootstrap: [AppComponent]
})
export class AppModule { }
