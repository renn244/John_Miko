import { CloudinaryPreview } from "@/components/common/CloudinaryPreview";
import { CloudinaryUpload } from "@/components/common/CloudinaryUpload";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessages } from "@/lib/getErrorMessages";
import { handleNestError, ValidationError } from "@/lib/handleNestError";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

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

    const buttonText = isUpdate ? "Update Service" : "Add Service";

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
        <form onSubmit={handleSubmit(onSubmit)} className={cn("bg-white rounded-xl shadow-sm border-2 overflow-hidden", className)}>
            <div className="p-6 md:p-8 space-y-6">
                <div>
                    <h2 className="text-lg font-bold mb-4 pb-2 border-b">Basic Information</h2>
                    <div className="space-y-5">
                        <Controller
                            name="name"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name} className="gap-1">
                                        Service Name <span className="text-red-700">*</span>
                                    </FieldLabel>

                                    <Input {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder="e.g., Videoke Room" />

                                    {fieldState.error && <FieldError errors={getErrorMessages(fieldState.error)} />}
                                </Field>
                            )}
                        />

                        <div className="grid md:grid-cols-2 gap-5">
                            <Controller
                                name="price"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel htmlFor={field.name} className="gap-1">
                                            Price (₱) <span className="text-red-700">*</span>
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
                                        onChange={(e) => {
                                            field.onChange(e.target.valueAsNumber)
                                        }}
                                        placeholder="e.g., 2"
                                        />

                                        {fieldState.error && <FieldError errors={getErrorMessages(fieldState.error)} />}
                                    </Field>
                                )}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-lg font-bold mb-4 pb-2 border-b">Description</h2>
                    <Controller
                        name="description"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel htmlFor={field.name}>
                                    Service Description
                                </FieldLabel>

                                <Textarea
                                    {...field}
                                    id={field.name}
                                    aria-invalid={fieldState.invalid}
                                    className="max-h-[200px]"
                                    rows={3}
                                    placeholder="Describe what the service includes..."
                                />

                                <FieldDescription>This will be shown to guests when browsing services</FieldDescription>

                                {fieldState.invalid && <FieldError errors={getErrorMessages(fieldState.error)} />}
                            </Field>
                        )}
                    />
                </div>

                <div>
                    <h2 className="text-lg font-bold mb-4 pb-2 border-b">Media</h2>
                    <Controller
                        name="imageUrl"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel className="gap-1">
                                    Image <span className="text-red-700">*</span>
                                </FieldLabel>

                                {!field.value && (
                                    <CloudinaryUpload
                                        onSuccess={(url) => field.onChange(url)}
                                        onError={(err) => setError("imageUrl", { type: "manual", message: err.message })}
                                    />
                                )}

                                {field.value && <CloudinaryPreview images={[{ url: field.value }]} onRemove={() => field.onChange("")} />}

                                {fieldState.invalid && <FieldError errors={getErrorMessages(fieldState.error)} />}
                            </Field>
                        )}
                    />
                </div>
            </div>

            <div className="px-6 md:px-8 py-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50">
                <p className="text-sm text-muted-foreground">
                    <span className="text-red-700">*</span> Required fields
                </p>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button disabled={isLoading} onClick={oncancel} type="button" variant="outline">
                        Cancel
                    </Button>
                    <Button disabled={isLoading} type="submit">
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

export default AddOnServiceForm;
