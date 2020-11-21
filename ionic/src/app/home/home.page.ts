import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import itLocale from '@fullcalendar/core/locales/it';

import { environment } from '../../environments/environment';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {

    calendarOptions: CalendarOptions = {
        initialView: 'listWeek',
        locales: [itLocale],
        locale: 'it',
        height: 'auto',
        displayEventTime: true,
        nowIndicator: true,
        allDaySlot: false,
        slotMinTime: '05:00:00',
        slotMaxTime: '22:00:00',
        noEventsText: 'Caricamento...',
        loading: isLoading => this.setLoading(isLoading),

        headerToolbar: {
            left: 'prev,next today bookflight',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        },
        buttonText: {
            listWeek: 'Agenda'
        },
        customButtons: {
            bookflight: {
                text: 'Prenota',
                click: () => this.book()
            }
        },

        googleCalendarApiKey: environment.googleCalendarApiKey,
        events: environment.events,
    };
    /*
        customButtons: {
            bookflight: {
                text: 'Prenota',
                click: function () {
                    var tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    document.getElementById('book-flight-date-start').valueAsDate = tomorrow;
                    document.getElementById('book-flight-date-end').valueAsDate = tomorrow;
                    var suntimes = getSuntimes(tomorrow);
                    console.log(suntimes);
                    $('#book-flight-start-sunrise').text(suntimes.sunrise.toLocaleTimeString("it-IT"));
                    $('#book-flight-start-sunset').text(suntimes.sunset.toLocaleTimeString("it-IT"));
                    $('#book-flight-end-sunrise').text(suntimes.sunrise.toLocaleTimeString("it-IT"));
                    $('#book-flight-end-sunset').text(suntimes.sunset.toLocaleTimeString("it-IT"));
                    $('#bookFlight').modal('show');
                }
            }
        },
     */

    @ViewChild('calendar')
    calendarComponent: FullCalendarComponent;

    constructor() {
        const defaultDate = new Date();
        if (defaultDate.getDay() === 0 && defaultDate.getHours() >= 22) {
            // week is ending, move to next one
            defaultDate.setDate(defaultDate.getDate() + 1);
        }
        this.calendarOptions.initialDate = defaultDate;
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
    }

    private setLoading(isLoading: boolean) {
        this.calendarOptions.noEventsText = isLoading ?
            'Caricamento...' : 'Non ci sono eventi da visualizzare';
    }

    private book() {
        // TODO
        alert('Ciao!');
    }

}
