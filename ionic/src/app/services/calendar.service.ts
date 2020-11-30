import { Injectable } from '@angular/core';
import { CalEvent } from '../models/calevent.model';
import { environment } from "../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { KEYUTIL, KJUR } from "jsrsasign";

// https://github.com/Maxim-Mazurok/angular-google-calendar-typescript-example

interface GoogleServiceAccount {
    type: string,
    project_id: string,
    private_key_id: string,
    private_key: string,
    client_email: string,
    client_id: string,
    auth_uri: string,
    token_uri: string,
    auth_provider_x509_cert_url: string,
    client_x509_cert_url: string,
}

@Injectable({
    providedIn: 'root'
})
export class CalendarService {

    constructor(private http: HttpClient) {
        gapi.load('client:auth2', () => this.onAuthLoaded());
    }

    private onAuthLoaded() {
        // TODO
        this.http.get(environment.googleApiServiceAccount)
            .subscribe((data: GoogleServiceAccount) => {
                console.log(data);

                gapi.client
                    .init({
                        apiKey: environment.googleCalendarApiKey,
                        discoveryDocs: [
                            "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
                        ]
                    }).then(() => {
                        this.buildJWT(data);
                });
            });
    }

    private buildJWT(serviceAccount: GoogleServiceAccount) {
        const header = JSON.stringify({"alg":"RS256","typ":"JWT"});
        const claim = JSON.stringify({
            aud: "https://www.googleapis.com/oauth2/v3/token",
            scope: "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events",
            iss: serviceAccount.client_email,
            exp: KJUR.jws.IntDate.get("now + 1hour"),
            iat: KJUR.jws.IntDate.get("now"),
        });
        const jws = KJUR.jws.JWS.sign(null, header, claim, serviceAccount.private_key);

        const params = new HttpParams()
            .set("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer")
            .set("assertion", jws);
        this.http.post("https://oauth2.googleapis.com/token", params)
            .subscribe((data: gapi.auth.GoogleApiOAuth2TokenObject) => {
                console.log(data);
                gapi.client.setToken(data);
                gapi.client.calendar.events.get({
                    calendarId: environment.events,
                    eventId: "2cvdqs39q7a3sqgrbbdnm3vgdo"
                }).then(res => {
                    console.log(res);
                });

            });
    }

    public createEvent(event: CalEvent) {
        // TODO
    }

    public updateEvent(eventId: string, event: CalEvent) {
        // TODO
    }

    public deleteEvent(eventId: string) {
        // TODO
    }

}
