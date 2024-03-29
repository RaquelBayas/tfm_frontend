import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeUserComponent } from './home-user/home-user.component';
import { MoviesComponent } from './movies/movies.component';
import { CatalogComponent } from './catalog/catalog.component';
import { ListsComponent } from './lists/lists.component';
import { ListFormComponent } from './list-form/list-form.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { PersonComponent } from './person/person.component';
import { PersonDetailsComponent } from './person-details/person-details.component';
import { SettingsComponent } from './settings/settings.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { SeriesComponent } from './series/series.component';
import { ContactoComponent } from './contacto/contacto.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { BoardComponent } from './admin/board/board.component';

const routes: Routes = [
  { path: '', component:HomeComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'navbar', component: NavbarComponent},
  { path: 'home-user', component: HomeUserComponent},
  { path: 'content/movies/:id', component:MoviesComponent},
  { path: 'content/series/:id', component: SeriesComponent},
  { path: 'catalog', component:CatalogComponent},
  { path: 'lists', component:ListsComponent},
  { path: 'listForm', component:ListFormComponent},
  { path: 'profile/:username', component:ProfileComponent},
  { path: 'person/:id', component: PersonDetailsComponent},
  { path: 'settings', component: SettingsComponent},
  { path: 'search-results/:query', component: SearchResultsComponent},
  { path: 'edit-user', component: EditUserComponent},
  { path: 'privacy-policy', component: PrivacyPolicyComponent},
  { path: 'contact', component: ContactoComponent},
  { path: 'not-found', component: NotFoundComponent },
  { path: 'admin-board', component: BoardComponent},
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: '/not-found' },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
