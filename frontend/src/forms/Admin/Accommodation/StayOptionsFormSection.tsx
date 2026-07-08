import FormSection from "@/components/common/FormSection";
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel, FieldTitle } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    ACCOMMODATION_STAY_OPTION_PRESET_MODE,
    type AccommodationStayOptionPresetMode,
} from "@/lib/constant/ACCOMMODATION_STAY_OPTION_PRESETS.constant";
import { formatStayOptionRange } from "@/lib/stayOptionTime";
import type { Accommodation } from "@/types/admin/accommodation.type";
import { useState } from "react";
import { useFieldArray, type Control, type FieldErrors, type UseFormSetValue } from "react-hook-form";
import type { AccommodationFormValues } from "./accommodationForm.schema";
import { getPresetStayOptions } from "./accommodationStayOptionForm.util";

type StayOptionsFormSectionProps = {
    control: Control<AccommodationFormValues>;
    errors: FieldErrors<AccommodationFormValues>;
    setValue: UseFormSetValue<AccommodationFormValues>;
    isUpdate?: boolean;
    existingStayOptions?: Accommodation["stayOptions"];
};

const StayOptionsFormSection = ({ control, errors, setValue, isUpdate, existingStayOptions = [] }: StayOptionsFormSectionProps) => {
    const [presetMode, setPresetMode] = useState<AccommodationStayOptionPresetMode>(
        ACCOMMODATION_STAY_OPTION_PRESET_MODE.DAYSTAY_OVERNIGHT
    );

    const { fields, replace } = useFieldArray({
        control,
        name: "stayOptions",
    });

    const applyPreset = (nextMode: AccommodationStayOptionPresetMode) => {
        setPresetMode(nextMode);
        replace(getPresetStayOptions(nextMode));

        if (nextMode === ACCOMMODATION_STAY_OPTION_PRESET_MODE.DAYSTAY_OVERNIGHT) {
            setValue("isGuestFeeWaived", false);
        }

        if (
            nextMode === ACCOMMODATION_STAY_OPTION_PRESET_MODE.TWENTY_TWO_HOURS ||
            nextMode === ACCOMMODATION_STAY_OPTION_PRESET_MODE.TWELVE_HOURS_FLEXIBLE
        ) {
            setValue("isGuestFeeWaived", true);
        }
    };

    if (isUpdate) {
        return (
            <FormSection title="Stay Options" contentClassName="space-y-3">
                    {existingStayOptions.length > 0 ? existingStayOptions.map((stayOption) => (
                        <div
                        key={stayOption.id}
                        className="rounded-lg border bg-muted/20 px-4 py-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div>
                                <p className="font-medium">{stayOption.label}</p>
                                <p className="text-xs text-muted-foreground">{stayOption.code}</p>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                <span>{formatStayOptionRange(stayOption)}</span>
                                <span>{stayOption.durationHours ? `${stayOption.durationHours} hrs` : "No duration"}</span>
                                <span>{stayOption.isActive ? "Active" : "Inactive"}</span>
                            </div>
                        </div>
                    )) : (
                        <p className="text-sm text-muted-foreground">
                            No stay options found on this accommodation yet.
                        </p>
                    )}

                    <FieldDescription>
                        Existing stay options are read-only for now so connected bookings stay safe.
                    </FieldDescription>
            </FormSection>
        );
    }

    return (
        <FormSection title="Stay Options" contentClassName="space-y-4">
                <div className="space-y-1">
                    <p className="text-sm font-medium">Choose a starting model</p>
                    <p className="text-sm text-muted-foreground">Preset stay options are locked so booking logic stays consistent.</p>
                </div>

                <RadioGroup
                value={presetMode}
                onValueChange={(value) => {
                    const nextMode = value as AccommodationStayOptionPresetMode;
                    applyPreset(nextMode);
                }}
                className="grid md:grid-cols-3 gap-3"
                >
                    <FieldLabel htmlFor="preset-daystay-overnight">
                        <Field orientation="horizontal">
                            <FieldContent>
                                <FieldTitle>Day Stay + Overnight</FieldTitle>
                                <FieldDescription>Starts with the two stable booking codes.</FieldDescription>
                            </FieldContent>
                            <RadioGroupItem value={ACCOMMODATION_STAY_OPTION_PRESET_MODE.DAYSTAY_OVERNIGHT} id="preset-daystay-overnight" />
                        </Field>
                    </FieldLabel>

                    <FieldLabel htmlFor="preset-twenty-two-hours">
                        <Field orientation="horizontal">
                            <FieldContent>
                                <FieldTitle>22 Hours</FieldTitle>
                                <FieldDescription>Single long-stay option with bundled guest fees.</FieldDescription>
                            </FieldContent>
                            <RadioGroupItem value={ACCOMMODATION_STAY_OPTION_PRESET_MODE.TWENTY_TWO_HOURS} id="preset-twenty-two-hours" />
                        </Field>
                    </FieldLabel>

                    <FieldLabel htmlFor="preset-twelve-hours-flexible">
                        <Field orientation="horizontal">
                            <FieldContent>
                                <FieldTitle>12 Hours Flexible</FieldTitle>
                                <FieldDescription>Single flexible stay option with bundled guest fees.</FieldDescription>
                            </FieldContent>
                            <RadioGroupItem value={ACCOMMODATION_STAY_OPTION_PRESET_MODE.TWELVE_HOURS_FLEXIBLE} id="preset-twelve-hours-flexible" />
                        </Field>
                    </FieldLabel>
                </RadioGroup>

                <div className="space-y-3">
                    {fields.map((field) => (
                        <div
                        key={field.id}
                        className="rounded-lg border bg-muted/20 px-4 py-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div>
                                <p className="font-medium">{field.label}</p>
                                <p className="text-xs text-muted-foreground">{field.code}</p>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                <span>{formatStayOptionRange(field)}</span>
                                <span>{field.durationHours ? `${field.durationHours} hrs` : "No duration"}</span>
                                <span>{field.isActive ? "Active" : "Inactive"}</span>
                            </div>
                        </div>
                    ))}

                    {typeof errors.stayOptions?.message === "string" && (
                        <FieldError errors={[{ message: errors.stayOptions.message }]} />
                    )}
                </div>
        </FormSection>
    );
};

export default StayOptionsFormSection;
