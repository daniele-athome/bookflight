import { Component, OnInit, ViewChild } from "@angular/core";
import {
    Config,
    IonInfiniteScroll,
    IonRefresher,
    IonVirtualScroll,
    ModalController,
    ToastController
} from "@ionic/angular";
import { FlightLogService } from "../../services/flightlog.service";
import { FlightLogItem } from "../../models/flightlog.model";
import { FlightModalComponent } from "./flight-modal/flight-modal.component";

@Component({
    selector: 'app-flight-log',
    templateUrl: 'flight-log.component.html',
    styleUrls: ['flight-log.component.scss'],
})
export class FlightLogComponent implements OnInit {

    @ViewChild('virtualScroll')
    virtualScroll: IonVirtualScroll;

    @ViewChild('infiniteScroll')
    infiniteScroll: IonInfiniteScroll;

    @ViewChild('refresher')
    refresher: IonRefresher;

    firstLoad = true;
    firstError = false;
    scrollError = false;
    refreshing = false;
    logItems: FlightLogItem[] = [];
    selectedItem?: FlightLogItem;

    constructor(
        private config: Config,
        private modalController: ModalController,
        private toastController: ToastController,
        private flightLogService: FlightLogService
    ) {
    }

    ngOnInit() {
        this.flightLogService.init().subscribe(
            () => {
                // TODO do something here?
                console.log('flight log service init ok');
                this.loadMoreData();
            },
            error => {
                console.log('error: ' + error);
                this.firstLoad = false;
                this.firstError = true;
            }
        );
    }

    async record() {
        const data: FlightLogItem = {};
        if (this.logItems && this.logItems.length > 0) {
            data.startHour = this.logItems[0].endHour;
        }
        const modal = await this.modalController.create({
            component: FlightModalComponent,
            componentProps: {
                flightModel: data,
            }
        });
        modal.onDidDismiss().then((data) => this.onEditorDismiss(data));
        return await modal.present();
    }

    async edit(item: FlightLogItem) {
        this.selectedItem = item;
        const modal = await this.modalController.create({
            component: FlightModalComponent,
            componentProps: {
                flightModel: item,
            }
        });
        modal.onDidDismiss().then((data) => this.onEditorDismiss(data));
        return await modal.present();
    }

    private async onEditorDismiss(data) {
        console.log(data);
        this.selectedItem = null;
        if (data.role && data.role != 'backdrop') {
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
            // reload from scratch
            this.reload();
        }
    }

    // TODO handle race condition between data loading from infinite scroll and refresher

    reload() {
        this.firstLoad = true;
        this.firstError = false;
        this.scrollError = false;
        this.infiniteScroll.disabled = false;
        this.logItems = [];
        this.virtualScroll.checkRange(0);
        this.flightLogService.reset().subscribe(
            () => {
                this.loadMoreData();
            },
            error => {
                console.log('error: ' + error);
                this.firstLoad = false;
                this.firstError = true;
            }
        );
    }

    refresh() {
        this.toastController.dismiss({id: 'refresh-error'}).catch(() => {});
        this.scrollError = false;
        this.infiniteScroll.disabled = false;
        this.refreshing = true;
        this.flightLogService.reset().subscribe(
            () => {
                this.loadMoreData();
            },
            async error => {
                console.log('error: ' + error);
                await this.refreshError();
            });
    }

    private fetchData() {
        return this.flightLogService.fetchItems();
    }

    loadMoreData() {
        this.scrollError = false;
        return this.fetchData().subscribe(
            (items) => {
                if (this.refreshing) {
                    this.refreshing = false;
                    this.logItems = items.reverse();
                    this.virtualScroll.checkRange(0);
                }
                else {
                    this.logItems.push(...items.reverse());
                    this.virtualScroll.checkEnd();
                }

                this.firstLoad = false;
                this.refresher.complete();
                this.infiniteScroll.complete();
                this.infiniteScroll.disabled = !this.flightLogService.hasMoreData();
            },
            async error => {
                console.log('error: ' + error);
                if (this.firstLoad) {
                    this.firstLoad = false;
                    this.firstError = true;
                }
                else if (this.refreshing) {
                    await this.refreshError();
                }
                else {
                    console.log('scroll error');
                    this.scrollError = true;
                    await this.infiniteScroll.complete();
                    // we need it to be enabled to display the error text -- this.infiniteScroll.disabled = true;
                }
            });
    }

    private async refreshError() {
        console.log('refresh error');
        this.refreshing = false;
        await this.refresher.complete();
        const toast = await this.toastController.create({
            id: 'refresh-error',
            message: 'Errore nel caricamento dati.',
            color: 'danger',
            cssClass: 'tabs-bottom',
            buttons: [
                {
                    text: 'OK',
                    role: 'cancel'
                },
            ],
        });
        toast.present();
    }

    /** There is no default spinner in ion-infinite-scroll-content :-( */
    getLoadingSpinner() {
        return this.config.get('mode') == 'ios' ? 'lines' : 'circular';
    }

}
