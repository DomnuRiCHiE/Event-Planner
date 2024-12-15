import { Component, ElementRef, NgZone, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AppEvent } from '../../models/event.model';
import { Schedule } from '../../models/schedule.model';
import { Attendee } from '../../models/attendee.model';
import { FirebaseService } from '../../services/firebase.service';

import {ActivatedRoute, Router} from '@angular/router'; // Ensure FirebaseService is implemented
import * as XLSX from 'xlsx'; // Library to read Excel files



declare const google: any; // Adaugă această linie după importuri


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
export class EventFormComponent implements AfterViewInit{
  event: AppEvent = {
    name: '',
    startDate: new Date(),
    endDate: new Date(),
    location: '',
    schedule: [],
    organizerUserEmail: '',
    attendees: [],
  };

  eventId: string | null = null;

  schedules: Schedule[] = [];

  customSchedule: Schedule = {
    description: '',
    time: new Date(),
  };

  newAttendeeEmail: string = '';
  isSubmitting = false;

  @ViewChild('locationInput', { static: false }) locationInput!: ElementRef; // Inputul pentru locație
  constructor(private firebaseService: FirebaseService, private router: Router, private ngZone: NgZone, private route: ActivatedRoute) {}

  ngOnInit() {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.eventId = eventId;
      this.loadEventDetails();
    }
  }

  ngAfterViewInit() {
    const autocomplete = new google.maps.places.Autocomplete(this.locationInput.nativeElement, {
      types: ['geocode'], // Sugerează locații
    });

    // Ascultă selecția locației
    autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        const place = autocomplete.getPlace();
        console.log('Obiectul place:', place); // Loghează obiectul complet

        if (place.geometry) {
          this.event.location = place.formatted_address || '';
          console.log('Selected location:', this.event.location);
        } else {
          alert('Please select a valid location!');
        }
      });
    });

  }

  private convertFirebaseTimestamp(timestamp: any): Date {
    if (timestamp && timestamp.seconds) {
      return new Date(timestamp.seconds * 1000); // Convert seconds to milliseconds
    }
    return new Date(); // Default to the current date
  }


  async loadEventDetails() {
    try {
      const fetchedEvent = await this.firebaseService.getEventById(this.eventId!);

      if (fetchedEvent) {
        // Convert startDate and endDate from Firebase Timestamp to JavaScript Date
        this.event = {
          ...fetchedEvent,
          startDate: this.convertFirebaseTimestamp(fetchedEvent.startDate),
          endDate: this.convertFirebaseTimestamp(fetchedEvent.endDate),
        };

        // Convert the schedule times to JavaScript Date objects
        this.schedules = (fetchedEvent.schedule || []).map(schedule => ({
          description: schedule.description || '',
          time: this.convertFirebaseTimestamp(schedule.time),
        }));
      } else {
        alert('Event not found!');
      }
    } catch (error) {
      console.error('Error loading event details:', error);
      alert('Failed to load event details.');
    }
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  addCustomSchedule() {
    const newSchedule: Schedule = { ...this.customSchedule };
    this.schedules.push(newSchedule);
    this.customSchedule = { description: '', time: new Date() };
  }

  removeSchedule(index: number) {
    this.schedules.splice(index, 1);
  }

  addAttendee() {
    if (!this.event.attendees) {
      this.event.attendees = [];
    }
    const newAttendee: Attendee = {
      email: this.newAttendeeEmail.trim(),
      confirmedStatus: 'Unconfirmed',
    };

    if (
      this.newAttendeeEmail.trim() &&
      !this.event.attendees.some((attendee) => attendee.email === newAttendee.email)
    ) {
      this.event.attendees.push(newAttendee);
      this.newAttendeeEmail = '';
    } else {
      alert('Email is either invalid or already added.');
    }
  }

  removeAttendee(index: number) {
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
    this.event.schedule = [...this.schedules];

    try {
      if (this.eventId) {
        // Update existing event
        await this.firebaseService.updateEvent(this.eventId, this.event);
        alert('Event updated successfully!');
      } else {
        // Save new event
        await this.firebaseService.saveEvent(this.event);
        alert('Event created successfully!');
      }

      this.router.navigate(['/events-list']);
    } catch (error) {
      console.error('Error saving/updating event:', error);
      alert('Failed to save or update event.');
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
      organizerUserEmail: '',
      attendees: [],
    };
    this.schedules = [];
    this.newAttendeeEmail = '';
  }

  triggerExcelUpload() {
    const fileInput = document.getElementById('excelFileInput') as HTMLInputElement;
    fileInput.click();
  }

  onExcelFileUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const jsonData: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const emailColumnIndex = jsonData[0].findIndex((header: string) =>
          header.toLowerCase().includes('email')
        );

        if (emailColumnIndex === -1) {
          alert('No email column found in the Excel file.');
          return;
        }

        const emails = jsonData
          .slice(1)
          .map((row: any) => row[emailColumnIndex])
          .filter((email: string) => email);

        if (!this.event.attendees) {
          this.event.attendees = [];
        }

        const newAttendees: Attendee[] = emails.map(email => ({
          email: email.trim(),
          confirmedStatus: 'Unconfirmed',
        }));

        const uniqueAttendees = newAttendees.filter(newAttendee =>
          !this.event.attendees!.some(attendee => attendee.email === newAttendee.email)
        );

        this.event.attendees = [...this.event.attendees, ...uniqueAttendees];

        alert('Emails imported successfully!');
      };

      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        alert('Failed to read the file. Please try again.');
      };

      reader.readAsArrayBuffer(file);
    }
  }

}
