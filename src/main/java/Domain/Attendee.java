package Domain;

public class Attendee extends User{
    public Attendee(int userId, String email, String password, String role) {
        super(userId, email, password, role);
    }

    public void confirmAttendance(int eventId) {
        // Logic to confirm attendance
    }

    public List<Event> viewEvents() {
        // Logic to view all events
        return null;
    }

    public void uploadPhoto(int eventId, Photo photo) {
        // Logic to upload a photo for an event
    }

    public List<Photo> browsePhotos(int eventId) {
        // Logic to browse photos for an event
        return null;
    }
}
