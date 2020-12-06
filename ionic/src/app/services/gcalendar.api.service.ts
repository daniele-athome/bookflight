import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { GoogleApiService } from "../utils/gapi.service";

@Injectable()
export class GoogleCalendarApiService extends GoogleApiService {

    private COLLECTION_URL = (calendarId) => `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`;
    private ITEM_URL = (calendarId, eventId) => `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`;

    constructor(private http: HttpClient) {
        super(http);
    }

    public listEvents(calendarId: string, timeMin?: string, timeMax?: string) {
        return this.request('get', this.COLLECTION_URL(calendarId), {
            params: {
                'timeMin': timeMin,
                'timeMax': timeMax,
            }
        });
    }

    public insertEvent(calendarId: string, event: gapi.client.calendar.Event) {
        return this.request('post', this.COLLECTION_URL(calendarId), {
            body: event
        });
    }

    public updateEvent(calendarId: string, eventId: string, event: gapi.client.calendar.Event) {
        return this.request('put', this.ITEM_URL(calendarId, eventId),{
            body: event
        });
    }

    public deleteEvent(calendarId: string, eventId: string) {
        return this.request('delete', this.ITEM_URL(calendarId, eventId));
    }

}
