import { Injectable } from '@angular/core';
import { GoogleSheetsApiService } from "./gsheets.api.service";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { GoogleServiceAccountService } from "./google-service-account.service";
import { Observable, of } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { FlightLogItem } from "../models/flightlog.model";

@Injectable({
    providedIn: 'root',
})
export class FlightLogService {

    private ITEMS_PER_PAGE = 5;

    private lastId = 0;

    constructor(private http: HttpClient,
                private serviceAccountService: GoogleServiceAccountService,
                private sheetsApiService: GoogleSheetsApiService) {
    }

    init(): Observable<string> {
        this.sheetsApiService.setApiKey(environment.googleApiKey);
        this.reset();
        return this.serviceAccountService.init();
    }

    public reset() {
        if (typeof environment.flightlog === 'string') {
            // TODO not supported yet
        }
        else {
            this.lastId = (environment.flightlog as []).length;
        }
    }

    public fetchItems(): Observable<FlightLogItem[]> {
        if (typeof environment.flightlog === 'string') {
            // TODO not supported yet
        }
        else {
            // no more data
            if (!this.lastId) return of([]);

            const lastId = this.lastId;
            this.lastId = Math.max(this.lastId - this.ITEMS_PER_PAGE, 0);
            return of((environment.flightlog as [])
                .slice(this.lastId, lastId)
                .map((value, index) => {
                    (value as FlightLogItem).id = index + 1;
                    return value;
                })
            );
        }
    }

    public hasMoreData(): boolean {
        if (typeof environment.flightlog === 'string') {
            // TODO not supported yet
            return false;
        }
        else {
            return this.lastId > 0;
        }
    }

    public test() {
        return this.serviceAccountService.ensureAuthToken()
            .pipe(
                mergeMap((authToken) => {
                    this.sheetsApiService.setAuthToken(authToken);
                    return this.sheetsApiService.appendRow(environment.flightlog as unknown as string, 0, {
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
