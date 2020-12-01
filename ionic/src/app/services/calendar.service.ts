import { Injectable } from '@angular/core';
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

@Injectable({
    providedIn: 'root'
})
export class CalendarService {

    private loaded = false;

    private serviceAccount: GoogleServiceAccount;
    private authTokenTimestamp: number;
    private authToken: gapi.auth.GoogleApiOAuth2TokenObject;

    constructor(private http: HttpClient) {
    }

    async init() {
        if (!this.loaded) {
            await this.loadGapi();
            gapi.load('client:auth2', () => this.onClientLoaded());
            this.loaded = true;
        }
    }

    private loadGapi() {
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        window.document.body.appendChild(script);
        return new Promise<void>((resolve, reject) => {
            script.addEventListener('error', (error) => reject(error));
            script.addEventListener('load', () => resolve());
        });
    }

    private onClientLoaded() {
        this.http.get(environment.googleApiServiceAccount)
            .subscribe((data: GoogleServiceAccount) => {
                console.log(data);

                gapi.client
                    .init({
                        apiKey: environment.googleCalendarApiKey,
                        discoveryDocs: [
                            "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
                        ]
                    }).then(async () => {
                        this.serviceAccount = data;
                        await this.ensureAuthToken();
                    })
                    .catch((error) => {
                        // TODO error
                        console.log(error);
                    });
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
                        gapi.client.setToken(data);
                        resolve();
                    },
                    (error) => {
                        // TODO error
                        console.log(error);
                        reject(error);
                    });
        });
    }

    public eventConflicts(eventId: string, event: CalEvent) {
        return this.ensureAuthToken()
            .then(async () => {
                const events = await gapi.client.calendar.events.list({
                    calendarId: environment.events,
                    timeMin: datetime.formatDateTime(event.startDate, event.startTime),
                    timeMax: datetime.formatDateTime(event.endDate, event.endTime),
                });
                return events.result.items.filter((value) => {
                    return value.id != eventId;
                }).length > 0;
            });
    }

    public createEvent(event: CalEvent) {
        return this.ensureAuthToken()
            .then(() => {
                const gevent: gapi.client.calendar.Event = {
                    summary: event.title,
                    description: event.description,
                    start: {dateTime: datetime.formatDateTime(event.startDate, event.startTime)} as gapi.client.calendar.EventDateTime,
                    end: {dateTime: datetime.formatDateTime(event.endDate, event.endTime)} as gapi.client.calendar.EventDateTime,
                };
                return gapi.client.calendar.events.insert(
                    {calendarId: environment.events},
                    gevent
                );
            });
    }

    public updateEvent(eventId: string, event: CalEvent) {
        return this.ensureAuthToken()
            .then(() => {
                const gevent: gapi.client.calendar.Event = {
                    summary: event.title,
                    description: event.description,
                    start: {dateTime: datetime.formatDateTime(event.startDate, event.startTime)} as gapi.client.calendar.EventDateTime,
                    end: {dateTime: datetime.formatDateTime(event.endDate, event.endTime)} as gapi.client.calendar.EventDateTime,
                };
                return gapi.client.calendar.events.update(
                    {calendarId: environment.events, eventId: eventId},
                    gevent
                );
            });
    }

    public deleteEvent(eventId: string) {
        return this.ensureAuthToken()
            .then(() => {
                return gapi.client.calendar.events.delete(
                    {calendarId: environment.events, eventId: eventId}
                );
            });
    }

}
