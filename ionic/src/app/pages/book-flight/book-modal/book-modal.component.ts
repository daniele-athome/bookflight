import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController } from "@ionic/angular";
import { environment } from '../../../../environments/environment';
import { EventApi } from '@fullcalendar/angular';
import { CalendarService } from "../../../services/calendar.service";
import { CalEvent } from '../../../models/calevent.model';
import * as SunCalc from 'suncalc';
import * as datetime from "../../../utils/datetime";
import { ConfigService } from "../../../services/config.service";

@Component({
    selector: 'app-book-modal',
    templateUrl: './book-modal.component.html',
    styleUrls: ['./book-modal.component.scss'],
})
export class BookModalComponent implements OnInit {

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
                private configService: ConfigService,
                private calendarService: CalendarService) {
    }

    async ngOnInit() {
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

            // use last used pilot name
            const pilotName = await this.configService.getLastPilotName();

            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);

            this.eventModel = {
                title: pilotName,
                startDate: tomorrow,
                endDate: tomorrow,
            };
        }

        this.updateSunTimes();
    }

    setStartDate(date: string) {
        const parsedDate = datetime.parseISODate(date);
        this.eventModel.startDate = parsedDate.isValid() ? parsedDate.toDate() : null;
        this.setEndDate(date);
        // sun times will be updated by setEndDate
    }

    setEndDate(date: string) {
        const parsedDate = datetime.parseISODate(date);
        this.eventModel.endDate = parsedDate.isValid() ? parsedDate.toDate() : null;
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
            .subscribe(
                async value => {
                    loading.dismiss();
                    await this.dismiss('deleted');
                },
                async error => {
                    console.log(error);
                    await loading.dismiss();
                    await this.errorAlert("Impossibile cancellare la prenotazione.", "Errore!");
                }
            );
    }

    async save() {
        if (!this.validate()) {
            return false;
        }

        const loading = await this.startLoading("Un attimo...");

        this.calendarService.eventConflicts(this.event ? this.event.id : null, this.eventModel)
            .subscribe(
                (conflicts: boolean) => {
                    if (conflicts) {
                        loading.dismiss();
                        this.errorAlert("Un'altra prenotazione è già presente per l'orario indicato!", "Errore!");
                    }
                    else {
                        this.doSave(loading);
                    }
                },
                error => {
                    console.log(error);
                    loading.dismiss();
                    this.errorAlert("Impossibile verificare la prenotazione.", "Errore!");
                });
    }

    private doSave(loading: HTMLIonLoadingElement) {
        if (this.event) {
            this.calendarService.updateEvent(this.event.id, this.eventModel)
                .subscribe(
                    async value => {
                        loading.dismiss();
                        await this.dismiss('updated');
                    },
                    async error => {
                        console.log(error);
                        await loading.dismiss();
                        await this.errorAlert("Impossibile modificare la prenotazione.", "Errore!");
                    }
                );
        }
        else {
            this.calendarService.createEvent(this.eventModel)
                .subscribe(
                    async value => {
                        await this.configService.setLastPilotName(this.eventModel.title);
                        loading.dismiss();
                        await this.dismiss('created');
                    },
                    async error => {
                        console.log(error);
                        await loading.dismiss();
                        await this.errorAlert("Impossibile creare la prenotazione.", "Errore!");
                    }
                );
        }
    }

    private validate(): boolean {
        if (!this.eventModel.title) {
            this.errorAlert("Scegli il pilota.", "Errore");
            return false;
        }

        if (!this.eventModel.startDate || !this.eventModel.startTime ||
            !this.eventModel.endDate || !this.eventModel.endTime) {
            this.errorAlert("Inserisci data/ora inizio e fine.", "Errore");
            return false;
        }

        const startDate = datetime.joinDateTime(this.eventModel.startDate, this.eventModel.startTime);
        const endDate = datetime.joinDateTime(this.eventModel.endDate, this.eventModel.endTime);
        if (endDate.isBefore(startDate, "minute") || endDate.isSame(startDate, "minute")) {
            this.errorAlert("Data/ora inizio successive a data/ora fine!", "Errore");
            return false;
        }

        return true;
    }

    async startLoading(message: string): Promise<HTMLIonLoadingElement> {
        const loading = await this.loadingController.create({
            showBackdrop: true,
            backdropDismiss: false,
            message: message
        });
        await loading.present();
        return new Promise<HTMLIonLoadingElement>((resolve) => {
            resolve(loading);
        });
    }

    async errorAlert(message: string, title?: string) {
        const alert = await this.alertController.create({
            header: title,
            message: message,
            buttons: ['OK']
        });
        await alert.present();
    }

    getPilotList() {
        return environment.pilots;
    }

}
