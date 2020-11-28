// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    googleCalendarApiKey: null,
    events: [
        {
            title: 'Paolo',
            start: '2020-11-25T16:00:00',
            end: '2020-11-25T18:00:00',
            extendedProps: {
                description: 'Esami',
            }
        },
        {
            title: 'Daniele',
            start: '2020-11-26T16:00:00',
            end: '2020-11-26T18:00:00',
            extendedProps: {
                description: 'Istruzionale',
            }
        },
        {
            title: 'Manuel',
            start: '2020-11-27T18:00:00',
            end: '2020-11-27T23:00:00',
            extendedProps: {
                description: 'Volo notturno con testo lungo descrizione lunghissima non sapevo cosa scrivere',
            }
        },
        {
            title: 'Claudia',
            start: '2020-11-20T09:00:00',
            end: '2020-11-20T10:00:00',
        },
    ],
    pilots: [
        'Claudia',
        'Daniele',
        'Davide',
        'Manuel',
        'Paolo',
        'Simone',
        'Victoriano',
    ],
    location: {
        // Fly Roma coordinates and height (190 ft)
        latitude: 41.88,
        longitude: 12.71,
        height: 58
    },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
