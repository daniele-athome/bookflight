import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { ConfigService } from "../../services/config.service";
import { FlightLogRoutingModule } from "./flight-log-routing.module";
import { FlightLogComponent } from "./flight-log.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        FlightLogRoutingModule,
    ],
    providers: [
        ConfigService,
    ],
    declarations: [
        FlightLogComponent,
    ]
})
export class FlightLogModule {
}
