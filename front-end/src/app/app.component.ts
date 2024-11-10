import { Component } from '@angular/core';
import { EventFormComponent } from './components/event-form/event-form.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    EventFormComponent,
    RouterOutlet
    // BrowserAnimationsModule is removed here and added to appConfig instead
  ],
})
export class AppComponent {
  title = 'front-end';
}
