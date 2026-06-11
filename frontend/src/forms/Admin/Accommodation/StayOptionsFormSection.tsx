import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import {
    ACCOMMODATION_STAY_OPTION_PRESET_MODE,
    type AccommodationStayOptionPresetMode,
} from "@/lib/constant/ACCOMMODATION_STAY_OPTION_PRESETS.constant";
import { getErrorMessages } from "@/lib/getErrorMessages";
import { formatStayOptionRange } from "@/lib/stayOptionTime";
import type { Accommodation } from "@/types/admin/accommodation.type";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Controller, useFieldArray, type Control, type FieldErrors } from "react-hook-form";
import type { AccommodationFormValues } from "./accommodationForm.schema";
import { createEmptyStayOption, getPresetStayOptions } from "./accommodationStayOptionForm.util";

type StayOptionsFormSectionProps = {
    control: Control<AccommodationFormValues>;
    errors: FieldErrors<AccommodationFormValues>;
    isUpdate?: boolean;
    existingStayOptions?: Accommodation["stayOptions"];
};

const StayOptionsFormSection = ({ control, errors, isUpdate, existingStayOptions = [] }: StayOptionsFormSectionProps) => {
    const [presetMode, setPresetMode] = useState<AccommodationStayOptionPresetMode>(
        ACCOMMODATION_STAY_OPTION_PRESET_MODE.DAYSTAY_OVERNIGHT
    );

    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: "stayOptions",
    });

    if (isUpdate) {
        return (
            <div>
                <h2 className="text-lg font-bold mb-4 pb-2 border-b">
                    Stay Options
                </h2>

                <div className="space-y-3">
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
                </div>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-lg font-bold mb-4 pb-2 border-b">
                Stay Options
            </h2>

            <div className="space-y-4">
                <RadioGroup
                value={presetMode}
                onValueChange={(value) => {
                    const nextMode = value as AccommodationStayOptionPresetMode;
                    setPresetMode(nextMode);
                    replace(nextMode === ACCOMMODATION_STAY_OPTION_PRESET_MODE.DAYSTAY_OVERNIGHT ? getPresetStayOptions() : []);
                }}
                className="grid md:grid-cols-2 gap-3"
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

                    <FieldLabel htmlFor="preset-custom">
                        <Field orientation="horizontal">
                            <FieldContent>
                                <FieldTitle>Custom</FieldTitle>
                                <FieldDescription>Start blank and add only what this accommodation needs.</FieldDescription>
                            </FieldContent>
                            <RadioGroupItem value={ACCOMMODATION_STAY_OPTION_PRESET_MODE.CUSTOM} id="preset-custom" />
                        </Field>
                    </FieldLabel>
                </RadioGroup>

                <div className="space-y-3">
                    {fields.map((field, index) => (
                        <div key={field.id} className="rounded-lg border p-3">
                            <div className="grid gap-3 lg:grid-cols-[minmax(160px,1.2fr)_120px_120px_110px_auto_auto] lg:items-end">
                                <Controller
                                name={`stayOptions.${index}.label`}
                                control={control}
                                render={({ field: labelField, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={labelField.name}>Label</FieldLabel>
                                        <Input
                                        id={labelField.name}
                                        placeholder="Day Stay"
                                        aria-invalid={fieldState.invalid}
                                        {...labelField}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={getErrorMessages(fieldState.error)} />
                                        )}
                                    </Field>
                                )}
                                />

                                <Controller
                                name={`stayOptions.${index}.startTime`}
                                control={control}
                                render={({ field: startField, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={startField.name}>Start</FieldLabel>
                                        <Input
                                        id={startField.name}
                                        type="time"
                                        aria-invalid={fieldState.invalid}
                                        value={startField.value ?? ""}
                                        onChange={startField.onChange}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={getErrorMessages(fieldState.error)} />
                                        )}
                                    </Field>
                                )}
                                />

                                <Controller
                                name={`stayOptions.${index}.endTime`}
                                control={control}
                                render={({ field: endField, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={endField.name}>End</FieldLabel>
                                        <Input
                                        id={endField.name}
                                        type="time"
                                        aria-invalid={fieldState.invalid}
                                        value={endField.value ?? ""}
                                        onChange={endField.onChange}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={getErrorMessages(fieldState.error)} />
                                        )}
                                    </Field>
                                )}
                                />

                                <Controller
                                name={`stayOptions.${index}.durationHours`}
                                control={control}
                                render={({ field: durationField, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={durationField.name}>Hours</FieldLabel>
                                        <Input
                                        id={durationField.name}
                                        type="number"
                                        min="1"
                                        placeholder="9"
                                        aria-invalid={fieldState.invalid}
                                        value={durationField.value ?? ""}
                                        onChange={(event) => durationField.onChange(event.target.value ? event.target.valueAsNumber : undefined)}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={getErrorMessages(fieldState.error)} />
                                        )}
                                    </Field>
                                )}
                                />

                                <Controller
                                name={`stayOptions.${index}.isActive`}
                                control={control}
                                render={({ field: activeField }) => (
                                    <Field orientation="horizontal" className="justify-between lg:justify-start lg:pb-1">
                                        <FieldLabel htmlFor={`stay-option-active-${index}`}>Active</FieldLabel>
                                        <Switch
                                        id={`stay-option-active-${index}`}
                                        checked={activeField.value}
                                        onCheckedChange={activeField.onChange}
                                        />
                                    </Field>
                                )}
                                />

                                <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="lg:mb-1"
                                onClick={() => remove(index)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}

                    <Button
                    type="button"
                    variant="outline"
                    onClick={() => append(createEmptyStayOption(fields.length))}
                    >
                        <Plus className="w-4 h-4" />
                        Add Stay Option
                    </Button>

                    {typeof errors.stayOptions?.message === "string" && (
                        <FieldError errors={[{ message: errors.stayOptions.message }]} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default StayOptionsFormSection;
