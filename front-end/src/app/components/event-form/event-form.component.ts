import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Event } from '../../models/event.model';
import { Schedule } from '../../models/schedule.model';
import { FirebaseService } from '../../services/firebase.service';
import {Router} from '@angular/router'; // Ensure FirebaseService is implemented

@Component({
  selector: 'event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    CalendarModule,
    ButtonModule,
    CardModule,
  ],
})
export class EventFormComponent {
  event: Event = {
    name: '',
    startDate: new Date(),
    endDate: new Date(),
    location: '',
    schedule: [],
    organizerUserId: '',
    attendees: []
  };

  schedules: Schedule[] = [];

  customSchedule: Schedule = {
    description: '',
    time: new Date(),
  };

  newAttendeeEmail: string = ''; // Variabila pentru e-mail-ul noului participant
  isSubmitting = false; // Used to show loading state

  constructor(private firebaseService: FirebaseService, private router: Router) {}

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  addCustomSchedule() {
    const newSchedule: Schedule = { ...this.customSchedule };
    this.schedules.push(newSchedule);
    this.customSchedule = { description: '', time: new Date() }; // Reset for new input
  }

  removeSchedule(index: number) {
    this.schedules.splice(index, 1);
  }

  addAttendee() {
    // Asigură-te că attendees nu este undefined
    if (!this.event.attendees) {
      this.event.attendees = [];
    }

    if (this.newAttendeeEmail.trim() && !this.event.attendees.includes(this.newAttendeeEmail)) {
      this.event.attendees.push(this.newAttendeeEmail.trim());
      this.newAttendeeEmail = ''; // Reset input
    } else {
      alert('Email is either invalid or already added.');
    }
  }

  removeAttendee(index: number) {
    // Asigură-te că attendees nu este undefined
    if (this.event.attendees) {
      this.event.attendees.splice(index, 1);
    } else {
      alert('No attendees to remove.');
    }
  }


  trackByIndex(index: number): number {
    return index;
  }

  async onSubmit() {
    if (!this.event.name || !this.event.location || !this.schedules.length || !this.event.attendees?.length) {
      alert('Please fill in all required fields and add at least one schedule.');
      return;
    }

    this.isSubmitting = true;
    try {
      console.log('Submitting event...');
      this.event.schedule = [...this.schedules];
      await this.firebaseService.saveEvent(this.event);
      console.log('Event saved:', this.event);

      // Send emails to attendees
      const subject = `You're Invited to ${this.event.name}`;
      const text = `Hello,\n\nYou have been invited to the event "${this.event.name}" at ${this.event.location}.\n\nBest Regards,\nThe Event Team`;

      const emailPromises = this.event.attendees.map((attendee) =>
        this.firebaseService.sendEmail(attendee.toString(), subject, text)
      );

      await Promise.all(emailPromises); // Wait for all emails to be sent
      alert('Event saved successfully, and invitations sent!');
      this.resetForm();
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Failed to save event or send invitations.');
    } finally {
      this.isSubmitting = false;
    }
  }

  resetForm() {
    this.event = {
      name: '',
      startDate: new Date(),
      endDate: new Date(),
      location: '',
      schedule: [],
      organizerUserId: '',
      attendees: []
    };
    this.schedules = [];
    this.newAttendeeEmail= '';
  }
}
