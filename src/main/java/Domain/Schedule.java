package Domain;


import java.util.Date;

public class Schedule {
    private int scheduleId;
    private int eventId;
    private String description;
    private Date time;

    public Schedule(int scheduleId, int eventId, String description, Date time) {
        this.scheduleId = scheduleId;
        this.eventId = eventId;
        this.description = description;
        this.time = time;
    }

    public int getScheduleId() {
        return scheduleId;
    }

    public void setScheduleId(int scheduleId) {
        this.scheduleId = scheduleId;
    }

    public int getEventId() {
        return eventId;
    }

    public void setEventId(int eventId) {
        this.eventId = eventId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getTime() {
        return time;
    }

    public void setTime(Date time) {
        this.time = time;
    }
}
