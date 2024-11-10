import { Routes } from '@angular/router';
import { EventFormComponent } from './components/event-form/event-form.component';
import {LoginComponent} from './components/login/login.component';

export const routes: Routes = [
    { path: 'event-form', component: EventFormComponent },
    { path: 'login', component: LoginComponent}
];
