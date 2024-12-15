import {RouterModule, Routes} from '@angular/router';
import { EventFormComponent } from './components/event-form/event-form.component';
import {LoginComponent} from './components/login/login.component';
import {NgModule} from '@angular/core';
import {EventsListComponent} from './components/events-list/events-list.component';
import {LandingPageComponent} from './components/landing-page/landing-page.component';
import {InvitesListComponent} from './invites-list/invites-list.component';
import { SpecificEventComponent } from './components/specific-event/specific-event.component';

export const routes: Routes = [
    { path: 'event-form', component: EventFormComponent },
    { path: 'events-list', component: EventsListComponent},
    { path: 'login', component: LoginComponent},
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {path: 'invites-list', component: InvitesListComponent},
    { path: 'landing-page', component: LandingPageComponent },
    { path: 'event/:id', component: SpecificEventComponent },
    { path: 'event-form/:id', component: EventFormComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
