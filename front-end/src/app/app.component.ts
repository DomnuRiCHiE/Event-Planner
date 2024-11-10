import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {FirebaseService} from './services/firebase.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    console.log('AppComponent initialized');
  }
}
