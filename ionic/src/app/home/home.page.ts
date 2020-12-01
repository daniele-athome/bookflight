import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { IonRouterOutlet, ModalController, Platform } from "@ionic/angular";
import { Plugins } from "@capacitor/core";
const { App } = Plugins;

import { CalendarOptions, FullCalendarComponent, EventMountArg, EventClickArg } from '@fullcalendar/angular';
import itLocale from '@fullcalendar/core/locales/it';

import { environment } from '../../environments/environment';
import { BookformComponent } from "./bookform/bookform.component";
import { EventApi } from "@fullcalendar/common";
import { CalendarService } from "../services/calendar.service";
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
        headerToolbar: false,

        loading: isLoading => this.setLoading(isLoading),
        eventDidMount: arg => this.renderEvent(arg),
        eventClick: arg => this.onEventClick(arg),

        googleCalendarApiKey: environment.googleCalendarApiKey,
        events: environment.events,
    };

    @ViewChild('calendar')
    calendarComponent: FullCalendarComponent;

    constructor(
        private platform: Platform,
        private routerOutlet: IonRouterOutlet,
        private modalController: ModalController,
        private calendarService: CalendarService
    ) {
        this.platform.backButton.subscribeWithPriority(-1, () => {
            if (!this.routerOutlet.canGoBack()) {
                App.exitApp();
            }
        });

        const defaultDate = new Date();
        if (defaultDate.getDay() === 0 && defaultDate.getHours() >= 22) {
            // week is ending, move to next one
            defaultDate.setDate(defaultDate.getDate() + 1);
        }
        this.calendarOptions.initialDate = defaultDate;
    }

    async ngOnInit() {
        await this.calendarService.init();
    }

    ngAfterViewInit() {
    }

    isToday() {
        const calendar = this.calendarComponent?.getApi();
        if (calendar) {
            const today = new Date();
            return today >= calendar.view.currentStart && today < calendar.view.currentEnd;
        }
        return false;
    }

    setCalendarMode($event: any) {
        this.calendarComponent.getApi().changeView($event.detail.value);
    }

    private setLoading(isLoading: boolean) {
        this.calendarOptions.noEventsText = isLoading ?
            'Caricamento...' : 'Non ci sono eventi da visualizzare';
    }

    next() {
        this.calendarComponent.getApi().next();
    }

    previous() {
        this.calendarComponent.getApi().prev();
    }

    today() {
        this.calendarComponent.getApi().today();
    }

    async book() {
        const modal = await this.modalController.create({
            component: BookformComponent
        });
        return await modal.present();
    }

    async edit(event: EventApi) {
        const modal = await this.modalController.create({
            component: BookformComponent,
            componentProps: {
                event: event
            }
        });
        return await modal.present();
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

    async onEventClick(arg: EventClickArg) {
        arg.jsEvent.preventDefault();
        return await this.edit(arg.event);
    }

}
