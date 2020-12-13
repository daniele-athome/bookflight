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
/** Data range for appending. */
const SHEET_APPEND_RANGE = 'A:I';
/** Convert item ID to sheet row number. +1 is for skipping the header row. */
const ITEM_ID_TO_ROWNUM = (id) => id + 1;

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
            this.lastId = Math.max(this.lastId - ITEMS_PER_PAGE, 0);
            const firstId = this.lastId;
            return of((environment.flightlog as unknown as [])
                .slice(this.lastId, lastId)
                .map((value, index) => {
                    (value as FlightLogItem).id = firstId+index+1;
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
                        this.lastId = Math.max(this.lastId - ITEMS_PER_PAGE, 0);
                        const firstId = this.lastId;
                        console.log(`getting rows from ${firstId} to ${lastId} (range: ${SHEET_DATA_RANGE(firstId, lastId)})`);
                        return this.sheetsApiService.getRows(datasource.spreadsheetId, datasource.sheetName, SHEET_DATA_RANGE(firstId, lastId))
                            .pipe(
                                map((value: gapi.client.sheets.ValueRange) => {
                                    return value.values.map((rowData, index) => {
                                        return {
                                            id: firstId+index+1,
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

    public appendItem(item: FlightLogItem): Observable<Object> {
        return this.serviceAccountService.ensureAuthToken()
            .pipe(
                mergeMap((authToken) => {
                    const datasource = environment.flightlog as unknown as FlightLogSpreadsheet;
                    this.sheetsApiService.setAuthToken(authToken);
                    return this.sheetsApiService.appendRows(
                        datasource.spreadsheetId,
                        datasource.sheetName,
                        SHEET_APPEND_RANGE,
                        [
                            [
                                datetime.formatDateCustom(new Date(), 'YYYY-MM-DD HH:mm:ss'),
                                datetime.formatISODate(item.date),
                                item.pilot,
                                item.startHour,
                                item.endHour,
                                item.origin,
                                item.destination,
                                item.fuel,
                                item.notes,
                            ]
                        ]
                    );
                })
            );
    }

    public updateItem(item: FlightLogItem): Observable<Object> {
        return this.serviceAccountService.ensureAuthToken()
            .pipe(
                mergeMap((authToken) => {
                    console.log(`updating row with range: ${SHEET_DATA_RANGE(item.id-1, item.id-1)}`);
                    const datasource = environment.flightlog as unknown as FlightLogSpreadsheet;
                    this.sheetsApiService.setAuthToken(authToken);
                    return this.sheetsApiService.updateRows(
                        datasource.spreadsheetId,
                        datasource.sheetName,
                        SHEET_DATA_RANGE(item.id-1, item.id-1),
                        [
                            [
                                datetime.formatDateCustom(new Date(), 'YYYY-MM-DD HH:mm:ss'),
                                datetime.formatISODate(item.date),
                                item.pilot,
                                item.startHour,
                                item.endHour,
                                item.origin,
                                item.destination,
                                item.fuel,
                                item.notes,
                            ]
                        ]
                    );
                })
            );
    }

    public deleteItem(item: FlightLogItem): Observable<Object> {
        return this.serviceAccountService.ensureAuthToken()
            .pipe(
                mergeMap((authToken) => {
                    console.log(`delete row with range: ${SHEET_DATA_RANGE(item.id-1, item.id-1)}`);
                    const datasource = environment.flightlog as unknown as FlightLogSpreadsheet;
                    this.sheetsApiService.setAuthToken(authToken);
                    const rowNumber = ITEM_ID_TO_ROWNUM(item.id);
                    return this.sheetsApiService.deleteRows(
                        datasource.spreadsheetId,
                        datasource.sheetName,
                        rowNumber, rowNumber,
                    );
                })
            );
    }

    public hasMoreData(): boolean {
        return this.lastId > 0;
    }

    private isTestData(): boolean {
        return Array.isArray(environment.flightlog);
    }

}
