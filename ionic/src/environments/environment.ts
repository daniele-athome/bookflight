// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    googleCalendarApiKey: null,
    events: [
        {
            title: 'Paolo',
            start: '2020-11-18T16:00:00',
            end: '2020-11-18T18:00:00',
            extendedProps: {
                description: 'Esami',
            }
        },
        {
            title: 'Daniele',
            start: '2020-11-19T16:00:00',
            end: '2020-11-19T18:00:00',
            extendedProps: {
                description: 'Istruzionale',
            }
        },
        {
            title: 'Manuel',
            start: '2020-11-20T18:00:00',
            end: '2020-11-20T23:00:00',
            extendedProps: {
                description: 'Volo notturno con testo lungo descrizione lunghissima non sapevo cosa scrivere',
            }
        },
        {
            title: 'Claudia',
            start: '2020-11-15T09:00:00',
            end: '2020-11-15T10:00:00',
        },
    ],
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
