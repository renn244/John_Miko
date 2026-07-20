import { CloudinaryPreview } from "@/components/common/CloudinaryPreview";
import { CloudinaryUpload } from "@/components/common/CloudinaryUpload";
import FormSection from "@/components/common/FormSection";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InputTags } from "@/components/ui/tag-input";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessages } from "@/lib/getErrorMessages";
import { handleNestError, ValidationError } from "@/lib/handleNestError";
import { cn } from "@/lib/utils";
import type { Accommodation } from "@/types/admin/accommodation.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import AccommodationPreviewCard from "./AccommodationPreviewCard";
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
        className={cn("grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]", className)}
        onSubmit={handleSubmit(onSubmit)}
        >
            <div className="space-y-5">
                <FormSection title="Basic Information" contentClassName="space-y-5">
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
                            <Field data-invalid={fieldState.invalid} className="grid gap-2">
                                <FieldLabel htmlFor={field.name}>Description</FieldLabel>

                                <Textarea
                                id={field.name}
                                aria-invalid={fieldState.invalid}
                                placeholder="Enter description"
                                className="max-h-50 min-h-28"
                                {...field}
                                />

                                {fieldState.invalid ? (
                                    <FieldError errors={getErrorMessages(fieldState.error)} />
                                ) : (
                                    <FieldDescription>
                                        This will be shown to guests when browsing accommodations, so make it more detailed and enticing.
                                    </FieldDescription>
                                )}
                            </Field>
                        )}
                        />

                        <div className="grid gap-5 md:grid-cols-2">
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
                </FormSection>

                <StayOptionsFormSection
                control={control}
                errors={errors}
                setValue={setValue}
                isUpdate={isUpdate}
                existingStayOptions={initialData?.stayOptions}
                />

                <FormSection title="Media">
                        <Controller
                        name="imageUrl"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="grid gap-3">
                                {!field.value ? (
                                    <CloudinaryUpload
                                    purpose="ACCOMMODATION"
                                    onSuccess={(url) => field.onChange(url)}
                                    onError={(err) => setError("imageUrl", { type: "manual", message: err.message })}
                                    />
                                ) : (
                                    <div className="space-y-3">
                                        <CloudinaryPreview
                                        images={[{ url: field.value }]}
                                        onRemove={() => field.onChange("")}
                                        className="grid-cols-1"
                                        itemClassName="aspect-[16/10] rounded-xl"
                                        />
                                        <FieldDescription>
                                            Replace or remove the current cover image if needed.
                                        </FieldDescription>
                                    </div>
                                )}

                                {fieldState.invalid && (
                                    <FieldError errors={getErrorMessages(fieldState.error)} />
                                )}
                            </Field>
                        )}
                        />
                </FormSection>

                <FormSection title="Amenities">
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
                </FormSection>
            </div>

            <AccommodationPreviewCard
            control={control}
            buttonText={buttonText}
            isLoading={isLoading}
            oncancel={oncancel}
            />
        </form>
    );
};

export default AccommodationForm;
