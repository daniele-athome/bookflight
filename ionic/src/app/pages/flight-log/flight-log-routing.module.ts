import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FlightLogComponent } from './flight-log.component';

const routes: Routes = [
    {
        path: '',
        component: FlightLogComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class FlightLogRoutingModule {}
