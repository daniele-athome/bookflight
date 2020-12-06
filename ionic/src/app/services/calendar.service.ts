import { Injectable } from '@angular/core';
import { GoogleCalendarApiService } from "./gcalendar.api.service";
import { CalEvent } from '../models/calevent.model';
import { GoogleServiceAccount } from "../models/google.model";
import { environment } from "../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { KJUR } from "jsrsasign";
import * as datetime from "../utils/datetime";

import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

// https://github.com/Maxim-Mazurok/angular-google-calendar-typescript-example

@Injectable()
export class CalendarService {

    private serviceAccount: GoogleServiceAccount;
    private authTokenTimestamp: number;
    private authToken: gapi.auth.GoogleApiOAuth2TokenObject;

    constructor(private http: HttpClient,
                private calendarApiService: GoogleCalendarApiService) {
    }

    async init() {
        return this.http.get(environment.googleApiServiceAccount)
            .subscribe(async (data: GoogleServiceAccount) => {
                console.log(data);
                this.serviceAccount = data;
                this.calendarApiService.setApiKey(environment.googleCalendarApiKey);
                await this.ensureAuthToken();
            });
    }

    private async ensureAuthToken() {
        if (!this.isAuthTokenValid()) {
            return this.requestAuthToken();
        }
        return Promise.resolve();
    }

    private isAuthTokenValid(): boolean {
        if (this.authToken) {
            // TODO test this
            const now = new Date().getTime();
            return ((this.authTokenTimestamp + (parseInt(this.authToken.expires_in) * 1000)) - now) > 10000;
        }
        return false;
    }

    private requestAuthToken() {
        const header = JSON.stringify({"alg":"RS256","typ":"JWT"});
        const claim = JSON.stringify({
            aud: "https://www.googleapis.com/oauth2/v3/token",
            scope: "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events",
            iss: this.serviceAccount.client_email,
            exp: KJUR.jws.IntDate.get("now + 1hour"),
            iat: KJUR.jws.IntDate.get("now"),
        });
        const jws = KJUR.jws.JWS.sign(null, header, claim, this.serviceAccount.private_key);

        const params = new HttpParams()
            .set("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer")
            .set("assertion", jws);

        return new Promise<void>((resolve, reject) => {
            this.http.post("https://oauth2.googleapis.com/token", params)
                .subscribe(
                    (data: gapi.auth.GoogleApiOAuth2TokenObject) => {
                        console.log(data);
                        this.authToken = data;
                        this.authTokenTimestamp = new Date().getTime();
                        this.calendarApiService.setAuthToken(data.access_token);
                        resolve();
                    },
                    (error) => {
                        // TODO error
                        console.log(error);
                        reject(error);
                    });
        });
    }

    public async eventConflicts(eventId: string, event: CalEvent) {
        return this.calendarApiService.listEvents(environment.events,
                datetime.formatDateTime(event.startDate, event.startTime),
                datetime.formatDateTime(event.endDate, event.endTime))
            .toPromise()
            .then((events: gapi.client.calendar.Events) => {
                return events.items.filter((value) => {
                    return value.id != eventId;
                }).length > 0;
            });
    }

    public createEvent(event: CalEvent) {
        const gevent: gapi.client.calendar.Event = {
            summary: event.title,
            description: event.description,
            start: {dateTime: datetime.formatDateTime(event.startDate, event.startTime)} as gapi.client.calendar.EventDateTime,
            end: {dateTime: datetime.formatDateTime(event.endDate, event.endTime)} as gapi.client.calendar.EventDateTime,
        };
        return this.calendarApiService.insertEvent(environment.events, gevent).toPromise();
    }

    public async updateEvent(eventId: string, event: CalEvent) {
        const gevent: gapi.client.calendar.Event = {
            summary: event.title,
            description: event.description,
            start: {dateTime: datetime.formatDateTime(event.startDate, event.startTime)} as gapi.client.calendar.EventDateTime,
            end: {dateTime: datetime.formatDateTime(event.endDate, event.endTime)} as gapi.client.calendar.EventDateTime,
        };
        return this.calendarApiService.updateEvent(
            environment.events, eventId, gevent
        ).toPromise();
    }

    public deleteEvent(eventId: string) {
        return this.calendarApiService.deleteEvent(environment.events, eventId).toPromise();
    }

}
