import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import {AppEvent} from '../models/event.model';
import {FirebaseService} from '../services/firebase.service';
import {Timestamp} from '@angular/fire/firestore';

@Component({
  selector: 'app-events-list',
  standalone: true,
  imports: [
    DatePipe,
    CommonModule
  ],
  templateUrl: './invites-list.component.html',
  styleUrls: ['./invites-list.component.css']
})
export class InvitesListComponent implements OnInit {
  events: AppEvent[] = [];

  constructor(private router: Router, private firebaseService: FirebaseService) {
  }

  async ngOnInit(): Promise<void> {
    try {
      const eventsData = await this.firebaseService.getLoggedInUsersAttendeeEvents();
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

  viewEventDetails(eventId: String | undefined): void {
    console.log('Viewing details for event with ID:', eventId);
  }

  async acceptEvent(event: AppEvent): Promise<void> {
    try {
      await this.firebaseService.modifyEventAttendance(event.eventId!, 'Accepted');
      console.log(`Accepted event with ID: ${event.eventId}`);
      window.location.reload(); // This will reload the page
    } catch (error) {
      console.error('Error accepting event:', error); }
  }

  async declineEvent(event: AppEvent): Promise<void> {
    try {
      await this.firebaseService.modifyEventAttendance(event.eventId!, 'Declined');
      console.log(`Declined event with ID: ${event.eventId}`);
      window.location.reload(); // This will reload the page
    } catch (error) {
      console.error('Error declining event:', error); }
  }
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  userResponse(event: AppEvent): string | undefined {
    const currentUserEmail = this.firebaseService.getCurrentUserEmail();
    if (event.attendees) {
      const attendee = event.attendees.find(a => a.email === currentUserEmail);
      return attendee?.confirmedStatus;
    }
    return ''; // If no attendee found
  }

}
