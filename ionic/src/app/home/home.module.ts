import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';
import { FullCalendarModule } from "@fullcalendar/angular";
import { BookformComponent } from "./bookform/bookform.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        HomePageRoutingModule,
        FullCalendarModule,
    ],
    declarations: [
        HomePage,
        BookformComponent
    ]
})
export class HomePageModule {
}
