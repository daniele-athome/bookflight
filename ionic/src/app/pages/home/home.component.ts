import { Component } from "@angular/core";
import { IonRouterOutlet, Platform } from "@ionic/angular";
import { Plugins } from "@capacitor/core";
const { App } = Plugins;

@Component({
    selector: 'app-home',
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.scss'],
})
export class HomeComponent {

    constructor(
        private platform: Platform,
        private routerOutlet: IonRouterOutlet,
    ) {
        this.platform.backButton.subscribeWithPriority(-1, () => {
            if (!this.routerOutlet.canGoBack()) {
                App.exitApp();
            }
        });
    }
}
