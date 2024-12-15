package EmailNotifications;

import lombok.Getter;

@Getter
public class EmailRequest {
    private String to;
    private String subject;
    private String text;

    public void setTo(String to) {
        this.to = to;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public void setText(String text) {
        this.text = text;
    }
}
