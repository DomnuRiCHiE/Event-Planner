// event-form.component.ts

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Event } from '../../models/event.model';
import { Schedule } from '../../models/schedule.model';

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
  };

  schedules: Schedule[] = [];

  customSchedule: Schedule = {
    description: '',
    time: new Date(),
  };

  addCustomSchedule() {
    const newSchedule: Schedule = {
      ...this.customSchedule,
    };
    this.schedules.push(newSchedule);
    this.customSchedule = { description: '', time: new Date() };  // Resetting for new input
  }

  removeSchedule(index: number) {
    this.schedules.splice(index, 1);
  }

  trackByIndex(index: number): number {
    return index;
  }

  onSubmit() {
    console.log('Form submitted!');
    this.event.schedule = this.schedules.map(schedule => ({
      ...schedule,
    }));
    console.log('Event:', this.event);
  }
}