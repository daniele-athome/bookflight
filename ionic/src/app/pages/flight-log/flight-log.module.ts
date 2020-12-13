import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { ConfigService } from "../../services/config.service";
import { FlightLogRoutingModule } from "./flight-log-routing.module";
import { FlightLogComponent } from "./flight-log.component";
import { FlightModalComponent } from "./flight-modal/flight-modal.component";
import { FlightLogService } from "../../services/flightlog.service";
import { GoogleSheetsApiService } from "../../services/gsheets.api.service";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        FlightLogRoutingModule,
    ],
    providers: [
        ConfigService,
        FlightLogService,
        GoogleSheetsApiService,
    ],
    declarations: [
        FlightLogComponent,
        FlightModalComponent,
    ]
})
export class FlightLogModule {
}
