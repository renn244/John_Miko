import { CloudinaryPreview } from "@/components/common/CloudinaryPreview";
import { CloudinaryUpload } from "@/components/common/CloudinaryUpload";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { InputTags } from "@/components/ui/tag-input";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessages } from "@/lib/getErrorMessages";
import { handleNestError, ValidationError } from "@/lib/handleNestError";
import { cn } from "@/lib/utils";
import type { Accommodation } from "@/types/admin/accommodation.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { AccommodationSchema, type AccommodationFormValues } from "./accommodationForm.schema";
import { getAccommodationFormDefaults } from "./accommodationStayOptionForm.util";
import StayOptionsFormSection from "./StayOptionsFormSection";

type AccommodationFormProps = {
    onsubmit: (data: AccommodationFormValues) => Promise<void | any>;
    oncancel: () => void;
    className?: string;
    initialData?: Accommodation;
    isUpdate?: boolean;
};

const AccommodationForm = ({ onsubmit, oncancel, className, initialData, isUpdate }: AccommodationFormProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const {
        control,
        handleSubmit,
        setError,
        setValue,
        formState: { errors },
    } = useForm<AccommodationFormValues>({
        resolver: zodResolver(AccommodationSchema),
        defaultValues: getAccommodationFormDefaults(initialData, isUpdate),
        criteriaMode: "all",
    });

    const buttonText = isUpdate ? "Save" : "Create";

    const onSubmit = async (data: AccommodationFormValues) => {
        setIsLoading(true);
        try {
            await onsubmit(data);
        } catch (error: any) {
            if (error instanceof ValidationError) {
                handleNestError(error.response, setError);
                return;
            }

            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form
        className={cn("bg-white rounded-xl shadow-sm border overflow-hidden", className)}
        onSubmit={handleSubmit(onSubmit)}
        >
            <div className="p-6 md:p-8 space-y-6">
                <div>
                    <h2 className="text-lg font-bold mb-4 pb-2 border-b">
                        Basic Information
                    </h2>
                    <div className="space-y-5">
                        <Controller
                        name="name"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="grid gap-2">
                                <FieldLabel htmlFor={field.name}>Accommodation Name</FieldLabel>

                                <Input
                                id={field.name}
                                placeholder="e.g., Deluxe Ocean View Room"
                                aria-invalid={fieldState.invalid}
                                {...field}
                                />

                                {fieldState.invalid && (
                                    <FieldError errors={getErrorMessages(fieldState.error)} />
                                )}
                            </Field>
                        )}
                        />

                        <Controller
                        name="description"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="grid gaps-2">
                                <FieldLabel htmlFor={field.name}>Description</FieldLabel>

                                <Textarea
                                id={field.name}
                                aria-invalid={fieldState.invalid}
                                placeholder="Enter description"
                                className="max-h-50"
                                {...field}
                                />

                                {fieldState.invalid ? (
                                    <FieldError errors={getErrorMessages(fieldState.error)} />
                                ) : (
                                    <FieldDescription>
                                        This will be shown to guests when browsing accommodations, so make it more detailed and enticing!
                                    </FieldDescription>
                                )}
                            </Field>
                        )}
                        />

                        <div className="grid md:grid-cols-2 gap-5">
                            <Controller
                            name="type"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className="grid gap-2">
                                    <FieldLabel htmlFor={field.name}>Type</FieldLabel>

                                    <Select
                                    name={field.name}
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    >
                                        <SelectTrigger id={field.name} aria-invalid={fieldState.invalid}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Accommodation Type</SelectLabel>
                                                <SelectItem value="Room">Room</SelectItem>
                                                <SelectItem value="Cottage">Cottage</SelectItem>
                                                <SelectItem value="EventHall">Event Hall</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>

                                    {fieldState.invalid && (
                                        <FieldError errors={getErrorMessages(fieldState.error)} />
                                    )}
                                </Field>
                            )}
                            />

                            <Controller
                            name="capacity"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className="grid gap-2">
                                    <FieldLabel htmlFor={field.name}>Capacity (pax)</FieldLabel>

                                    <Input
                                    id={field.name}
                                    type="number"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Enter capacity"
                                    {...field}
                                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                    />

                                    {fieldState.invalid && (
                                        <FieldError errors={getErrorMessages(fieldState.error)} />
                                    )}
                                </Field>
                            )}
                            />
                        </div>

                        <Controller
                        name="price"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="grid gap-2">
                                <FieldLabel htmlFor={field.name}>Price</FieldLabel>

                                <Input
                                id={field.name}
                                type="number"
                                aria-invalid={fieldState.invalid}
                                placeholder="Enter price"
                                {...field}
                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                />

                                {fieldState.invalid && (
                                    <FieldError errors={getErrorMessages(fieldState.error)} />
                                )}
                            </Field>
                        )}
                        />

                        <Controller
                        name="isGuestFeeWaived"
                        control={control}
                        render={({ field }) => (
                            <Field className="rounded-lg border bg-muted/20 px-4 py-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-1">
                                        <FieldLabel htmlFor="guest-fee-waived">
                                            Guest fees included in price
                                        </FieldLabel>
                                        <FieldDescription>
                                            Enable this when guest entrance fees are already bundled into the accommodation price.
                                        </FieldDescription>
                                    </div>

                                    {isUpdate ? (
                                        <span className="text-sm font-medium text-muted-foreground">
                                            {field.value ? "Included" : "Charged separately"}
                                        </span>
                                    ) : (
                                        <Switch
                                        id="guest-fee-waived"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        />
                                    )}
                                </div>
                            </Field>
                        )}
                        />
                    </div>
                </div>

                <StayOptionsFormSection
                control={control}
                errors={errors}
                setValue={setValue}
                isUpdate={isUpdate}
                existingStayOptions={initialData?.stayOptions}
                />

                <div>
                    <h2 className="text-lg font-bold mb-4 pb-2 border-b">
                        Media
                    </h2>

                    <Controller
                    name="imageUrl"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="grid gaps-2">
                            <FieldLabel htmlFor={field.name}>Image URL</FieldLabel>

                            {!field.value && (
                                <CloudinaryUpload
                                onSuccess={(url) => field.onChange(url)}
                                onError={(err) => setError("imageUrl", { type: "manual", message: err.message })}
                                />
                            )}

                            {field.value && (
                                <CloudinaryPreview
                                images={[{ url: field.value }]}
                                onRemove={() => field.onChange("")}
                                />
                            )}

                            {fieldState.invalid && (
                                <FieldError errors={getErrorMessages(fieldState.error)} />
                            )}
                        </Field>
                    )}
                    />
                </div>

                <div>
                    <h2 className="text-lg font-bold mb-4 pb-2 border-b">
                        Amenities
                    </h2>

                    <Controller
                    name="amenities"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="grid gap-2">
                            <FieldLabel htmlFor={field.name}>Amenities</FieldLabel>

                            <InputTags
                            value={field.value}
                            onChange={field.onChange}
                            />

                            {fieldState.invalid && (
                                <FieldError errors={getErrorMessages(fieldState.error)} />
                            )}
                        </Field>
                    )}
                    />
                </div>
            </div>

            <div
            className="px-6 md:px-8 py-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{ backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" }}
            >
                <p className="text-sm" style={{ color: "#6B7280" }}>
                    <span style={{ color: "#DC2626" }}>*</span> Required fields
                </p>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button onClick={oncancel} type="button" variant="outline">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                            <LoadingSpinner />
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                {buttonText}
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default AccommodationForm;
