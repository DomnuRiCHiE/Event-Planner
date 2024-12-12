import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import {AppEvent} from '../models/event.model';
import {FirebaseService} from '../services/firebase.service';

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

  constructor(private router: Router, private firebaseService: FirebaseService) { }

  async ngOnInit(): Promise<void> {
    try {
      this.events = await this.firebaseService.getLoggedInUsersAttendeeEvents();
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
