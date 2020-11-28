import { Injectable } from '@angular/core';
import { CalEvent } from '../models/calevent.model';
import { calendar_v3, google } from 'googleapis';
import { environment } from "../../environments/environment";

// FIXME this will never work since googleapis is for Node, not for the browser
// workaround: https://medium.com/angular-in-depth/google-apis-with-angular-214fadb8fbc5

@Injectable({
    providedIn: 'root'
})
export class CalendarService {

    private client: calendar_v3.Calendar;

    constructor() {
        const auth = new google.auth.GoogleAuth({
            keyFile: environment.googleApiServiceAccount,
            scopes: [
                'https://www.googleapis.com/auth/calendar.events',
                'https://www.googleapis.com/auth/calendar'
            ],
        });
        this.client = new calendar_v3.Calendar({auth: auth});
    }

    // TODO

    public createEvent(event: CalEvent) {
        // TODO
    }

    public updateEvent(eventId: string, event: CalEvent) {
        // TODO
    }

    public deleteEvent(eventId: string) {
        // TODO
        this.client.events.delete({
            calendarId: environment.events as unknown as string,
            eventId: eventId
        }, (err, res) => {
            // TODO
        });
    }

}
