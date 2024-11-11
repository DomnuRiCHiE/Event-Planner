import { Routes } from '@angular/router';
import { EventFormComponent } from './components/event-form/event-form.component';
import {EventsListComponent} from './components/events-list/events-list.component';

export const routes: Routes = [
    { path: 'event-form', component: EventFormComponent },
    { path: 'events-list', component: EventsListComponent}
];
