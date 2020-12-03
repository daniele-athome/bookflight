import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FullCalendarModule } from "@fullcalendar/angular";
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import { HttpClientModule } from "@angular/common/http";
import { ConfigService } from "./services/config.service";
import { NativeStorage } from "@ionic-native/native-storage/ngx";

// register FullCalendar plugins
FullCalendarModule.registerPlugins([
    dayGridPlugin,
    listPlugin,
    timeGridPlugin,
    googleCalendarPlugin,
]);

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        BrowserModule,
        HttpClientModule,
        IonicModule.forRoot(),
        FullCalendarModule,
        AppRoutingModule
    ],
    providers: [
        StatusBar,
        SplashScreen,
        ConfigService,
        NativeStorage,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
