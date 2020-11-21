import { environment } from '../../environments/environment';
import { Component } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular';
import itLocale from '@fullcalendar/core/locales/it';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {

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

    constructor() {
        const defaultDate = new Date();
        if (defaultDate.getDay() === 0 && defaultDate.getHours() >= 22) {
            // week is ending, move to next one
            defaultDate.setDate(defaultDate.getDate() + 1);
        }
        this.calendarOptions.initialDate = defaultDate;
        this.calendarOptions.customButtons.bookflight.click = () => this.book()
    }

    private book() {
        // TODO
        alert('Ciao!');
    }

}
