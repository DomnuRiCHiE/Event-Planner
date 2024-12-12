import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {
  constructor(private router: Router) {}

  navigateToEvents(): void {
    this.router.navigate(['/events-list']);
  }

  navigateToInvites():void{
    this.router.navigate(['/invites-list']);
  }

  navigateToCreateEvent(): void {
    this.router.navigate(['/event-form']);
  }
}
