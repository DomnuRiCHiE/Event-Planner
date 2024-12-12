import { Component, OnInit } from '@angular/core';
import { AppEvent } from '../../models/event.model';  // Import Event model
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { Timestamp } from '@angular/fire/firestore';


@Component({
  selector: 'app-events-list',
  standalone: true,
  imports: [
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
      const eventsData = await this.firebaseService.getLoggedInUsersEvents();
      this.events = eventsData.map(event => ({
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
  }


  viewEventDetails(eventId: number | undefined): void {
    console.log('Viewing details for event with ID:', eventId);
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
