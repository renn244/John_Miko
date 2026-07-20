import { CloudinaryPreview } from "@/components/common/CloudinaryPreview";
import { CloudinaryUpload } from "@/components/common/CloudinaryUpload";
import FormSection from "@/components/common/FormSection";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessages } from "@/lib/getErrorMessages";
import { handleNestError, ValidationError } from "@/lib/handleNestError";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import AddOnServicePreviewCard from "./AddOnServicePreviewCard";

const AddOnServiceSchema = z.object({
    imageUrl: z.url()
        .nonempty({ message: "Image is required" }),
    name: z.string()
        .nonempty({ message: "Name is required" })
        .max(50, { message: "Name must be 50 characters or less" }),
    description: z.string()
        .min(20, { message: "Description must be at least 20 characters" })
        .max(400, { message: "Description must be at most 400 characters" }),
    price: z.number()
        .min(1, { message: "Price must be at least 1" }),
    quantity: z.number()
        .min(1, { message: "Quantity must be at least 1" }),
});

type AddOnServiceSchemaType = z.infer<typeof AddOnServiceSchema>;

type AddOnServiceFormProps = {
    onsubmit: (data: any) => Promise<void | any>;
    oncancel: () => void;
    className?: string;
    initialData?: AddOnServiceSchemaType;
    isUpdate?: boolean;
};

const AddOnServiceForm = ({ onsubmit, oncancel, className, initialData, isUpdate }: AddOnServiceFormProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const { control, handleSubmit, setError } = useForm<AddOnServiceSchemaType>({
        resolver: zodResolver(AddOnServiceSchema),
        defaultValues: {
            imageUrl: initialData?.imageUrl || "",
            name: initialData?.name || "",
            description: initialData?.description || "",
            price: initialData?.price || 1,
            quantity: initialData?.quantity || 1,
        },
        criteriaMode: "all",
    });

    const buttonText = isUpdate ? "Save Service" : "Create Service";

    const onSubmit = async (data: AddOnServiceSchemaType) => {
        setIsLoading(true);
        try {
            await onsubmit(data);
        } catch (error: any) {
            if (error instanceof ValidationError) {
                handleNestError(error.response, setError);
                return;
            }

            toast.error("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form
        onSubmit={handleSubmit(onSubmit)}
        className={cn("grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]", className)}
        >
            <div className="space-y-5">
                <FormSection title="Basic Information" contentClassName="space-y-5">
                    <Controller
                    name="name"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="grid gap-2">
                            <FieldLabel htmlFor={field.name} className="gap-1">
                                Name <span className="text-red-700">*</span>
                            </FieldLabel>

                            <Input
                            {...field}
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                            placeholder="e.g., Videoke Room"
                            />

                            {fieldState.error && <FieldError errors={getErrorMessages(fieldState.error)} />}
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
                            {...field}
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                            className="max-h-50 min-h-28"
                            placeholder="Describe what the service includes..."
                            />

                            {fieldState.invalid && <FieldError errors={getErrorMessages(fieldState.error)} />}
                        </Field>
                    )}
                    />
                    <div className="grid gap-5 md:grid-cols-2">
                        <Controller
                        name="price"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="grid gap-2">
                                <FieldLabel htmlFor={field.name} className="gap-1">
                                    Price (PHP) <span className="text-red-700">*</span>
                                </FieldLabel>

                                <Input
                                id={field.name}
                                type="number"
                                aria-invalid={fieldState.invalid}
                                {...field}
                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                placeholder="e.g., 1500"
                                />

                                {fieldState.error && <FieldError errors={getErrorMessages(fieldState.error)} />}
                            </Field>
                        )}
                        />
                        <Controller
                        name="quantity"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="grid gap-2">
                                <FieldLabel htmlFor={field.name} className="gap-1">
                                    Quantity <span className="text-red-700">*</span>
                                </FieldLabel>

                                <Input
                                id={field.name}
                                type="number"
                                aria-invalid={fieldState.invalid}
                                {...field}
                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                placeholder="e.g., 12"
                                />

                                {fieldState.error && <FieldError errors={getErrorMessages(fieldState.error)} />}
                            </Field>
                        )}
                        />
                    </div>
                </FormSection>

                <FormSection title="Media" contentClassName="px-5 py-5">
                        <Controller
                        name="imageUrl"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="grid gap-3">
                                <FieldLabel className="gap-1">
                                    Image <span className="text-red-700">*</span>
                                </FieldLabel>

                                {!field.value && (
                                    <CloudinaryUpload
                                        purpose="ADD_ON_SERVICE"
                                        onSuccess={(url) => field.onChange(url)}
                                        onError={(err) => setError("imageUrl", { type: "manual", message: err.message })}
                                    />
                                )}

                                {field.value && (
                                    <div className="space-y-3">
                                        <CloudinaryPreview
                                            images={[{ url: field.value }]}
                                            onRemove={() => field.onChange("")}
                                            className="grid-cols-1"
                                            itemClassName="aspect-[16/10]"
                                        />w
                                    </div>
                                )}

                                {fieldState.invalid && <FieldError errors={getErrorMessages(fieldState.error)} />}
                            </Field>
                        )}
                        />
                </FormSection>
            </div>

            <AddOnServicePreviewCard
            control={control}
            buttonText={buttonText}
            isLoading={isLoading}
            oncancel={oncancel}
            />
        </form>
    );
};

export default AddOnServiceForm;
