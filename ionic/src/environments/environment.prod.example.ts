export const environment = {
    production: true,
    googleApiKey: 'PUT-YOUR-GOOGLE-API-KEY-HERE',
    googleApiServiceAccount: 'PUT-YOUR-SERVICE-ACCOUNT-JSON-ASSET-PATH-HERE',
    events: 'PUT-YOUR-GOOGLE-CALENDAR-ID-HERE',
    flightlog: {
        spreadsheetId: 'PUT-YOUR-GOOGLE-SPREADSHEET-ID-HERE',
        sheetName: 'PUT-YOUR-GOOGLE-SHEET-NAME-HERE',
    },
    pilots: [
        'Anna',
        'Daniele',
        'Claudio',
        'Marta',
    ],
    location: {
        name: 'Fly Roma',
        // Fly Roma coordinates and height (190 ft)
        latitude: 41.88,
        longitude: 12.71,
        height: 58
    },
};
