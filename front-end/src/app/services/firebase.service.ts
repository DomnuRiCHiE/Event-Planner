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
    doc,
    getDoc,
    updateDoc,
  DocumentReference
} from "firebase/firestore";
import { AppEvent } from "../models/event.model";
import {DocumentData} from '@angular/fire/compat/firestore';

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
            this.currentUser = userCredential.user;
        } catch (error) {
            console.error("Error during login:", error);
            throw error; // Pass the error up to the caller
        }
    }

  getCurrentUserEmail(): string | null {
    return this.currentUser.email;
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
      await this.authStatePromise;

      const currentUser = this.currentUser;
      if (currentUser) {
        const eventsCollection = collection(this.db, "Events");
        const querySnapshot = await getDocs(
          query(eventsCollection, where("organizerUserEmail", "==", currentUser.email))
        );
        const events: AppEvent[] = [];

        querySnapshot.forEach((doc) => {
          const eventData = doc.data() as AppEvent;
          eventData.eventId = doc.id; // Include Firestore's document ID
          events.push(eventData);
        });

        return events;
      } else {
        throw new Error("No user is logged in");
      }
    } catch (error) {
      console.error("Error getting events:", error);
      throw error;
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
      await this.authStatePromise; // Ensure auth state is ready

      const currentUser = this.currentUser;

      if (!currentUser) {
        throw new Error('No user is logged in');
      }

      // Define the document reference with the correct type
      const eventDoc: DocumentReference<DocumentData, DocumentData> = doc(this.db, 'Events', eventId);

      // Get the document snapshot
      const eventSnapshot = await getDoc(eventDoc);


      if (eventSnapshot.exists()) {
        // Explicitly cast the data to AppEvent type
        const eventData = eventSnapshot.data() as AppEvent;

        if (eventData && eventData['attendees']) {  // Use bracket notation here
          // Update the confirmed status for the current user in the attendees array
          const updatedAttendees = eventData['attendees'].map((attendee) => {
            if (attendee.email === currentUser.email) {
              return { ...attendee, confirmedStatus: status };  // Update attendee status
            }
            return attendee;
          });

          // Pass the correct structure to updateDoc
          await updateDoc(eventDoc, { attendees: updatedAttendees });

          console.log(`Event attendance updated for user ${currentUser.email} with status ${status}`);

        } else {
          throw new Error('No attendees found for this event.');
        }
      } else {
        throw new Error('Event not found.');
      }
    } catch (error) {
      console.error('Error updating event attendance:', error);
      throw error; // Pass the error up the stack
    }
  }

  async getEventById(eventId: string): Promise<AppEvent | null> {
    try {
      // Wait for the authentication state to be determined
      await this.authStatePromise;

      // Reference the specific document in the "Events" collection
      const eventDoc = doc(this.db, 'Events', eventId);

      // Get the document snapshot
      const eventSnapshot = await getDoc(eventDoc);

      if (eventSnapshot.exists()) {
        // Extract data and include the event ID
        const eventData = eventSnapshot.data() as AppEvent;
        eventData.eventId = eventSnapshot.id; // Add the document ID to the event data

        // Log and return the event data
        console.log("Fetched event by ID:", eventData);
        return eventData;
      } else {
        console.warn("No event found with ID:", eventId);
        return null; // Return null if the event doesn't exist
      }
    } catch (error) {
      console.error("Error fetching event by ID:", error);
      throw error; // Pass the error up to the caller
    }
  }

  async updateEvent(eventId: string, updatedEvent: AppEvent): Promise<void> {
    //only if the logged in user is the organizer of the event
    const eventSnapshot = await getDoc(doc(this.db, 'Events', eventId));
    if (eventSnapshot.exists()) {
      const eventData = eventSnapshot.data() as AppEvent;
      if (eventData.organizerUserEmail !== this.currentUser.email) {
        alert("User is not the organizer of the event");
        throw new Error("User is not the organizer of the event");
      }
    } else {
      console.error("Event not found");
      throw new Error("Event not found");
    }
    try {
      // Wait for the authentication state to be determined
      await this.authStatePromise;

      // Check if the user is logged in
      const currentUser = this.currentUser;

      if (!currentUser) {
        throw new Error("No user is logged in");
      }

      // Reference the specific document in the "Events" collection
      const eventDoc = doc(this.db, 'Events', eventId);

      // Ensure the "organizerUserEmail" is not overwritten and matches the current user
      updatedEvent.organizerUserEmail = currentUser.email;

      // Update the document in Firestore
      await updateDoc(eventDoc, {
        ...updatedEvent,
        updatedAt: new Date() // Optionally add an 'updatedAt' timestamp
      });

      console.log("Event updated successfully!");
    } catch (error) {
      console.error("Error updating event:", error);
      throw error; // Pass the error up to the caller
    }
  }

  async getConfirmedAttendeeEvents(): Promise<AppEvent[]> {
    try {
      // Wait for the authentication state to be determined
      await this.authStatePromise;

      // Check if user is logged in
      const currentUser = this.currentUser;
      if (!currentUser) {
        throw new Error("No user is logged in");
      }

      const eventsCollection = collection(this.db, "Events");

      // Fetch all events from the "Events" collection
      const querySnapshot = await getDocs(eventsCollection);

      const confirmedEvents: AppEvent[] = [];

      // Iterate through each event document
      querySnapshot.forEach((doc) => {
        const eventData = doc.data() as AppEvent;

        // Check if attendees array exists and contains the current user with 'Accepted' status
        if (
          eventData.attendees &&
          eventData.attendees.some(
            (attendee) =>
              attendee.email === currentUser.email &&
              attendee.confirmedStatus === "Accepted"
          )
        ) {
          // Include the eventId (Firestore document ID)
          eventData.eventId = doc.id;
          confirmedEvents.push(eventData);
        }
      });

      return confirmedEvents;
    } catch (error) {
      console.error("Error fetching confirmed attendee events:", error);
      throw error;
    }
  }


}
