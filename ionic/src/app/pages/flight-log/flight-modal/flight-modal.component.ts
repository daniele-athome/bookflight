import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController } from "@ionic/angular";
import { environment } from '../../../../environments/environment';
import { ConfigService } from "../../../services/config.service";
import { FlightLogItem } from "../../../models/flightlog.model";

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
                private configService: ConfigService) {
    }

    async ngOnInit() {
        if (this.flightModel.id) {
            this.title = 'Modifica';
        }
        else {
            this.title = 'Registra';

            // use last used pilot name
            this.flightModel.pilot = await this.configService.getLastPilotName();
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
        // TODO delete
        await loading.dismiss();
        await this.dismiss('deleted');
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
            // TODO update
            await loading.dismiss();
            await this.dismiss('updated');
        }
        else {
            // TODO create
            await this.configService.setLastPilotName(this.flightModel.pilot);
            await loading.dismiss();
            await this.dismiss('created');
        }
    }

    private validate(): boolean {
        if (!this.flightModel.pilot) {
            this.errorAlert("Scegli il pilota.", "Errore");
            return false;
        }

        // TODO other validations

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
