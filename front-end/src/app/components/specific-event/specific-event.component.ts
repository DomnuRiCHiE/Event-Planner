import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FirebaseService } from "../../services/firebase.service";

@Component({
    selector: "app-specific-event",
    standalone: true,
    imports: [CommonModule],
    templateUrl: "./specific-event.component.html",
    styleUrl: "./specific-event.component.css",
})
export class SpecificEventComponent {
    event: any; // Event object will be passed into this property.

    constructor(
        private route: ActivatedRoute,
        private firebaseService: FirebaseService,
        private router: Router
    ) {}

  async ngOnInit(): Promise<void> {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      try {
        const fetchedEvent = await this.firebaseService.getEventById(eventId);
        if (fetchedEvent) {
          // Convert Firestore Timestamps to JavaScript Dates
          this.event = {
            ...fetchedEvent,
            startDate: (fetchedEvent.startDate as any).toDate(),
            endDate: (fetchedEvent.endDate as any).toDate(),
            schedule: fetchedEvent.schedule?.map(item => ({
              ...item,
              time: (item.time as any).toDate(),
            })),
          };
          //sort the schedule by time and date
          this.event.schedule.sort((a:any, b:any) => {
            if (a.date < b.date) {
              return -1;
            } else if (a.date > b.date) {
              return 1;
            } else {
              return a.time < b.time ? -1 : 1;
            }
          }
          );
        } else {
          console.warn('Event not found.');
        }
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    }
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
