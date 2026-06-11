import { format } from "date-fns";
import type { AccommodationStayOption } from "@/types/admin/accommodation.type";

export type StayOptionTimeValue = string | null | undefined;
export type StayOptionTimeInput = {
    startTime?: StayOptionTimeValue;
    endTime?: StayOptionTimeValue;
};

export const parseStayOptionTime = (time?: StayOptionTimeValue) => {
    if (!time) return null;

    const match = time.match(/(?:T|^)(\d{2}):(\d{2})(?::\d{2})?/);
    if (!match) return null;

    return {
        hours: Number(match[1]),
        minutes: Number(match[2]),
    };
}

export const toTimeInputValue = (time?: StayOptionTimeValue) => {
    const parsed = parseStayOptionTime(time);
    if (!parsed) return "";

    return `${String(parsed.hours).padStart(2, "0")}:${String(parsed.minutes).padStart(2, "0")}`;
}

export const applyStayOptionTime = (date: Date, time?: StayOptionTimeValue) => {
    const parsed = parseStayOptionTime(time);
    if (!parsed) return false;

    date.setHours(parsed.hours, parsed.minutes, 0, 0);
    return true;
}

export const isOvernightStayOption = ({ startTime, endTime }: StayOptionTimeInput) => {
    const parsedStart = parseStayOptionTime(startTime);
    const parsedEnd = parseStayOptionTime(endTime);

    if (!parsedStart || !parsedEnd) return false;

    const startMinutes = parsedStart.hours * 60 + parsedStart.minutes;
    const endMinutes = parsedEnd.hours * 60 + parsedEnd.minutes;

    return endMinutes <= startMinutes;
}

export const formatStayOptionTime = (time?: StayOptionTimeValue) => {
    const parsed = parseStayOptionTime(time);
    if (!parsed) return "Flexible";

    const date = new Date();
    date.setHours(parsed.hours, parsed.minutes, 0, 0);

    return format(date, "h:mm a");
}

export const formatStayOptionRange = (stayOption: Pick<AccommodationStayOption, "startTime" | "endTime">) => {
    return `${formatStayOptionTime(stayOption.startTime)} to ${formatStayOptionTime(stayOption.endTime)}`;
}
