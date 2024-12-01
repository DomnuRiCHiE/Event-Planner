const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const express = require('express');

// Firebase initialization
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://mybigday-53567-default-rtdb.europe-west1.firebasedatabase.app"
});

// Nodemailer Transporter (Example with Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'eventplannerproject93@gmail.com', // Replace with your email
    pass: 'Pass4123'  // Replace with your email password or app-specific password
  }
});

const app = express();
app.use(express.json());

// Endpoint to send invitations
app.post('/send-invitations', async (req, res) => {
  const { eventId } = req.body;

  try {
    // Fetch event data from Firebase
    const eventRef = admin.database().ref(`events/${eventId}`);
    const eventSnapshot = await eventRef.once('value');
    const eventData = eventSnapshot.val();

    if (!eventData) {
      return res.status(404).json({ message: "Event not found." });
    }

    const { attendees, name, location, startDate, endDate } = eventData;

    if (!attendees || attendees.length === 0) {
      return res.status(400).json({ message: "No attendees found." });
    }

    // Prepare email content and send emails
    const emailPromises = attendees.map((email) => {
      const mailOptions = {
        from: '"Event Organizer" <eventplannerproject93@gmail.com>', // Replace with your email
        to: email,
        subject: `Invitation to ${name}`,
        text: `You are invited to the event: ${name}, at ${location}, from ${startDate} to ${endDate}.`,
        html: `
                    <p>You are invited to the event: <strong>${name}</strong>, at <strong>${location}</strong>.</p>
                    <p>Date: <strong>${startDate}</strong> to <strong>${endDate}</strong>.</p>
                    <p>Please confirm your attendance!</p>
                `
      };

      return transporter.sendMail(mailOptions);
    });

    // Await all email promises
    await Promise.all(emailPromises);

    res.json({ message: "Invitations sent successfully!" });
  } catch (error) {
    console.error("Error sending invitations:", error);
    res.status(500).json({ message: "Error sending invitations.", error });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
