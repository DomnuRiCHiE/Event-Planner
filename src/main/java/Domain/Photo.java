package Domain;

import java.util.Date;

public class Photo {

    private int photoId;
    private int eventId;
    private int uploaderId;
    private String photoURL;
    private Date uploadTime;

    public Photo(int photoId, int eventId, int uploaderId, String photoURL, Date uploadTime) {
        this.photoId = photoId;
        this.eventId = eventId;
        this.uploaderId = uploaderId;
        this.photoURL = photoURL;
        this.uploadTime = uploadTime;
    }

    public int getPhotoId() {
        return photoId;
    }

    public void setPhotoId(int photoId) {
        this.photoId = photoId;
    }

    public int getEventId() {
        return eventId;
    }

    public void setEventId(int eventId) {
        this.eventId = eventId;
    }

    public int getUploaderId() {
        return uploaderId;
    }

    public void setUploaderId(int uploaderId) {
        this.uploaderId = uploaderId;
    }

    public String getPhotoURL() {
        return photoURL;
    }

    public void setPhotoURL(String photoURL) {
        this.photoURL = photoURL;
    }

    public Date getUploadTime() {
        return uploadTime;
    }

    public void setUploadTime(Date uploadTime) {
        this.uploadTime = uploadTime;
    }
}
