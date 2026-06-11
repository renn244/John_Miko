import type { CreateAccommodationDto } from "@/types/admin/accommodation.type";

export const ACCOMMODATION_STAY_OPTION_PRESET_MODE = {
    DAYSTAY_OVERNIGHT: "preset_daystay_overnight",
    CUSTOM: "custom",
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
        label: "Overnight",
        durationHours: 10,
        startTime: "19:00:00",
        endTime: "05:00:00",
        sortOrder: 1,
        isActive: true,
    },
];
