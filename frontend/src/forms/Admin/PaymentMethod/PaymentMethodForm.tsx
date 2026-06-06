import { CloudinaryPreview } from "@/components/common/CloudinaryPreview";
import { CloudinaryUpload } from "@/components/common/CloudinaryUpload";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import LoadingSpinner from "@/components/ui/loadingSpinner";
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

const PaymentMethodSchema = z.object({
    name: z.string().nonempty("Name is required"),
    type: z.enum(["GCASH", "MAYA", "BANK", "CASH"]),
    accountName: z.string().optional(),
    accountNumber: z.string().optional(),
    instructions: z.string().optional(),
    qrCodeUrl: z.url().optional(),
    sortOrder: z.number().min(0).optional(),
    isActive: z.boolean().optional(),
});

type PaymentMethodForm = z.infer<typeof PaymentMethodSchema>;

type PaymentMethodFormProps = {
    onsubmit: (data: any) => Promise<void | any>;
    oncancel: () => void;
    className?: string;
    initialData?: PaymentMethodForm;
    isUpdate?: boolean;
}

const PaymentMethodForm = ({ onsubmit, oncancel, className, initialData, isUpdate }: PaymentMethodFormProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const {
        control,
        handleSubmit,
        setError,
    } = useForm<PaymentMethodForm>({
        resolver: zodResolver(PaymentMethodSchema),
        defaultValues: {
            name: initialData?.name || "",
            type: initialData?.type || "GCASH",
            accountName: initialData?.accountName || "",
            accountNumber: initialData?.accountNumber || "",
            instructions: initialData?.instructions || "",
            qrCodeUrl: initialData?.qrCodeUrl,
            sortOrder: initialData?.sortOrder || 0,
            isActive: initialData?.isActive || true
        },
        criteriaMode: "all",
    });

    const buttonText = isUpdate ? "Update Payment Method" : "Add Payment Method";

    const onSubmit = async (data: PaymentMethodForm) => {
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
    }

    return (
        <form 
        onSubmit={handleSubmit(onSubmit)} 
        className={cn("space-y-4", className)}
        >
            <div className="grid md:grid-cols-2 gap-4">
                <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name} className="gap-1">
                            Name <span className="text-red-700">*</span>
                        </FieldLabel>
                        
                        <Input 
                        {...field} 
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="GCash" 
                        />

                        {fieldState.error && (
                            <FieldError errors={getErrorMessages(fieldState.error)} />
                        )}
                    </Field>
                )}
                />

                <Controller
                name="type"
                control={control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name} className="gap-1">
                            Type <span className="text-red-700">*</span>
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
                        
                        {fieldState.error && (
                            <FieldError errors={getErrorMessages(fieldState.error)} />
                        )}
                    </Field>
                )}
                />

                <Controller
                name="accountName"
                control={control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name} className="gap-1">
                            Account Name
                        </FieldLabel>
                        
                        <Input 
                        {...field} 
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="John Miko's Place" 
                        />

                        {fieldState.error && (
                            <FieldError errors={getErrorMessages(fieldState.error)} />
                        )}
                    </Field>
                )}
                />

                <Controller
                name="accountNumber"
                control={control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name} className="gap-1">
                            Account Number
                        </FieldLabel>
                        
                        <Input 
                        {...field} 
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="0917-XXX-XXXX" 
                        />

                        {fieldState.error && (
                            <FieldError errors={getErrorMessages(fieldState.error)} />
                        )}
                    </Field>
                )}
                />

                <Controller
                name="sortOrder"
                control={control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name} className="gap-1">
                            Sort Order
                        </FieldLabel>
                        
                        <Input
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        type="number"
                        onChange={(event) => field.onChange(event.target.valueAsNumber)}
                        />

                        {fieldState.error && (
                            <FieldError errors={getErrorMessages(fieldState.error)} />
                        )}
                    </Field>
                )}
                />

                <Controller
                name="isActive"
                control={control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name} className="gap-1">
                            Active
                        </FieldLabel>
                        
                        <div className="flex items-center gap-3">
                            <Switch 
                            id={field.name}
                            name={field.name}
                            checked={field.value ?? true} 
                            onCheckedChange={field.onChange} 
                            aria-invalid={fieldState.invalid}
                            />

                            <span className="text-sm text-muted-foreground">
                                {field.value ? "Shown to guests" : "Hidden"}
                            </span>
                        </div>
                    
                        {fieldState.error && (
                            <FieldError errors={getErrorMessages(fieldState.error)} />
                        )}
                    </Field>
                )}
                />
            </div>

            <Controller
            name="instructions"
            control={control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name} className="gap-1">
                        Instructions
                    </FieldLabel>
                    
                    <Textarea
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    rows={3}
                    placeholder="Send payment to 0917-XXX-XXXX. Use your booking ID as note."
                    />

                    <FieldDescription>
                        This note appears during checkout for guests.
                    </FieldDescription>

                    {fieldState.error && (
                        <FieldError errors={getErrorMessages(fieldState.error)} />
                    )}
                </Field>
            )}
            />

            <Controller
            name="qrCodeUrl"
            control={control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name} className="gap-1">
                        QR Code (optional)    
                    </FieldLabel>
                    
                    {!field.value && (
                        <CloudinaryUpload 
                        onSuccess={(url) => field.onChange(url)} />
                    )}

                    {field.value && (
                        <CloudinaryPreview
                        images={[{ url: field.value }]}
                        onRemove={() => field.onChange(undefined)}
                        />
                    )}
                    
                    {fieldState.error && (
                        <FieldError errors={getErrorMessages(fieldState.error)} />
                    )}
                </Field>
            )}
            />

            <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => oncancel()}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? <LoadingSpinner /> : buttonText}
                </Button>
            </div>
        </form>
    )
}

export default PaymentMethodForm