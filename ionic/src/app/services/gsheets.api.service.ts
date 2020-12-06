import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { GoogleApiService } from "../utils/gapi.service";

@Injectable()
export class GoogleSheetsApiService extends GoogleApiService {

    private BATCH_UPDATE_URL = (spreadsheetId) => `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`

    constructor(private http: HttpClient) {
        super(http);
    }

    public appendRow(spreadsheetId: string, sheetId: number, rowData: gapi.client.sheets.RowData) {
        const request = {
            sheetId: sheetId,
            rows: [rowData],
            fields: 'userEnteredValue',
        } as gapi.client.sheets.AppendCellsRequest;
        return this.request('post', this.BATCH_UPDATE_URL(spreadsheetId), {
            body: {
                requests: [{
                    appendCells: request
                }]
            } as gapi.client.sheets.BatchUpdateSpreadsheetRequest
        });
    }

}
