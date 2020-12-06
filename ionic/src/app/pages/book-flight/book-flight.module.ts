import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { BookFlightComponent } from './book-flight.component';
import { BookFlightRoutingModule } from './book-flight-routing.module';
import { FullCalendarModule } from "@fullcalendar/angular";
import { BookformComponent } from "./bookform/bookform.component";
import { ConfigService } from "../../services/config.service";
import { CalendarService } from "../../services/calendar.service";
import { GoogleCalendarApiService } from "../../services/gcalendar.api.service";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        BookFlightRoutingModule,
        FullCalendarModule,
    ],
    providers: [
        ConfigService,
        GoogleCalendarApiService,
        CalendarService,
    ],
    declarations: [
        BookFlightComponent,
        BookformComponent
    ]
})
export class BookFlightModule {
}
