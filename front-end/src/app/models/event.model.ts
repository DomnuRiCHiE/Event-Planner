import { Schedule } from "./schedule.model";
import {Attendee} from './attendee.model';

export interface AppEvent {
    eventId?: string;
    name: string;
    startDate: Date;
    endDate: Date;
    location: string;
    organizerUserEmail : string;
    attendees?: Attendee[];
    schedule?: Schedule[];
}
