import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
    providedIn: 'root',
})
export class GmailService {
    // url pt palyground https://www.googleapis.com/auth/gmail.send
    private ACCESS_TOKEN: string | null = null;

    constructor() {
        this.loadAccessToken();
    }

    private async loadAccessToken(): Promise<void> {
        try {
            const response = await fetch('/gmail-access-token.json'); // Corrected path
            const data = await response.json();
            console.log('Access token loaded:', data);
            this.ACCESS_TOKEN = data.ACCESS_TOKEN;
        } catch (error) {
            console.error('Failed to load access token:', error);
        }
    }

    async sendEmail(to: string, subject: string, body: string): Promise<any> {
        const email = [
            `To: ${to}`,
            'Content-Type: text/plain; charset="UTF-8"',
            'MIME-Version: 1.0',
            `Subject: ${subject}`,
            '',
            body,
        ].join('\r\n');

        const encodedEmail = btoa(email)
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        try {
            const response = await axios.post(
                'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
                { raw: encodedEmail },
                {
                    headers: {
                        Authorization: `Bearer ${this.ACCESS_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log('Email sent successfully:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('Error sending email:', error.response?.data || error);
            throw new Error('Failed to send email');
        }
    }
}
