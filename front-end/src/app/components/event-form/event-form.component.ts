import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Event } from '../../models/event.model';
import { Schedule } from '../../models/schedule.model';
import { FirebaseService } from '../../services/firebase.service'; // Ensure FirebaseService is implemented




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
    organizerUserId: ''
  };



  schedules: Schedule[] = [];

  customSchedule: Schedule = {
    description: '',
    time: new Date(),
  };

  isSubmitting = false; // Used to show loading state

  constructor(private firebaseService: FirebaseService) {}

  addCustomSchedule() {
    const newSchedule: Schedule = { ...this.customSchedule };
    this.schedules.push(newSchedule);
    this.customSchedule = { description: '', time: new Date() }; // Reset for new input
  }

  removeSchedule(index: number) {
    this.schedules.splice(index, 1);
  }

  trackByIndex(index: number): number {
    return index;
  }

  async onSubmit() {
    if (!this.event.name || !this.event.location || !this.schedules.length) {
      alert('Please fill in all required fields and add at least one schedule.');
      return;
    }

    this.isSubmitting = true;
    try {
      console.log('Submitting event...');
      this.event.schedule = [...this.schedules];
      await this.firebaseService.saveEvent(this.event);
      console.log('Event saved:', this.event);
      alert('Event saved successfully!');
      this.resetForm();
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Failed to save event.');
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
      organizerUserId: ''
    };
    this.schedules = [];
  }
}
