import { Injectable } from '@angular/core';
import { CalEvent } from '../models/calevent.model';

@Injectable({
    providedIn: 'root'
})
export class CalendarService {

    constructor() { }

    // TODO

    public createEvent(event: CalEvent) {
        // TODO
    }

    public updateEvent(eventId: string, event: CalEvent) {
        // TODO
    }

    public deleteEvent(eventId: string) {

    }

}
