import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';
import { FullCalendarModule } from "@fullcalendar/angular";
import { BookformComponent } from "./bookform/bookform.component";
import { ConfigService } from "../services/config.service";
import { CalendarService } from "../services/calendar.service";
import { GoogleCalendarApiService } from "../services/gcalendar.api.service";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        HomePageRoutingModule,
        FullCalendarModule,
    ],
    providers: [
        ConfigService,
        GoogleCalendarApiService,
        CalendarService,
    ],
    declarations: [
        HomePage,
        BookformComponent
    ]
})
export class HomePageModule {
}
