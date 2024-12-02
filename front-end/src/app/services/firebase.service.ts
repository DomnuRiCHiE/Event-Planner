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
                event.organizerUserId = currentUser.uid; // Set the current user's ID in the event

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
                        where("organizerUserId", "==", currentUser.uid)
                    )
                );
                const events: AppEvent[] = [];

                querySnapshot.forEach((doc: any) => {
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

    async getLoggedInUsersEventsAndAttendeeEvents(): Promise<AppEvent[]> {
        try {
            // Wait for the authentication state to be determined
            await this.authStatePromise;

            const currentUser = this.currentUser;
            console.log("Current user:", currentUser);

            if (currentUser) {
                const eventsCollection = collection(this.db, "Events");

                // Query for events where the user is the organizer
                const organizerQuerySnapshot = await getDocs(
                    query(
                        eventsCollection,
                        where("organizerUserId", "==", currentUser.uid)
                    )
                );
                const events: AppEvent[] = [];

                organizerQuerySnapshot.forEach((doc: any) => {
                    events.push(doc.data() as AppEvent);
                });

                // Query for events where the user is an attendee
                const attendeeQuerySnapshot = await getDocs(
                    query(
                        eventsCollection,
                        where("attendees", "array-contains", currentUser.email)
                    )
                );

                attendeeQuerySnapshot.forEach((doc: any) => {
                    console.log("Attendee event:", doc.data());
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
}
