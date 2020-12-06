import { Injectable } from '@angular/core';
import { mergeMap } from "rxjs/operators";
import { Observable, of } from "rxjs";
import { GoogleServiceAccount } from "../models/google.model";
import { environment } from "../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { KJUR } from "jsrsasign";

@Injectable({
    providedIn: 'root',
})
export class GoogleServiceAccountService {

    private SCOPES = [
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/calendar.events",
        "https://www.googleapis.com/auth/spreadsheets",
    ];

    private serviceAccount: GoogleServiceAccount;
    private authTokenTimestamp: number;
    private authToken: gapi.auth.GoogleApiOAuth2TokenObject;

    constructor(private http: HttpClient) {
    }

    init(): Observable<string> {
        if (!this.serviceAccount) {
            return this.http.get(environment.googleApiServiceAccount)
                .pipe(
                    mergeMap((data: GoogleServiceAccount) => {
                        console.log(data);
                        this.serviceAccount = data;
                        return this.ensureAuthToken();
                    })
                );
        }
        else {
            return this.ensureAuthToken();
        }
    }

    public ensureAuthToken(): Observable<string> {
        if (!this.serviceAccount) {
            return this.init();
        }
        else if (!this.isAuthTokenValid()) {
            return this.requestAuthToken();
        }
        return of(this.authToken.access_token);
    }

    private isAuthTokenValid(): boolean {
        if (this.authToken) {
            // TODO test this
            const now = new Date().getTime();
            return ((this.authTokenTimestamp + (parseInt(this.authToken.expires_in) * 1000)) - now) > 10000;
        }
        return false;
    }

    private requestAuthToken(): Observable<string> {
        const header = JSON.stringify({"alg":"RS256","typ":"JWT"});
        const claim = JSON.stringify({
            aud: "https://www.googleapis.com/oauth2/v3/token",
            scope: this.SCOPES.join(' '),
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
                    return of(data.access_token);
                }),
            );
    }

}
