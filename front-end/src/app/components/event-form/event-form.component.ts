import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AppEvent } from '../../models/event.model';
import { Schedule } from '../../models/schedule.model';
import { FirebaseService } from '../../services/firebase.service';
import {Router} from '@angular/router'; // Ensure FirebaseService is implemented
import * as XLSX from 'xlsx'; // Library to read Excel files




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
  event: AppEvent = {
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
      organizerUserId: '',
      attendees: []
    };
    this.schedules = [];
    this.newAttendeeEmail= '';
  }

  triggerExcelUpload() {
    const fileInput = document.getElementById('excelFileInput') as HTMLInputElement;
    fileInput.click(); // Simulates a click on the hidden file input
  }

  onExcelFileUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Assuming the first sheet contains the data
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convert sheet to JSON
        const jsonData: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // header: 1 tells XLSX to treat the first row as the header

        // Find the column index that contains 'email' (case-insensitive)
        const emailColumnIndex = jsonData[0].findIndex((header: string) => header.toLowerCase().includes('email'));

        if (emailColumnIndex === -1) {
          alert('No email column found in the Excel file.');
          return;
        }

        // Extract emails and filter out any invalid or undefined ones
        const emails = jsonData.slice(1)
          .map((row: any) => row[emailColumnIndex]) // Extract email address column
          .filter((email: string) => email); // Remove null/undefined values

        // Ensure attendees is always an array
        if (!this.event.attendees) {
          this.event.attendees = [];
        }

        // Add the emails to attendees
        this.event.attendees = [...this.event.attendees, ...emails];


        // Now mark the form as filled and allow submission
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
