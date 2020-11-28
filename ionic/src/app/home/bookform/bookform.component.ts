import { Component, OnInit } from '@angular/core';
import { ModalController } from "@ionic/angular";
import { environment } from '../../../environments/environment';
import { EventApi } from '@fullcalendar/angular';
import { CalEvent } from './calevent.model';
import * as SunCalc from 'suncalc';

@Component({
    selector: 'app-bookform',
    templateUrl: './bookform.component.html',
    styleUrls: ['./bookform.component.scss'],
})
export class BookformComponent implements OnInit {

    selectOptions = {
        header: false,
        buttons: false,
    };

    title: string;

    event: EventApi;
    eventModel: CalEvent = {};
    startDateSuntimes: any;
    endDateSuntimes: any;

    constructor(private modalController: ModalController) {
    }

    ngOnInit() {
        if (this.event) {
            this.title = 'Modifica';

            const timeOptions = {
                hour: "2-digit", minute: "2-digit", hour12: false, timeZone: this.event.start["timeZone"]
            };

            this.eventModel = {
                title: this.event.title,
                startDate: this.event.start,
                startTime: this.event.start.toLocaleTimeString('it-it', timeOptions),
                endDate: this.event.end,
                endTime: this.event.end.toLocaleTimeString('it-it', timeOptions),
                description: this.event.extendedProps.description,
            };
        }
        else {
            this.title = 'Prenota';

            // TODO use last used pilot name

            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);

            this.eventModel = {
                startDate: tomorrow,
                endDate: tomorrow,
            };
        }

        this.updateSunTimes();
    }

    updateSunTimes() {
        this.startDateSuntimes = this.eventModel.startDate ? this.getSunTimes(this.eventModel.startDate) : null;
        this.endDateSuntimes = this.eventModel.endDate ? this.getSunTimes(this.eventModel.endDate) : null;
    }

    private getSunTimes(date) {
        return SunCalc.getTimes(date,
            environment.location.latitude,
            environment.location.longitude,
            environment.location.height);
    }

    dismiss() {
        // noinspection JSIgnoredPromiseFromCall
        this.modalController.dismiss({
            'dismissed': true
        });
    }

    delete() {
        // TODO
        alert('DELETE!');
    }

    save() {
        // TODO
        alert('SAVE!');
    }

    getPilotList() {
        return environment.pilots;
    }

}
