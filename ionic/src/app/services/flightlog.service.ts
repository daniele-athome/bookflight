import { Injectable } from '@angular/core';
import { GoogleSheetsApiService } from "./gsheets.api.service";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { GoogleServiceAccountService } from "./google-service-account.service";
import { Observable, of } from "rxjs";
import { map, mergeMap } from "rxjs/operators";
import { FlightLogItem } from "../models/flightlog.model";
import * as datetime from "../utils/datetime";

interface FlightLogSpreadsheet {
    spreadsheetId: string,
    sheetName: string,
}

/** Items per page to fetch. */
const ITEMS_PER_PAGE = 20;
/** Cell containing the row count. */
const SHEET_COUNT_RANGE = 'A1';
/** Data range generator. +2 because the index is 0-based and to skip the header row. */
const SHEET_DATA_RANGE = (first, last) => `A${first+2}:I${last+2}`;

@Injectable({
    providedIn: 'root',
})
export class FlightLogService {

    private lastId = 0;

    constructor(private http: HttpClient,
                private serviceAccountService: GoogleServiceAccountService,
                private sheetsApiService: GoogleSheetsApiService) {
    }

    init(): Observable<void> {
        this.sheetsApiService.setApiKey(environment.googleApiKey);
        return this.serviceAccountService.init()
            .pipe(
                mergeMap(() => {
                    return this.reset()
                })
            );
    }

    public reset() {
        if (this.isTestData()) {
            this.lastId = (environment.flightlog as unknown as []).length;
            return of(void 0);
        }
        else {
            return this.serviceAccountService.ensureAuthToken()
                .pipe(
                    mergeMap((authToken) => {
                        this.sheetsApiService.setAuthToken(authToken);
                        const datasource = environment.flightlog as unknown as FlightLogSpreadsheet;
                        return this.sheetsApiService.getRows(datasource.spreadsheetId, datasource.sheetName, SHEET_COUNT_RANGE)
                            .pipe(
                                mergeMap((value: gapi.client.sheets.ValueRange) => {
                                    this.lastId = value.values[0][0];
                                    console.log('last id is: ' + this.lastId);
                                    return of(void 0);
                                }),
                            );
                    })
                );
        }
    }

    public fetchItems(): Observable<FlightLogItem[]> {
        if (this.isTestData()) {
            // no more data
            if (!this.lastId) return of([]);

            const lastId = this.lastId - 1;
            this.lastId = Math.max(this.lastId - (ITEMS_PER_PAGE - 1), 0);
            return of((environment.flightlog as unknown as [])
                .slice(this.lastId, lastId)
                .map((value, index) => {
                    (value as FlightLogItem).id = index + 1;
                    return value;
                })
            );
        }
        else {
            return this.serviceAccountService.ensureAuthToken()
                .pipe(
                    mergeMap((authToken) => {
                        this.sheetsApiService.setAuthToken(authToken);
                        const datasource = environment.flightlog as unknown as FlightLogSpreadsheet;
                        const lastId = this.lastId - 1;
                        this.lastId = Math.max(this.lastId - (ITEMS_PER_PAGE - 1), 0);
                        console.log(`getting rows from ${this.lastId} to ${lastId}`);
                        return this.sheetsApiService.getRows(datasource.spreadsheetId, datasource.sheetName, SHEET_DATA_RANGE(this.lastId, lastId))
                            .pipe(
                                map((value: gapi.client.sheets.ValueRange) => {
                                    return value.values.map(rowData => {
                                        return {
                                            date: datetime.xlSerialToDate(rowData[1]),
                                            pilot: rowData[2],
                                            startHour: rowData[3],
                                            endHour: rowData[4],
                                            origin: rowData[5],
                                            destination: rowData[6],
                                            fuel: rowData[7],
                                            notes: rowData[8],
                                        } as FlightLogItem;
                                    });
                                }),
                            );
                    })
                );
        }
    }

    public hasMoreData(): boolean {
        return this.lastId > 0;
    }

    private isTestData(): boolean {
        return Array.isArray(environment.flightlog);
    }

    public testWrite() {
        return this.serviceAccountService.ensureAuthToken()
            .pipe(
                mergeMap((authToken) => {
                    this.sheetsApiService.setAuthToken(authToken);
                    return this.sheetsApiService.appendRow(
                        environment.flightlog as unknown as string,
                        "Registro voli",
                        "A:I",
                        [
                            [
                                '2020-12-01 19:18:00',
                                '2020-12-01',
                                'Daniele',
                                '1968.81',
                                '1969.27',
                                'Fly Roma',
                                'Fly Roma',
                                '16',
                                '',
                            ]
                        ]
                    );
                })
            );
    }

}
