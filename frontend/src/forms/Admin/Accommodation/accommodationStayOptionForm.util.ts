import { DAYSTAY_OVERNIGHT_PRESET } from "@/lib/constant/ACCOMMODATION_STAY_OPTION_PRESETS.constant";
import { toTimeInputValue } from "@/lib/stayOptionTime";
import type { Accommodation, CreateAccommodationDto, UpdateAccommodationDto } from "@/types/admin/accommodation.type";
import type { AccommodationFormValues } from "./accommodationForm.schema";

export const normalizeTimeInput = (time?: string | null) => toTimeInputValue(time);

const normalizeTimeOutput = (time?: string) => time ? `${time}:00` : undefined;

const generateStayOptionCode = (label: string, fallbackIndex: number) => {
    const normalized = label
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");

    return normalized || `CUSTOM_STAY_OPTION_${fallbackIndex + 1}`;
};

export const createEmptyStayOption = (index: number): AccommodationFormValues["stayOptions"][number] => ({
    code: "",
    label: "",
    durationHours: undefined,
    startTime: "",
    endTime: "",
    sortOrder: index,
    isActive: true,
});

export const getPresetStayOptions = (): AccommodationFormValues["stayOptions"] =>
    DAYSTAY_OVERNIGHT_PRESET.map((stayOption, index) => ({
        ...stayOption,
        durationHours: stayOption.durationHours ?? undefined,
        startTime: normalizeTimeInput(stayOption.startTime),
        endTime: normalizeTimeInput(stayOption.endTime),
        sortOrder: index,
    }));

export const getAccommodationFormDefaults = (initialData?: Accommodation, isUpdate?: boolean): AccommodationFormValues => ({
    name: initialData?.name || "",
    type: initialData?.type || "Room",
    capacity: initialData?.capacity || 0,
    price: initialData?.price || 0,
    isGuestFeeWaived: initialData?.isGuestFeeWaived || false,
    description: initialData?.description || "",
    imageUrl: initialData?.imageUrl || "",
    amenities: initialData?.amenities || [],
    stayOptions: isUpdate
        ? (initialData?.stayOptions || []).map((stayOption, index) => ({
            code: stayOption.code,
            label: stayOption.label,
            durationHours: stayOption.durationHours ?? undefined,
            startTime: normalizeTimeInput(stayOption.startTime),
            endTime: normalizeTimeInput(stayOption.endTime),
            sortOrder: index,
            isActive: stayOption.isActive,
        }))
        : getPresetStayOptions(),
});

export const prepareAccommodationCreatePayload = (data: AccommodationFormValues): CreateAccommodationDto => ({
    ...data,
    stayOptions: data.stayOptions.map((stayOption, index) => ({
        code: stayOption.code || generateStayOptionCode(stayOption.label, index),
        label: stayOption.label,
        durationHours: stayOption.durationHours,
        startTime: normalizeTimeOutput(stayOption.startTime),
        endTime: normalizeTimeOutput(stayOption.endTime),
        sortOrder: index,
        isActive: stayOption.isActive,
    })),
});

export const prepareAccommodationUpdatePayload = (data: AccommodationFormValues): UpdateAccommodationDto => {
    const { stayOptions: _stayOptions, isGuestFeeWaived: _isGuestFeeWaived, ...payload } = data;

    return payload;
};

