import { Injectable } from "@angular/core";
import { initializeApp } from "firebase/app";
import {
    getAuth,
    signInWithEmailAndPassword,
    Auth,
    onAuthStateChanged,
} from "firebase/auth";
import {
    getFirestore,
    collection,
    addDoc,
    where,
    query,
    getDocs,
} from "firebase/firestore";
import { AppEvent } from "../models/event.model";
import {doc, getDoc, updateDoc} from '@angular/fire/firestore';

@Injectable({
    providedIn: "root",
})
export class FirebaseService {
    private auth: Auth;
    private db;
    private currentUser: any;
    private authStatePromise: Promise<void>;

    constructor() {
        const firebaseConfig = {
            apiKey: "AIzaSyC5ftHFsiiB5VC71rre52EDHMVpvi_5aAY",
            authDomain: "mybigday-53567.firebaseapp.com",
            databaseURL:
                "https://mybigday-53567-default-rtdb.europe-west1.firebasedatabase.app",
            projectId: "mybigday-53567",
            storageBucket: "mybigday-53567.firebasestorage.app",
            messagingSenderId: "493056483296",
            appId: "1:493056483296:web:c57ddd659f13e91a821585",
        };

        // Initialize Firebase and Auth
        const app = initializeApp(firebaseConfig);
        this.auth = getAuth(app);
        this.db = getFirestore(app);

        // Create a promise that resolves when the authentication state is determined
        this.authStatePromise = new Promise((resolve) => {
            onAuthStateChanged(this.auth, (user) => {
                if (user) {
                    this.currentUser = user;
                    console.log("User is logged in:", user);
                } else {
                    this.currentUser = null;
                    console.log("No user is logged in");
                }
                resolve();
            });
        });
    }

    async loginWithEmail(email: string, password: string): Promise<void> {
        try {
            const userCredential = await signInWithEmailAndPassword(
                this.auth,
                email,
                password
            );
            console.log("User logged in:", userCredential.user);
            this.currentUser = userCredential.user;
        } catch (error) {
            console.error("Error during login:", error);
            throw error; // Pass the error up to the caller
        }
    }

    async saveEvent(event: AppEvent): Promise<void> {
        try {
            // Wait for the authentication state to be determined
            await this.authStatePromise;

            // Get the current user's ID from Firebase Auth
            const currentUser = this.currentUser;

            if (currentUser) {
                event.organizerUserEmail = currentUser.email; // Set the current user's email in the event

                // Reference to the Firestore collection where events are stored
                const eventsCollection = collection(this.db, "Events");

                // Add the event document to Firestore
                await addDoc(eventsCollection, event);
                console.log("Event saved successfully!");
            } else {
                throw new Error("No user is logged in");
            }
        } catch (error) {
            console.error("Error saving event:", error);
            throw error; // Pass the error up to the caller
        }
    }

    async getLoggedInUsersEvents(): Promise<AppEvent[]> {
        try {
            // Wait for the authentication state to be determined
            await this.authStatePromise;

            const currentUser = this.currentUser;
            console.log("Current user:", currentUser);

            if (currentUser) {
                const eventsCollection = collection(this.db, "Events");
                const querySnapshot = await getDocs(
                    query(
                        eventsCollection,
                        where("organizerUserEmail", "==", currentUser.email)
                    )
                );
                const events: AppEvent[] = [];

                querySnapshot.forEach((doc: any) => {
                  const eventData = doc.data() as AppEvent;
                  // Get the id
                  eventData.eventId = doc.id;
                  events.push(doc.data() as AppEvent);
                });

                return events;
            } else {
                throw new Error("No user is logged in");
            }
        } catch (error) {
            console.error("Error getting events:", error);
            throw error; // Pass the error up to the caller
        }
    }



  async getLoggedInUsersAttendeeEvents(): Promise<AppEvent[]> {
    try {
      // Wait for the authentication state to be determined
      await this.authStatePromise;

      const currentUser = this.currentUser;
      console.log("Current user:", currentUser);

      if (currentUser) {
        const eventsCollection = collection(this.db, "Events");

        // Get all events
        const querySnapshot = await getDocs(eventsCollection);

        const attendeeEvents: AppEvent[] = [];
        querySnapshot.forEach((doc: any) => {
          const event = doc.data() as AppEvent;
          // Get the id
          event.eventId = doc.id;
          if (event.attendees && event.attendees.some(attendee => attendee.email === currentUser.email)) {
            console.log("Attendee event:", event);
            attendeeEvents.push(event);
          }
        });

        return attendeeEvents;

      } else {
        throw new Error("No user is logged in");
      }
    } catch (error) {
      console.error("Error getting attendee events:", error);
      throw error;
    }
  }

  async modifyEventAttendance(eventId: string, status: string): Promise<void> {
    try {
      await this.authStatePromise;

      const currentUser = this.currentUser;
      if (!currentUser) {
        throw new Error("No user is logged in");
      }

      const eventDoc = doc(this.db, "Events", eventId);
      const eventSnapshot = await getDoc(eventDoc);

      if (eventSnapshot.exists()) {
        const eventData = eventSnapshot.data() as AppEvent;

        if (eventData.attendees) {
          eventData.attendees = eventData.attendees.map(attendee => {
            if (attendee.email === currentUser.email) {
              return { ...attendee, confirmedStatus: status };  // Change to 'accepted'
            }
            return attendee;
          });

          const updateData: Partial<AppEvent> = { attendees: eventData.attendees };
          await updateDoc(eventDoc, updateData);
          console.log("Event attendance confirmed!");
        } else {
          console.error("No attendees found for this event.");
        }
      } else {
        console.error("Event not found");
      }
    } catch (error) {
      console.error("Error confirming event attendance:", error);
      throw error;
    }
  }

}
