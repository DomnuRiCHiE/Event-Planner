import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
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

    // Initialize Firebase
    initializeApp(firebaseConfig);
    // Test Firebase Authentication by signing in anonymously
    const auth = getAuth();
    signInAnonymously(auth)
      .then(() => {
        console.log('Firebase Authentication Initialized and Test Sign-In Success');
      })
      .catch((error) => {
        console.error('Error signing in anonymously:', error);
      });
  }
}
