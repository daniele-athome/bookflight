import { Injectable } from '@angular/core';
import { map, mergeMap } from "rxjs/operators";
import { Observable, of } from "rxjs";
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

    init(): Observable<void> {
        return this.http.get(environment.googleApiServiceAccount)
            .pipe(
                mergeMap((data: GoogleServiceAccount) => {
                    console.log(data);
                    this.serviceAccount = data;
                    this.calendarApiService.setApiKey(environment.googleCalendarApiKey);
                    return this.ensureAuthToken();
                })
            );
    }

    private ensureAuthToken(): Observable<void> {
        if (!this.serviceAccount) {
            return this.init();
        }
        else if (!this.isAuthTokenValid()) {
            return this.requestAuthToken();
        }
        return of(void 0);
    }

    private isAuthTokenValid(): boolean {
        if (this.authToken) {
            // TODO test this
            const now = new Date().getTime();
            return ((this.authTokenTimestamp + (parseInt(this.authToken.expires_in) * 1000)) - now) > 10000;
        }
        return false;
    }

    private requestAuthToken(): Observable<void> {
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

        return this.http.post("https://oauth2.googleapis.com/token", params)
            .pipe(
                mergeMap((data: gapi.auth.GoogleApiOAuth2TokenObject) => {
                    console.log(data);
                    this.authToken = data;
                    this.authTokenTimestamp = new Date().getTime();
                    this.calendarApiService.setAuthToken(data.access_token);
                    return of(void 0);
                }),
            );
    }

    public eventConflicts(eventId: string, event: CalEvent): Observable<boolean> {
        return this.ensureAuthToken()
            .pipe(
                mergeMap(() => {
                    return this.calendarApiService.listEvents(environment.events,
                        datetime.formatDateTime(event.startDate, event.startTime),
                        datetime.formatDateTime(event.endDate, event.endTime))
                        .pipe(
                            map((events: gapi.client.calendar.Events) => {
                                return events.items.filter((value) => {
                                    return value.id != eventId;
                                }).length > 0;
                            })
                        );
                })
            );
    }

    public createEvent(event: CalEvent): Observable<any> {
        return this.ensureAuthToken()
            .pipe(
                mergeMap(() => {
                    const gevent: gapi.client.calendar.Event = {
                        summary: event.title,
                        description: event.description,
                        start: {dateTime: datetime.formatDateTime(event.startDate, event.startTime)} as gapi.client.calendar.EventDateTime,
                        end: {dateTime: datetime.formatDateTime(event.endDate, event.endTime)} as gapi.client.calendar.EventDateTime,
                    };
                    return this.calendarApiService.insertEvent(environment.events, gevent);
                })
            );
    }

    public updateEvent(eventId: string, event: CalEvent): Observable<any> {
        return this.ensureAuthToken()
            .pipe(
                mergeMap(() => {
                    const gevent: gapi.client.calendar.Event = {
                        summary: event.title,
                        description: event.description,
                        start: {dateTime: datetime.formatDateTime(event.startDate, event.startTime)} as gapi.client.calendar.EventDateTime,
                        end: {dateTime: datetime.formatDateTime(event.endDate, event.endTime)} as gapi.client.calendar.EventDateTime,
                    };
                    return this.calendarApiService.updateEvent(environment.events, eventId, gevent);
                })
            );
    }

    public deleteEvent(eventId: string): Observable<any> {
        return this.ensureAuthToken()
            .pipe(
                mergeMap(() => {
                    return this.calendarApiService.deleteEvent(environment.events, eventId);
                })
            );
    }

}
