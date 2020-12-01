import * as dayjs from "dayjs";

export function formatDateTime(date: Date, time: string): string {
    return dayjs(dayjs(date).format('YYYY-MM-DD') + time, "YYYY-MM-DDHH:mm")
        .local().format("YYYY-MM-DD[T]HH:mm:ssZ");
}
