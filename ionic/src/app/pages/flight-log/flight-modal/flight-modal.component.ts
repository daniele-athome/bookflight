import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController } from "@ionic/angular";
import { environment } from '../../../../environments/environment';
import { ConfigService } from "../../../services/config.service";
import { FlightLogItem } from "../../../models/flightlog.model";
import * as datetime from "../../../utils/datetime";
import { FlightLogService } from "../../../services/flightlog.service";

@Component({
    selector: 'app-flight-modal',
    templateUrl: './flight-modal.component.html',
    styleUrls: ['./flight-modal.component.scss'],
})
export class FlightModalComponent implements OnInit {

    selectOptions = {
        header: false,
        buttons: false,
    };

    title: string;

    flightModel: FlightLogItem = {};

    constructor(private modalController: ModalController,
                private alertController: AlertController,
                private loadingController: LoadingController,
                private configService: ConfigService,
                private flightLogService: FlightLogService) {
    }

    async ngOnInit() {
        if (this.flightModel.id) {
            this.title = 'Modifica';
        }
        else {
            this.title = 'Registra';

            // some data might have been passed in input so don't recreare the model
            this.flightModel.date = new Date();
            // use last used pilot name
            this.flightModel.pilot = await this.configService.getLastPilotName();
            this.flightModel.origin = environment.location.name;
            this.flightModel.destination = environment.location.name;
        }
    }

    dismiss(role?: string) {
        return this.modalController.dismiss({
            'dismissed': true
        }, role);
    }

    async delete() {
        const alert = await this.alertController.create({
            header: 'Cancellare?',
            message: 'Stai cancellando un volo registrato. Non potrai recuperarlo!',
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
        this.flightLogService.deleteItem(this.flightModel)
            .subscribe(
                async () => {
                    loading.dismiss();
                    await this.dismiss('deleted');
                },
                async error => {
                    console.log(error);
                    await loading.dismiss();
                    await this.errorAlert("Impossibile cancellare il volo.", "Errore!");
                }
            );
    }

    async save() {
        if (!this.validate()) {
            return false;
        }

        const loading = await this.startLoading("Un attimo...");
        return this.doSave(loading);
    }

    private async doSave(loading: HTMLIonLoadingElement) {
        if (this.flightModel.id) {
            this.flightLogService.updateItem(this.flightModel).subscribe(
                async () => {
                    loading.dismiss();
                    await this.dismiss('updated');
                },
                async error => {
                    console.log(error);
                    await loading.dismiss();
                    await this.errorAlert("Impossibile modificare il volo.", "Errore!");
                }
            );
        }
        else {
            this.flightLogService.appendItem(this.flightModel).subscribe(
                async () => {
                    await this.configService.setLastPilotName(this.flightModel.pilot);
                    loading.dismiss();
                    await this.dismiss('created');
                },
                async error => {
                    console.log(error);
                    await loading.dismiss();
                    await this.errorAlert("Impossibile registrare il volo.", "Errore!");
                }
            );
        }
    }

    private validate(): boolean {
        if (!this.flightModel.date) {
            this.errorAlert("Inserisci la data del volo.", "Errore");
            return false;
        }

        if (!this.flightModel.pilot) {
            this.errorAlert("Scegli il pilota.", "Errore");
            return false;
        }

        if (!this.flightModel.startHour || !this.flightModel.endHour) {
            this.errorAlert("Inserisci orametro di inizio e di fine.", "Errore");
            return false;
        }

        if (this.flightModel.startHour > this.flightModel.endHour) {
            this.errorAlert("Orametro di inizio maggiore di quello di fine!", "Errore");
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

    setFlightDate(date: string) {
        const parsedDate = datetime.parseISODate(date);
        this.flightModel.date = parsedDate.isValid() ? parsedDate.toDate() : null;
    }

    getPilotList() {
        return environment.pilots;
    }

}
