import { Component } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private firebaseService: FirebaseService,
    private router: Router
  ) {}
  async login(): Promise<void> {
    try {
      await this.firebaseService.loginWithEmail(this.email, this.password);
      console.log('Login successful');
      this.router.navigate(['/events-list']);
      // Redirect the user or perform other actions after login
    } catch (error) {
      this.errorMessage = 'Login failed';
    }
  }
}
