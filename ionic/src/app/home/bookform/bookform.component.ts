import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController } from "@ionic/angular";
import { environment } from '../../../environments/environment';
import { EventApi } from '@fullcalendar/angular';
import { CalendarService } from "../../services/calendar.service";
import { CalEvent } from '../../models/calevent.model';
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

    constructor(private modalController: ModalController,
                private alertController: AlertController,
                private loadingController: LoadingController,
                private calendarService: CalendarService) {
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

    setStartDate(date: string) {
        const parsedDate = new Date(date);
        // @ts-ignore
        this.eventModel.startDate = !isNaN(parsedDate) ? parsedDate : null;
        this.updateSunTimes();
    }

    setEndDate(date: string) {
        const parsedDate = new Date(date);
        // @ts-ignore
        this.eventModel.endDate = !isNaN(parsedDate) ? parsedDate : null;
        this.updateSunTimes();
    }

    private updateSunTimes() {
        this.startDateSuntimes = this.eventModel.startDate ? this.getSunTimes(this.eventModel.startDate) : null;
        this.endDateSuntimes = this.eventModel.endDate ? this.getSunTimes(this.eventModel.endDate) : null;
    }

    private getSunTimes(date) {
        return SunCalc.getTimes(date,
            environment.location.latitude,
            environment.location.longitude,
            environment.location.height);
    }

    dismiss(role?: string) {
        return this.modalController.dismiss({
            'dismissed': true
        }, role);
    }

    async delete() {
        const alert = await this.alertController.create({
            header: 'Cancellare?',
            message: 'Non cancellare prenotazioni altrui senza il consenso del pilota.',
            buttons: [
                {
                    text: 'Annulla',
                    role: 'cancel',
                    cssClass: 'secondary'
                },
                {
                    text: 'OK',
                    role: 'destructive',
                    cssClass: 'danger',
                    handler: async () => {
                        await this.doDelete();
                    }
                }
            ]
        });
        await alert.present();
    }

    async doDelete() {
        const loading = await this.startLoading("Un attimo...");
        this.calendarService.deleteEvent(this.event.id)
            .then(() => {
                this.dismiss('ok');
            })
            .catch((error) => {
                // TODO
                console.log(error);
            })
            .finally(() => {
                loading.dismiss();
            });
    }

    async save() {
        const loading = await this.startLoading("Un attimo...");

        if (this.event) {
            this.calendarService.updateEvent(this.event.id, this.eventModel)
                .then(() => {
                    // TODO what here?
                    this.dismiss('ok');
                })
                .catch((error) => {
                    // TODO
                    console.log(error);
                    alert('ERRORE!');
                })
                .finally(() => {
                    loading.dismiss();
                });
        }
        else {
            this.calendarService.createEvent(this.eventModel)
                .then(() => {
                    // TODO what here?
                    this.dismiss('ok');
                })
                .catch((error) => {
                    // TODO
                    console.log(error);
                    alert('ERRORE!');
                })
                .finally(() => {
                    loading.dismiss();
                });
        }
    }

    async startLoading(message: string): Promise<HTMLIonLoadingElement> {
        const loading = await this.loadingController.create({
            showBackdrop: true,
            backdropDismiss: false,
            message: message
        });
        // noinspection ES6MissingAwait
        loading.present();
        return loading;
    }

    getPilotList() {
        return environment.pilots;
    }

}
