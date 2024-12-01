import {RouterModule, Routes} from '@angular/router';
import { EventFormComponent } from './components/event-form/event-form.component';
import {LoginComponent} from './components/login/login.component';
import {NgModule} from '@angular/core';
import {EventsListComponent} from './components/events-list/events-list.component';
import {LandingPageComponent} from './components/landing-page/landing-page.component';

export const routes: Routes = [
    { path: 'event-form', component: EventFormComponent },
    { path: 'events-list', component: EventsListComponent},
  { path: 'login', component: LoginComponent},
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'landing-page', component: LandingPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
