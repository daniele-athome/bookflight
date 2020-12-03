import * as dayjs from "dayjs";

export function parseISODate(date: string): dayjs.Dayjs {
    return dayjs(date)
}

export function formatDateTime(date: Date, time: string): string {
    return joinDateTime(date, time).format("YYYY-MM-DD[T]HH:mm:ssZ");
}

export function joinDateTime(date: Date, time: string): dayjs.Dayjs {
    return dayjs(dayjs(date).format('YYYY-MM-DD') + time, "YYYY-MM-DDHH:mm").local();
}
