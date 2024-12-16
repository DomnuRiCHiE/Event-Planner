import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, Auth } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { Event } from '../models/event.model';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private auth: Auth;
  private db;
  private apiUrl = 'http://localhost:8080/api/send-email';

  constructor() {
    const firebaseConfig = {
      apiKey: "AIzaSyC5ftHFsiiB5VC71rre52EDHMVpvi_5aAY",
      authDomain: "mybigday-53567.firebaseapp.com",
      databaseURL: "https://mybigday-53567-default-rtdb.europe-west1.firebasedatabase.app",
      projectId: "mybigday-53567",
      storageBucket: "mybigday-53567.firebasestorage.app",
      messagingSenderId: "493056483296",
      appId: "1:493056483296:web:c57ddd659f13e91a821585"
    };

    // Initialize Firebase and Auth
    const app = initializeApp(firebaseConfig);
    this.auth = getAuth(app);
    this.db = getFirestore(app);
  }

  async sendEmail(to: string, subject: string, text: string): Promise<any> {
    try {
      const response = await axios.post(this.apiUrl, {
        to,
        subject,
        text,
      });
      return response.data;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async loginWithEmail(email: string, password: string): Promise<void> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      console.log('User logged in:', userCredential.user);
    } catch (error) {
      console.error('Error during login:', error);
      throw error; // Pass the error up to the caller
    }
  }

  async saveEvent(event: Event): Promise<void> {
    try {
      // Get the current user's ID from Firebase Auth
      const currentUser = this.auth.currentUser;

      if (currentUser) {
        event.organizerUserId = currentUser.uid;  // Set the current user's ID in the event

        // Reference to the Firestore collection where events are stored
        const eventsCollection = collection(this.db, 'Events');

        // Add the event document to Firestore
        await addDoc(eventsCollection, event);
        console.log('Event saved successfully!');
      } else {
        throw new Error('No user is logged in');
      }
    } catch (error) {
      console.error('Error saving event:', error);
      throw error; // Pass the error up to the caller
    }
  }
}
