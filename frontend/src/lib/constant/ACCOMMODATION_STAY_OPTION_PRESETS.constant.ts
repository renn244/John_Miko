import type { CreateAccommodationDto } from "@/features/shared/accommodations/types/accommodation.type";

export const ACCOMMODATION_STAY_OPTION_PRESET_MODE = {
    DAYSTAY_OVERNIGHT: "preset_daystay_overnight",
    TWENTY_TWO_HOURS: "preset_twenty_two_hours",
    TWELVE_HOURS_FLEXIBLE: "preset_twelve_hours_flexible",
} as const;

export type AccommodationStayOptionPresetMode =
    typeof ACCOMMODATION_STAY_OPTION_PRESET_MODE[keyof typeof ACCOMMODATION_STAY_OPTION_PRESET_MODE];

export const DAYSTAY_OVERNIGHT_PRESET: CreateAccommodationDto["stayOptions"] = [
    {
        code: "DAYSTAY",
        label: "Day Stay",
        durationHours: 9,
        startTime: "08:00:00",
        endTime: "17:00:00",
        sortOrder: 0,
        isActive: true,
    },
    {
        code: "OVERNIGHT",
        label: "Over night",
        durationHours: 10,
        startTime: "19:00:00",
        endTime: "05:00:00",
        sortOrder: 1,
        isActive: true,
    },
];

export const TWENTY_TWO_HOURS_PRESET: CreateAccommodationDto["stayOptions"] = [
    {
        code: "TWENTY_TWO_HOURS",
        label: "22 Hours Stay",
        durationHours: 22,
        startTime: "14:00:00",
        endTime: "12:00:00",
        sortOrder: 0,
        isActive: true,
    },
];

export const TWELVE_HOURS_FLEXIBLE_PRESET: CreateAccommodationDto["stayOptions"] = [
    {
        code: "TWELVE_HOURS_FLEXIBLE",
        label: "12 Hours",
        durationHours: 12,
        startTime: "08:00:00",
        endTime: "20:00:00",
        sortOrder: 0,
        isActive: true,
    },
];
