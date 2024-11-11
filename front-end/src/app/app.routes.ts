import {RouterModule, Routes} from '@angular/router';
import { EventFormComponent } from './components/event-form/event-form.component';
import {LoginComponent} from './components/login/login.component';
import {NgModule} from '@angular/core';

export const routes: Routes = [
    { path: 'event-form', component: EventFormComponent },
    { path: 'login', component: LoginComponent },
    { path: '', redirectTo: 'login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
