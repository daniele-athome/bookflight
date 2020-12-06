import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from "./home.component";

const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        children: [
            {
                path: 'book-flight',
                children: [
                    {
                        path: '',
                        loadChildren: () => import('../book-flight/book-flight.module').then(m => m.BookFlightModule)
                    },
                ]
            },
            {
                path: 'flight-log',
                children: [
                    {
                        path: '',
                        loadChildren: () => import('../flight-log/flight-log.module').then(m => m.FlightLogModule)
                    },
                ]
            },
            /* TODO about
            {
                path: 'about',
                children: [
                    {
                        path: '',
                        loadChildren: () => import('../about/about.module').then(m => m.AboutModule)
                    }
                ]
            },
             */
            {
                path: '',
                redirectTo: 'book-flight',
                pathMatch: 'full'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeRoutingModule { }
