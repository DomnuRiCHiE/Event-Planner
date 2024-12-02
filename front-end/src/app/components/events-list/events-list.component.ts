import { Component, OnInit } from '@angular/core';
import { AppEvent } from '../../models/event.model';  // Import Event model
import { CommonModule, DatePipe } from '@angular/common';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';  // Import User model

@Component({
  selector: 'app-events-list',
  standalone: true,
  imports: [
    DatePipe,
    CommonModule
  ],
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.css']
})
export class EventsListComponent implements OnInit {
  events: AppEvent[] = [];

  constructor(private router: Router, private firebaseService: FirebaseService) { }

  async ngOnInit(): Promise<void> {
    try {
      this.events = await this.firebaseService.getLoggedInUsersEventsAndAttendeeEvents();
    } catch (error) {
      console.error('Error getting events:', error);
    }
  }

  viewEventDetails(eventId: number | undefined): void {
    console.log('Viewing details for event with ID:', eventId);
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
