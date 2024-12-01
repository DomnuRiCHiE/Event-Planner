import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, Auth } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private auth: Auth;

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
}
