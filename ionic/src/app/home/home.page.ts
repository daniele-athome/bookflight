import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import { CalendarOptions, FullCalendarComponent, EventMountArg } from '@fullcalendar/angular';
import itLocale from '@fullcalendar/core/locales/it';

import { environment } from '../../environments/environment';
declare var $: any;

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

        eventDidMount: arg => this.renderEvent(arg),

        googleCalendarApiKey: environment.googleCalendarApiKey,
        events: environment.events,
    };

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

    private renderEvent(arg: EventMountArg) {
        if (arg.event.extendedProps.description) {
            if (arg.view.type == 'listWeek') {
                $(arg.el).find('.fc-list-event-title').append('&nbsp;')
                    .append($('<small class="text-muted fc-list-event-description"></small>').text(arg.event.extendedProps.description));
            }
            else {
                $(arg.el).find('.fc-event-title')
                    .after($('<div class="fc-event-description"></div>').text(arg.event.extendedProps.description));
            }
        }
    }

}
