import { Component, OnInit } from '@angular/core';
import { ModalController } from "@ionic/angular";
import { environment } from '../../../environments/environment';
import { EventApi } from '@fullcalendar/angular';
import { CalEvent } from './calevent.model';

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
        }
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
