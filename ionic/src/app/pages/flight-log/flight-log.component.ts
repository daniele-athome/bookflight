import { Component, OnInit, ViewChild } from "@angular/core";
import { IonRouterOutlet, IonVirtualScroll, ModalController, Platform, ToastController } from "@ionic/angular";
import { FlightLogService } from "../../services/flightlog.service";
import { FlightLogItem } from "../../models/flightlog.model";
import { mergeMap } from "rxjs/operators";
import { of } from "rxjs";
import { FlightModalComponent } from "./flight-modal/flight-modal.component";

@Component({
    selector: 'app-flight-log',
    templateUrl: 'flight-log.component.html',
    styleUrls: ['flight-log.component.scss'],
})
export class FlightLogComponent implements OnInit {

    @ViewChild('virtualScroll')
    virtualScroll: IonVirtualScroll;

    logItems: FlightLogItem[] = [];

    constructor(
        private platform: Platform,
        private routerOutlet: IonRouterOutlet,
        private modalController: ModalController,
        private toastController: ToastController,
        private flightLogService: FlightLogService
    ) {
    }

    ngOnInit() {
        this.flightLogService.init().subscribe(() => {
            // TODO do something here?
            console.log('flight log service init ok');
            this.fetchData().subscribe(() => {
                console.log('data loaded');
            });
        });
    }

    async record() {
        const modal = await this.modalController.create({
            component: FlightModalComponent
        });
        modal.onDidDismiss().then((data) => this.onEditorDismiss(data));
        return await modal.present();
    }

    async edit(item: FlightLogItem) {
        const modal = await this.modalController.create({
            component: FlightModalComponent,
            componentProps: {
                logItemId: 'TODO',
                flightModel: item,
            }
        });
        modal.onDidDismiss().then((data) => this.onEditorDismiss(data));
        return await modal.present();
    }

    private async onEditorDismiss(data) {
        console.log(data);
        if (data.role) {
            let toastMessage;
            switch (data.role) {
                case 'deleted':
                    toastMessage = 'Volo cancellato';
                    break;
                case 'updated':
                    toastMessage = 'Volo modificato';
                    break;
                case 'created':
                    toastMessage = 'Volo registrato';
                    break;
            }
            if (toastMessage) {
                const toast = await this.toastController.create({
                    message: toastMessage,
                    duration: 2000,
                    cssClass: 'tabs-bottom',
                });
                toast.present();
            }
            // TODO reload data?
        }
    }

    public fetchData() {
        return this.flightLogService.fetchItems()
            .pipe(
                mergeMap((items => {
                    this.logItems.push(...items.reverse());
                    this.virtualScroll.checkEnd();
                    return of(items);
                }))
            );
    }

    public loadData(event) {
        // TODO
        this.fetchData().subscribe(() => {
            event.target.complete();
            if (!this.flightLogService.hasMoreData()) {
                event.target.disabled = true;
            }
        });
    }

}
