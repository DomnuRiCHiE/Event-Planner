import { Schedule } from "./schedule.model";
import { User } from "./user.model";

export interface Event {
    eventId?: number;
    name: string;
    startDate: Date;
    endDate: Date;
    location: string;
    organizerUserId : string;
    attendees?: String[];
    schedule?: Schedule[];
}
