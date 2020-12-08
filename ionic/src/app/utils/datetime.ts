import * as dayjs from "dayjs";

export function parseISODate(date: string): dayjs.Dayjs {
    return dayjs(date)
}

export function formatISODate(date: Date): string {
    return formatDateCustom(date, 'YYYY-MM-DD');
}

export function formatDateCustom(date: Date, format: string): string {
    return dayjs(date).format(format);
}

export function formatDateTime(date: Date, time: string): string {
    return joinDateTime(date, time).format("YYYY-MM-DD[T]HH:mm:ssZ");
}

export function joinDateTime(date: Date, time: string): dayjs.Dayjs {
    return dayjs(formatDateCustom(date, 'YYYY-MM-DD') + time, "YYYY-MM-DDHH:mm").local();
}

/** @see https://stackoverflow.com/a/57184486/1045199 */
export function xlSerialToDate(serialDate) {
    return new Date(-2209075200000 + (serialDate - (serialDate < 61 ? 0 : 1)) * 86400000);
}
