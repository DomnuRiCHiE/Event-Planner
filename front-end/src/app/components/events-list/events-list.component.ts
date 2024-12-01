import { Component, OnInit } from '@angular/core';
import { Event } from '../../models/event.model';  // Import Event model
import { CommonModule, DatePipe } from '@angular/common';
import { User } from '../../models/user.model';
import {Router} from '@angular/router';  // Import User model

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
  events: Event[] = [];

  constructor(private router: Router) {}

  event1: Event = {
    eventId: 1,
    name: 'John and Jane\'s Wedding',
    startDate: new Date('2024-12-10T16:00:00'),
    endDate: new Date('2024-12-10T22:00:00'),
    location: 'Central Park, New York',
    attendees: [
      '1' , '2'
    ] as String[],  // List of attendees
    organizerUserId: '5', // Set the organizer's user ID as a string
    schedule: [
      { time: new Date('2024-12-10T16:00:00'), description: 'Ceremony' },
      { time: new Date('2024-12-10T18:00:00'), description: 'Dinner' },
      { time: new Date('2024-12-10T20:00:00'), description: 'Dancing' }
    ]
  };

  event2: Event = {
    eventId: 2,
    name: 'Company Annual Party',
    startDate: new Date('2024-12-15T18:00:00'),
    endDate: new Date('2024-12-15T23:00:00'),
    location: 'Downtown Hotel, Los Angeles',
    attendees: [
      '1' , '2'
    ] as String[],  // List of attendees
    organizerUserId: '1', // Set the organizer's user ID as a string
    schedule: [
      { time: new Date('2024-12-15T18:00:00'), description: 'Cocktail Hour' },
      { time: new Date('2024-12-15T19:30:00'), description: 'Awards Ceremony' },
      { time: new Date('2024-12-15T21:00:00'), description: 'Music and Dancing' }
    ]
  };

  ngOnInit(): void {
    this.events.push(this.event1);
    this.events.push(this.event2);
  }

  viewEventDetails(eventId: number | undefined): void {
    console.log('Viewing details for event with ID:', eventId);
  }
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
