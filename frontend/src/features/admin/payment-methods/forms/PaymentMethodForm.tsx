import { CloudinaryPreview } from "@/components/common/CloudinaryPreview";
import { CloudinaryUpload } from "@/components/common/CloudinaryUpload";
import FormSection from "@/components/common/FormSection";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessages } from "@/lib/getErrorMessages";
import { handleNestError, ValidationError } from "@/lib/handleNestError";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import PaymentMethodPreviewCard from "./PaymentMethodPreviewCard";

const PaymentMethodSchema = z.object({
    name: z.string().nonempty("Name is required"),
    type: z.enum(["GCASH", "MAYA", "BANK", "CASH"]),
    accountName: z.string().optional(),
    accountNumber: z.string().optional(),
    instructions: z.string().optional(),
    qrCodeUrl: z.url().nullable().optional(),
    sortOrder: z.number().min(0).optional(),
    isActive: z.boolean().optional(),
});

type PaymentMethodFormValues = z.infer<typeof PaymentMethodSchema>;

type PaymentMethodFormProps = {
    onsubmit: (data: any) => Promise<void | any>;
    oncancel: () => void;
    className?: string;
    initialData?: PaymentMethodFormValues;
    isUpdate?: boolean;
};

const PaymentMethodForm = ({
    onsubmit,
    oncancel,
    className,
    initialData,
    isUpdate,
}: PaymentMethodFormProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const { control, handleSubmit, setError } = useForm<PaymentMethodFormValues>({
        resolver: zodResolver(PaymentMethodSchema),
        defaultValues: {
            name: initialData?.name || "",
            type: initialData?.type || "GCASH",
            accountName: initialData?.accountName || "",
            accountNumber: initialData?.accountNumber || "",
            instructions: initialData?.instructions || "",
            qrCodeUrl: initialData?.qrCodeUrl,
            sortOrder: initialData?.sortOrder || 0,
            isActive: initialData?.isActive ?? true,
        },
        criteriaMode: "all",
    });

    const buttonText = isUpdate ? "Save Payment Method" : "Create Payment Method";

    const onSubmit = async (data: PaymentMethodFormValues) => {
        setIsLoading(true);
        try {
            await onsubmit(data);
        } catch (error: any) {
            if (error instanceof ValidationError) {
                handleNestError(error.response, setError);
                return;
            }

            toast.error(error.message || "Something went wrong");
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
                <FormSection title="Basic Information" contentClassName="grid gap-5 md:grid-cols-2">
                        <Controller
                        name="name"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="grid gap-2">
                                <FieldLabel htmlFor={field.name} className="gap-1">
                                    Method Name <span className="text-red-700">*</span>
                                </FieldLabel>

                                <Input
                                {...field}
                                id={field.name}
                                aria-invalid={fieldState.invalid}
                                placeholder="e.g., Primary BDO"
                                />

                                {fieldState.error && <FieldError errors={getErrorMessages(fieldState.error)} />}
                            </Field>
                        )}
                        />

                        <Controller
                        name="type"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="grid gap-2">
                                <FieldLabel htmlFor={field.name} className="gap-1">
                                    Method Type <span className="text-red-700">*</span>
                                </FieldLabel>

                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger aria-invalid={fieldState.invalid} className="w-full">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="GCASH">GCash</SelectItem>
                                        <SelectItem value="MAYA">Maya</SelectItem>
                                        <SelectItem value="BANK">Bank Transfer</SelectItem>
                                        <SelectItem value="CASH">Cash on-site</SelectItem>
                                    </SelectContent>
                                </Select>

                                {fieldState.error && <FieldError errors={getErrorMessages(fieldState.error)} />}
                            </Field>
                        )}
                        />

                        <Controller
                        name="accountName"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="grid gap-2">
                                <FieldLabel htmlFor={field.name}>Account Name</FieldLabel>

                                <Input
                                {...field}
                                id={field.name}
                                aria-invalid={fieldState.invalid}
                                placeholder="e.g., John Miko's Place"
                                />

                                {fieldState.error && <FieldError errors={getErrorMessages(fieldState.error)} />}
                            </Field>
                        )}
                        />

                        <Controller
                        name="accountNumber"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="grid gap-2">
                                <FieldLabel htmlFor={field.name}>Account Number / Mobile</FieldLabel>

                                <Input
                                {...field}
                                id={field.name}
                                aria-invalid={fieldState.invalid}
                                placeholder="e.g., 0917 123 4567"
                                />

                                {fieldState.error && <FieldError errors={getErrorMessages(fieldState.error)} />}
                            </Field>
                        )}
                        />
                </FormSection>

                <FormSection title="Guest Instructions">
                        <Controller
                        name="instructions"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="grid gap-2">
                                <FieldLabel htmlFor={field.name}>Payment Instructions</FieldLabel>

                                <Textarea
                                {...field}
                                id={field.name}
                                aria-invalid={fieldState.invalid}
                                className="min-h-28 max-h-52"
                                placeholder="Please send proof of payment to bookings@johnmikos.com within 24 hours..."
                                />

                                {fieldState.invalid ? (
                                    <FieldError errors={getErrorMessages(fieldState.error)} />
                                ) : (
                                    <FieldDescription>
                                        Keep this concise and clear so guests know exactly what to do after payment.
                                    </FieldDescription>
                                )}
                            </Field>
                        )}
                        />
                </FormSection>

                <FormSection title="Availability & Order" contentClassName="grid gap-5 md:grid-cols-2">
                        <Controller
                        name="sortOrder"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="grid gap-2">
                                <FieldLabel htmlFor={field.name}>Sort Order</FieldLabel>

                                <Input
                                id={field.name}
                                type="number"
                                aria-invalid={fieldState.invalid}
                                value={field.value ?? 0}
                                onChange={(event) => field.onChange(event.target.valueAsNumber)}
                                placeholder="0"
                                />

                                {fieldState.invalid ? (
                                    <FieldError errors={getErrorMessages(fieldState.error)} />
                                ) : (
                                    <FieldDescription>
                                        Lower numbers usually appear earlier in the checkout payment list.
                                    </FieldDescription>
                                )}
                            </Field>
                        )}
                        />

                        <Controller
                        name="isActive"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="grid gap-3">
                                <FieldLabel htmlFor={field.name}>Visibility</FieldLabel>

                                <div className="flex items-center justify-between rounded-xl border border-border/70 px-4 py-3">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-foreground">
                                            {field.value ? "Active and visible" : "Inactive and hidden"}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {field.value
                                                ? "Guests can choose this payment method during checkout."
                                                : "This method stays hidden until you enable it again."}
                                        </p>
                                    </div>

                                    <Switch
                                    id={field.name}
                                    name={field.name}
                                    checked={field.value ?? true}
                                    onCheckedChange={field.onChange}
                                    aria-invalid={fieldState.invalid}
                                    />
                                </div>

                                {fieldState.error && <FieldError errors={getErrorMessages(fieldState.error)} />}
                            </Field>
                        )}
                        />
                </FormSection>

                <FormSection title="QR Code Support">
                        <Controller
                        name="qrCodeUrl"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="grid gap-3">
                                <FieldLabel className="gap-1">QR Code</FieldLabel>

                                {!field.value && (
                                    <CloudinaryUpload purpose="PAYMENT_METHOD_QR" onSuccess={(url) => field.onChange(url)} />
                                )}

                                {field.value && (
                                    <div className="space-y-3">
                                        <CloudinaryPreview
                                        images={[{ url: field.value }]}
                                        onRemove={() => field.onChange(null)}
                                        className="grid-cols-1"
                                        itemClassName="aspect-square max-w-[220px]"
                                        />

                                        <p className="text-sm text-muted-foreground">
                                            This QR code will appear in the payment method preview and can also support guest checkout instructions.
                                        </p>
                                    </div>
                                )}

                                {fieldState.error && <FieldError errors={getErrorMessages(fieldState.error)} />}
                            </Field>
                        )}
                        />
                </FormSection>
            </div>

            <PaymentMethodPreviewCard
            control={control}
            buttonText={buttonText}
            isLoading={isLoading}
            oncancel={oncancel}
            />
        </form>
    );
};

export default PaymentMethodForm;
