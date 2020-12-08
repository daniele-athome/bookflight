import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { GoogleApiService } from "../utils/gapi.service";
import { Observable } from "rxjs";
import { mergeMap } from "rxjs/operators";

@Injectable()
export class GoogleSheetsApiService extends GoogleApiService {

    private RANGE_URL = (spreadsheetId, range) =>
        `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(range)}`;
    private APPEND_URL = (spreadsheetId, range) => `${this.RANGE_URL(spreadsheetId, range)}:append`;
    private DELETE_URL = (spreadsheetId) =>
        `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}:batchUpdate`;
    private SHEET_INFO_URL = (spreadsheetId) =>
        `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}?fields=sheets.properties`;

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

    public deleteRows(spreadsheetId: string, sheetName: string, startRow: number, endRow: number) {
        // we need the sheet id to delete
        return this.request('get', this.SHEET_INFO_URL(spreadsheetId))
            .pipe(
                mergeMap((spreadsheet: gapi.client.sheets.Spreadsheet) => {
                    console.log(spreadsheet);
                    const sheetInfo = spreadsheet.sheets.find(sheet => sheet.properties.title == sheetName);
                    if (!sheetInfo) {
                        throw new Error(`sheet ${sheetName} not found`);
                    }

                    console.log('sheet id is ' + sheetInfo.properties.sheetId);
                    console.log(`deleting rows from ${startRow} to ${endRow}`);
                    return this.request('post', this.DELETE_URL(spreadsheetId), {
                        body: {
                            requests: [
                                {
                                    deleteDimension: {
                                        range: {
                                            sheetId: sheetInfo.properties.sheetId,
                                            dimension: 'ROWS',
                                            startIndex: startRow - 1,
                                            endIndex: endRow,
                                        },
                                    }
                                }
                            ],
                        } as gapi.client.sheets.BatchUpdateSpreadsheetRequest
                    });
                })
            );
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
