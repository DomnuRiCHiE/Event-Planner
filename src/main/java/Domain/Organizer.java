package Domain;

import java.util.Date;

public class Organizer extends User{


    public Organizer(int userId, String email, String password, String role) {
        super(userId, email, password, role);
    }

    public void createEvent(String name, Date startDate, Date endDate, String location) {
        // Logic to create a new event
    }

    public void manageAttendees(int eventId) {
        // Logic to manage attendees (CRUD operations + import from Excel)
    }

    public void sendInvitations(int eventId) {
        // Logic to send invitations via email
    }

    public void defineSchedule(int eventId, Schedule schedule) {
        // Define event schedule
    }

    public void sendSchedule(int eventId) {
        // Send schedule to confirmed attendees
    }
}
