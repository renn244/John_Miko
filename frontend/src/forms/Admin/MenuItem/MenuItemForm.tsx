import { CloudinaryPreview } from "@/components/common/CloudinaryPreview";
import { CloudinaryUpload } from "@/components/common/CloudinaryUpload";
import FormSection from "@/components/common/FormSection";
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel, FieldLegend, FieldSet, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessages } from "@/lib/getErrorMessages";
import { handleNestError, ValidationError } from "@/lib/handleNestError";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import MenuItemPreviewCard from "./MenuItemPreviewCard";

const MenuItemSchema = z.object({
    imageUrl: z.url().nonempty({ message: "Image is required" }),
    name: z.string().nonempty({ message: "Name is required" }),
    description: z.string().nonempty({ message: "Description is required" }),
    price: z.number().min(0, { message: "Price must be a positive number" }),
    category: z.string().nonempty({ message: "Category is required" }),
    availability: z.enum(["Available", "Unavailable"]),
});

type MenuItemSchemaType = z.infer<typeof MenuItemSchema>;

type MenuItemFormProps = {
    onsubmit: (data: any) => Promise<void | any>;
    oncancel: () => void;
    className?: string;
    initialData?: MenuItemSchemaType;
    isUpdate?: boolean;
};

const MenuItemForm = ({ onsubmit, oncancel, className, initialData, isUpdate }: MenuItemFormProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const {
        control,
        handleSubmit,
        setError,
    } = useForm<MenuItemSchemaType>({
        resolver: zodResolver(MenuItemSchema),
        defaultValues: {
            imageUrl: initialData?.imageUrl || "",
            name: initialData?.name || "",
            description: initialData?.description || "",
            price: initialData?.price || 0,
            category: initialData?.category || "",
            availability: initialData?.availability || "Available",
        },
        criteriaMode: "all",
    });

    const buttonText = isUpdate ? "Save Menu Item" : "Create Menu Item";

    const onSubmit = async (data: MenuItemSchemaType) => {
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
                                    Item Name <span className="text-red-700">*</span>
                                </FieldLabel>

                                <Input
                                    {...field}
                                    id={field.name}
                                    aria-invalid={fieldState.invalid}
                                    placeholder="e.g., Grilled Fish with Lemon Butter"
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
                                <FieldLabel htmlFor={field.name} className="gap-1">
                                    Item Description <span className="text-red-700">*</span>
                                </FieldLabel>

                                <Textarea
                                    {...field}
                                    id={field.name}
                                    aria-invalid={fieldState.invalid}
                                    className="max-h-50 min-h-28"
                                    placeholder="Provide a detailed description of the dish, including key ingredients and cooking methods..."
                                />

                                {fieldState.invalid ? (
                                    <FieldError errors={getErrorMessages(fieldState.error)} />
                                ) : (
                                    <FieldDescription>
                                        This will be shown to guests when browsing the menu.
                                    </FieldDescription>
                                )}
                            </Field>
                        )}
                        />
                </FormSection>

                <FormSection title="Menu Details" contentClassName="grid gap-5 md:grid-cols-2">
                        <Controller
                        name="category"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="grid gap-2">
                                <FieldLabel htmlFor={field.name} className="gap-1">
                                    Category <span className="text-red-700">*</span>
                                </FieldLabel>

                                <Input
                                    {...field}
                                    id={field.name}
                                    aria-invalid={fieldState.invalid}
                                    placeholder="e.g., Breakfast"
                                />

                                {fieldState.error && <FieldError errors={getErrorMessages(fieldState.error)} />}
                            </Field>
                        )}
                        />

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
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                    placeholder="e.g., 450"
                                />

                                {fieldState.error && <FieldError errors={getErrorMessages(fieldState.error)} />}
                            </Field>
                        )}
                        />
                </FormSection>

                <FormSection title="Media">
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
                                        />

                                        <p className="text-sm text-muted-foreground">
                                            This image will be used as the cover for the menu item card preview.
                                        </p>
                                    </div>
                                )}

                                {fieldState.invalid && <FieldError errors={getErrorMessages(fieldState.error)} />}
                            </Field>
                        )}
                        />
                </FormSection>

                {!isUpdate && (
                    <FormSection title="Availability">
                            <Controller
                            name="availability"
                            control={control}
                            render={({ field, fieldState }) => (
                                <FieldSet data-invalid={fieldState.invalid}>
                                    <FieldLegend data-invalid={fieldState.invalid} className="gap-1 data-[invalid=true]:text-destructive" variant="label">
                                        Initial Availability Status <span className="text-red-700">*</span>
                                    </FieldLegend>

                                    <RadioGroup
                                        {...field}
                                        name={field.name}
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        aria-invalid={fieldState.invalid}
                                        className="grid gap-3 md:grid-cols-2"
                                    >
                                        <FieldLabel htmlFor="form-rhf-radiogroup-Available">
                                            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                                <FieldContent>
                                                    <FieldTitle>Available</FieldTitle>
                                                    <FieldDescription>
                                                        It will be visible to guests after creation.
                                                    </FieldDescription>
                                                </FieldContent>
                                                <RadioGroupItem
                                                    value="Available"
                                                    id="form-rhf-radiogroup-Available"
                                                    aria-invalid={fieldState.invalid}
                                                />
                                            </Field>
                                        </FieldLabel>

                                        <FieldLabel htmlFor="form-rhf-radiogroup-Unavailable">
                                            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                                <FieldContent>
                                                    <FieldTitle>Unavailable</FieldTitle>
                                                    <FieldDescription>
                                                        It will stay hidden from guests until you enable it later.
                                                    </FieldDescription>
                                                </FieldContent>
                                                <RadioGroupItem
                                                    value="Unavailable"
                                                    id="form-rhf-radiogroup-Unavailable"
                                                    aria-invalid={fieldState.invalid}
                                                />
                                            </Field>
                                        </FieldLabel>
                                    </RadioGroup>

                                    <FieldDescription className="mt-2 text-xs">
                                        You can change this status later from the menu management page.
                                    </FieldDescription>

                                    {fieldState.invalid && <FieldError errors={getErrorMessages(fieldState.error)} />}
                                </FieldSet>
                            )}
                            />
                    </FormSection>
                )}
            </div>

            <MenuItemPreviewCard
            control={control}
            buttonText={buttonText}
            isLoading={isLoading}
            oncancel={oncancel}
            />
        </form>
    );
};

export default MenuItemForm;
