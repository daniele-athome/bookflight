import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { GoogleApiService } from "../utils/gapi.service";
import { Observable } from "rxjs";

@Injectable()
export class GoogleSheetsApiService extends GoogleApiService {

    private RANGE_URL = (spreadsheetId, range) =>
        `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(range)}`;
    private APPEND_URL = (spreadsheetId, range) => `${this.RANGE_URL(spreadsheetId, range)}:append`;

    constructor(private http: HttpClient) {
        super(http);
    }

    private sheetRange = (sheetName: string, range: string) => `'${sheetName}'!${range}`;

    public appendRows(spreadsheetId: string, sheetName: string, range: string, values: any[][]) {
        const sheetRange = this.sheetRange(sheetName, range);
        return this.request('post', this.APPEND_URL(spreadsheetId, sheetRange), {
            params: {
                valueInputOption: 'USER_ENTERED',
            },
            body: {
                range: sheetRange,
                values: values,
            } as gapi.client.sheets.ValueRange
        });
    }

    public updateRows(spreadsheetId: string, sheetName: string, range: string, values: any[]) {
        const sheetRange = this.sheetRange(sheetName, range);
        return this.request('put', this.RANGE_URL(spreadsheetId, sheetRange), {
            params: {
                valueInputOption: 'USER_ENTERED',
            },
            body: {
                range: sheetRange,
                values: values,
            } as gapi.client.sheets.ValueRange
        });
    }

    public getRows(spreadsheetId: string, sheetName: string, range: string): Observable<gapi.client.sheets.ValueRange> {
        const sheetRange = this.sheetRange(sheetName, range);
        return this.request('get', this.RANGE_URL(spreadsheetId, sheetRange), {
            params: {
                valueRenderOption: 'UNFORMATTED_VALUE',
            },
        });
    }

}
