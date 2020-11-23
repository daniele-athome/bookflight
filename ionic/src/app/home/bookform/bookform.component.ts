import { Component, OnInit } from '@angular/core';
import { ModalController } from "@ionic/angular";

@Component({
    selector: 'app-bookform',
    templateUrl: './bookform.component.html',
    styleUrls: ['./bookform.component.scss'],
})
export class BookformComponent implements OnInit {

    constructor(private modalController: ModalController) {
    }

    ngOnInit() {
    }

    dismiss() {
        // noinspection JSIgnoredPromiseFromCall
        this.modalController.dismiss({
            'dismissed': true
        });
    }

}
