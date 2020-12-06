import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        redirectTo: '/book-flight',
        pathMatch: 'full'
    },
    {
        path: 'book-flight',
        loadChildren: () => import('./pages/book-flight/book-flight.module').then(m => m.BookFlightModule)
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
