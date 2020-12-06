export interface FlightLogItem {
    date: Date,
    pilot: string,
    origin: string,
    destination: string,
    startHour: number,
    endHour: number,
    fuel: number,
    notes?: string,
}
