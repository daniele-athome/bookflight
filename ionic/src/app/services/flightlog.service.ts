import { Injectable } from '@angular/core';
import { GoogleSheetsApiService } from "./gsheets.api.service";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { GoogleServiceAccountService } from "./google-service-account.service";
import { Observable } from "rxjs";
import { mergeMap } from "rxjs/operators";

@Injectable({
    providedIn: 'root',
})
export class FlightLogService {

    constructor(private http: HttpClient,
                private serviceAccountService: GoogleServiceAccountService,
                private sheetsApiService: GoogleSheetsApiService) {
    }

    init(): Observable<string> {
        this.sheetsApiService.setApiKey(environment.googleApiKey);
        return this.serviceAccountService.init();
    }

    public test() {
        return this.serviceAccountService.ensureAuthToken()
            .pipe(
                mergeMap((authToken) => {
                    this.sheetsApiService.setAuthToken(authToken);
                    return this.sheetsApiService.appendRow('1U7AylLY5OgnXgUJu75Jlfj-veNiT9Pzon0L9ESnpdK8', 0, {
                        values: [
                            {
                                userEnteredValue: {stringValue: 'TEST'}
                            }
                        ]
                    } as gapi.client.sheets.RowData);
                })
            );
    }

}
