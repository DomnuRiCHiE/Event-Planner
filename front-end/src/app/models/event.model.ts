import { Schedule } from "./schedule.model";
import {Attendee} from './attendee.model';

export interface AppEvent {
    eventId?: number;
    name: string;
    startDate: Date;
    endDate: Date;
    location: string;
    organizerUserId : string;
    attendees?: Attendee[];
    schedule?: Schedule[];
}
