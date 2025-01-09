import { Component, OnInit } from '@angular/core';
import { AppEvent } from '../../models/event.model';  // Import Event model
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { Timestamp } from '@angular/fire/firestore';
import { SpecificEventComponent } from '../specific-event/specific-event.component';


@Component({
  selector: 'app-events-list',
  standalone: true,
  imports: [
    CommonModule,
    SpecificEventComponent
  ],
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.css']
})
export class EventsListComponent implements OnInit {
  createdEvents: AppEvent[] = [];
  acceptedEvents: AppEvent[] = [];
  selectedEvent: AppEvent | null = null;

  constructor(private router: Router, private firebaseService: FirebaseService) { }

  async ngOnInit(): Promise<void> {
    try {
      const eventsData = await this.firebaseService.getLoggedInUsersEvents();
      this.createdEvents = eventsData.map(event => ({
        ...event,
        startDate: (event.startDate as unknown as Timestamp).toDate(),
        endDate: (event.endDate as unknown as Timestamp).toDate(),
        schedule: event.schedule ? event.schedule.map(item => ({
          ...item,
          time: (item.time as unknown as Timestamp).toDate()
        })) : []  // Add a default empty array if schedule is undefined
      }));
    } catch (error) {
      console.error('Error getting events:', error);
    }

    try {
      this.acceptedEvents = await this.firebaseService.getConfirmedAttendeeEvents();
    } catch (error) {
      console.error("Error loading confirmed events:", error);
    }


  }


  viewEventDetails(event: any): void {
    this.router.navigate(['/event', event.eventId]); // Navigate to the event's detail page
  }

  clearSelectedEvent(): void {
    this.selectedEvent = null;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  editEvent(event: any): void {
    this.router.navigate(['/event-form', event.eventId]);
  }

}
