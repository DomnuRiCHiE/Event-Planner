package Domain;

import java.util.Date;
import java.util.List;

public class Event {
    private int eventId;
    private String name;
    private Date startDate;
    private Date endDate;
    private String location;
    private List<Organizer> organizers;
    private List<Attendee> attendees;
    private Schedule schedule;
}
