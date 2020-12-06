import { Component, OnInit, ViewChild } from "@angular/core";
import { IonRouterOutlet, IonVirtualScroll, ModalController, Platform, ToastController } from "@ionic/angular";
import { FlightLogService } from "../../services/flightlog.service";
import { environment } from "../../../environments/environment";
import { FlightLogItem } from "../../models/flightlog.model";
import { mergeMap } from "rxjs/operators";
import { of } from "rxjs";

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
