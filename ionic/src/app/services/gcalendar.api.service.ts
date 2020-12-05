import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { CustomHttpParamEncoder } from "../utils/customhttpencoder";

@Injectable()
export class GoogleCalendarApiService {

    // TODO use an interceptor or make the authentication stuff common

    private COLLECTION_URL = (calendarId) => `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`;
    private ITEM_URL = (calendarId, eventId) => `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`;

    private apiKey: string;
    private accessToken: string;

    constructor(private http: HttpClient) {
    }

    public setApiKey(apiKey: string) {
        this.apiKey = apiKey;
    }

    public setAuthToken(accessToken: string) {
        this.accessToken = accessToken;
    }

    public listEvents(calendarId: string, timeMin?: string, timeMax?: string) {
        return this.http.get(this.COLLECTION_URL(calendarId), {
            headers: new HttpHeaders({
                'Authorization': 'Bearer ' + this.accessToken,
            }),
            params: new HttpParams({encoder: new CustomHttpParamEncoder()})
                .set('key', this.apiKey)
                .set('timeMin', timeMin)
                .set('timeMax', timeMax),
        });
    }

    public insertEvent(calendarId: string, event: gapi.client.calendar.Event) {
        return this.http.post(this.COLLECTION_URL(calendarId), event, {
            headers: new HttpHeaders({
                'Authorization': 'Bearer ' + this.accessToken,
            }),
            params: new HttpParams({encoder: new CustomHttpParamEncoder()})
                .set('key', this.apiKey),
        });
    }

    public updateEvent(calendarId: string, eventId: string, event: gapi.client.calendar.Event) {
        return this.http.put(this.ITEM_URL(calendarId, eventId), event, {
            headers: new HttpHeaders({
                'Authorization': 'Bearer ' + this.accessToken,
            }),
            params: new HttpParams({encoder: new CustomHttpParamEncoder()})
                .set('key', this.apiKey),
        });
    }

    public deleteEvent(calendarId: string, eventId: string) {
        return this.http.delete(this.ITEM_URL(calendarId, eventId), {
            headers: new HttpHeaders({
                'Authorization': 'Bearer ' + this.accessToken,
            }),
            params: new HttpParams({encoder: new CustomHttpParamEncoder()})
                .set('key', this.apiKey),
        });
    }

}
