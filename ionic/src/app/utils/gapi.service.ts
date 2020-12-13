import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { CustomHttpParamEncoder } from "./customhttpencoder";

export abstract class GoogleApiService {

    private apiKey: string;
    private accessToken: string;

    protected constructor(private _http: HttpClient) {
    }

    public setApiKey(apiKey: string) {
        this.apiKey = apiKey;
    }

    public setAuthToken(accessToken: string) {
        this.accessToken = accessToken;
    }

    protected request(method: string, url: string, options?: {
        headers?: {
            [header: string]: string | string[];
        },
        params?: {
            [param: string]: string;
        },
        body?: any
    }) {
        const myOptions = {
            headers: null,
            params: null,
            body: options?.body,
        };

        // copy params
        let myParams = new HttpParams({encoder: new CustomHttpParamEncoder()});
        if (options && options.params) {
            for (let param in options.params) {
                myParams = myParams.set(param, options.params[param]);
            }
        }
        myOptions.params = myParams;

        // copy headers
        let myHeaders = new HttpHeaders({
            'Authorization': 'Bearer ' + this.accessToken,
        });
        if (options && options.headers) {
            for (let header in options.headers) {
                myHeaders = myHeaders.set(header, options.headers[header]);
            }
        }
        myOptions.headers = myHeaders;

        return this._http.request(method, url, myOptions);
    }

}
