import { Component, OnInit } from "@angular/core";
import { IonRouterOutlet, ModalController, Platform, ToastController } from "@ionic/angular";
import { CalendarService } from "../../services/calendar.service";
import { FlightLogService } from "../../services/flightlog.service";

@Component({
    templateUrl: 'flight-log.component.html'
})
export class FlightLogComponent implements OnInit {

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
        });
    }

}
