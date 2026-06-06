import { CloudinaryPreview } from "@/components/common/CloudinaryPreview";
import { CloudinaryUpload } from "@/components/common/CloudinaryUpload";
import ViewPhotoDialog from "@/components/common/ViewPhotoDialog";
import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet, FieldTitle } from "@/components/ui/field";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useGetActivePaymentMethodsQuery } from "@/hooks/payment-methods.hook";
import { getErrorMessages } from "@/lib/getErrorMessages";
import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";
import { type Dispatch, type SetStateAction } from "react";
import { Controller, useFormContext } from "react-hook-form";
import type { multiStepBookingFormSchema } from "./MultiStepBookingForm";

type PaymentFormProps = {
    setBookingStep: Dispatch<SetStateAction<'form' | 'add-on' | 'review' | 'pre-order' | 'payment'>>,
    total: number;
    isLoading: boolean;
}

const PaymentForm = ({ setBookingStep, total, isLoading }: PaymentFormProps) => {
    const { control, watch } = useFormContext<multiStepBookingFormSchema>();
    const { data: paymentMethods, isLoading: isLoadingMethods } = useGetActivePaymentMethodsQuery();

    const partial = Math.round(total / 2);
    const amountToPayNow = watch('paymentType') && (watch('paymentType') === 'Full' ? total : partial);
    const amountToPayLater = watch('paymentType') && (watch('paymentType') === 'Full' ? 0 : total - partial);
    const selectedMethod = paymentMethods?.find((method) => method.id === watch('paymentMethodId'));

    return (
        <div className="flex flex-col justify-between min-h-[754px]">

            <div className="space-y-6">
                <FieldGroup>
                    <Controller 
                    name="paymentType"
                    control={control}
                    render={({ field, fieldState }) => (
                        <FieldSet aria-invalid={fieldState.invalid}>
                            <FieldLegend className="gap-1">
                                Payment Type <span className="text-red-700">*</span>
                            </FieldLegend>
                            <RadioGroup
                            disabled={isLoading}
                            name={field.name}
                            value={field.value}
                            onValueChange={field.onChange}
                            aria-invalid={fieldState.invalid}
                            >
                                <FieldLabel htmlFor="full-payment">
                                    <Field data-invalid={fieldState.invalid} orientation="horizontal">
                                        <FieldContent>
                                            <FieldTitle>Full Payment</FieldTitle>
                                            <FieldDescription>
                                                Pay the full amount now. <br />
                                            </FieldDescription>
                                        </FieldContent>
                                        <div className="flex-col justify-between">
                                            <span className="font-semibold text-base text-primary">
                                                ₱{total.toLocaleString()}
                                            </span>

                                            <div className="flex justify-end">
                                                <RadioGroupItem 
                                                value="Full" 
                                                id="full-payment"
                                                aria-invalid={fieldState.invalid}
                                                />
                                            </div>
                                        </div>
                                    </Field>
                                </FieldLabel>
                                <FieldLabel htmlFor="partial-payment">
                                    <Field data-invalid={fieldState.invalid} orientation="horizontal">
                                        <FieldContent>
                                            <FieldTitle>50% Downpayment</FieldTitle>
                                            <FieldDescription>
                                                Pay 50% now, remaining balance on check-in. <br />
                                            </FieldDescription>
                                        </FieldContent>
                                        <div className="flex-col justify-between">
                                            <span className="font-semibold text-base text-primary">
                                                ₱{partial.toLocaleString()}
                                            </span>

                                            <div className="flex justify-end">
                                                <RadioGroupItem 
                                                value="Partial" 
                                                id="partial-payment"
                                                aria-invalid={fieldState.invalid}
                                                />
                                            </div>
                                        </div>
                                    </Field>
                                </FieldLabel>
                            </RadioGroup>

                            {fieldState.invalid && (
                                <FieldError errors={getErrorMessages(fieldState.error)} />
                            )}
                        </FieldSet>
                    )}
                    />
                </FieldGroup>

                <FieldGroup>
                    <Controller
                    name="paymentMethodId"
                    control={control}
                    render={({ field, fieldState }) => (
                        <FieldSet aria-invalid={fieldState.invalid}>
                            <FieldLegend className="gap-1">
                                Payment Method <span className="text-red-700">*</span>
                            </FieldLegend>

                            {isLoadingMethods && (
                                <p className="text-sm text-muted-foreground">Loading payment methods...</p>
                            )}

                            {!isLoadingMethods && (!paymentMethods || paymentMethods.length === 0) && (
                                <p className="text-sm text-muted-foreground">
                                    No active payment methods are available right now.
                                </p>
                            )}

                            {paymentMethods && paymentMethods.length > 0 && (
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {paymentMethods.map((method) => {
                                        const isSelected = field.value === method.id;

                                        return (
                                            <button
                                                key={method.id}
                                                type="button"
                                                onClick={() => field.onChange(method.id)}
                                                className={cn(
                                                    "rounded-xl border p-4 text-left transition-all",
                                                    isSelected
                                                        ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                                                        : "border-gray-200 hover:border-gray-300 hover:bg-muted/30"
                                                )}
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <p className="font-semibold">{method.name}</p>
                                                        <p className="text-xs text-muted-foreground">{method.type}</p>
                                                    </div>
                                                    {isSelected && (
                                                        <CheckCircle className="w-5 h-5 text-primary" />
                                                    )}
                                                </div>
                                                {(method.accountName || method.accountNumber) && (
                                                    <p className="mt-2 text-xs text-muted-foreground">
                                                        {method.accountName ? `${method.accountName}` : ""}
                                                        {method.accountName && method.accountNumber ? " • " : ""}
                                                        {method.accountNumber ?? ""}
                                                    </p>
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>
                            )}

                            {fieldState.invalid && (
                                <FieldError errors={getErrorMessages(fieldState.error)} />
                            )}
                        </FieldSet>
                    )}
                    />
                </FieldGroup>

                {selectedMethod && (
                    <div className="rounded-xl border border-gray-200 bg-muted/30 p-4">
                        <div className="grid gap-4 md:grid-cols-[160px_1fr]">
                            <div className="rounded-lg border bg-white p-2">
                                {selectedMethod.qrCodeUrl ? (
                                    <ViewPhotoDialog imageUrl={selectedMethod.qrCodeUrl}>
                                        <img
                                        src={selectedMethod.qrCodeUrl}
                                        alt={`${selectedMethod.name} QR code`}
                                        className="w-full"
                                        />
                                    </ViewPhotoDialog>
                                ) : (
                                    <div className="h-36 flex items-center justify-center text-xs text-muted-foreground">
                                        QR code not provided
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2 text-sm">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Account Details</p>
                                    <p className="font-semibold">{selectedMethod.accountName || "—"}</p>
                                    <p className="font-medium">{selectedMethod.accountNumber || "—"}</p>
                                </div>
                                {selectedMethod.instructions && (
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Instructions</p>
                                        <p className="whitespace-pre-line text-sm">{selectedMethod.instructions}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <FieldGroup>
                    <Controller
                    name="proofImageUrl"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className="gap-1">
                                Proof of Payment <span className="text-red-700">*</span>
                            </FieldLabel>

                            {!field.value && (
                                <CloudinaryUpload
                                    onSuccess={(url) => field.onChange(url)}
                                />
                            )}

                            {field.value && (
                                <CloudinaryPreview
                                    images={[{ url: field.value }]}
                                    onRemove={() => field.onChange("")}
                                />
                            )}

                            <FieldDescription>
                                Upload your receipt or payment screenshot. We will verify your payment before confirming.
                            </FieldDescription>

                            {fieldState.invalid && (
                                <FieldError errors={getErrorMessages(fieldState.error)} />
                            )}
                        </Field>
                    )}
                    />
                </FieldGroup>

                {amountToPayNow && (
                    <div className="rounded-xl overflow-hidden border border-gray-100 mb-5 shadow-sm">
                        <div className="bg-primary flex justify-between px-5 pt-4">
                            <div>
                                <p className="text-xs text-white uppercase mb-1">Amount to pay now</p>
                                <p className="text-xl font-semibold text-white tracking-tight mb-3">₱{amountToPayNow.toLocaleString()}</p>
                            </div>
                            <div className="flex gap-2">
                                <div className="bg-white/15 h-min rounded-lg px-3 py-1.5">
                                    <p className="text-xs text-blue-200 mb-0.5">Due</p>
                                    <p className="text-xs font-semibold text-white">Right now</p>
                                </div>
                            </div>
                        </div>
                    
                        <div className="bg-white px-5 py-3 flex justify-between items-center border-t border-gray-100">
                            <div>
                                <p className="text-xs text-muted-foreground uppercase mb-1">Amount to pay later</p>
                                <p className="text-xl font-semibold text-gray-900 tracking-tight">₱{amountToPayLater.toLocaleString()}</p>
                            </div>
                            <div className="bg-muted rounded-lg px-3 py-1.5 text-right">
                                <p className="text-xs text-gray-400 mb-0.5 text-start">Due at</p>
                                <p className="text-xs font-semibold text-gray-600">Check-in</p>
                            </div>
                        </div>
                    
                        <div className="bg-gray-50 px-5 py-3 flex justify-between items-center border-t border-gray-100">
                            <span className="text-sm text-gray-400 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
                                Total booking value
                            </span>
                            <span className="text-sm font-semibold text-gray-700">₱{total.toLocaleString()}</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-2 mt-auto">
                <Button 
                disabled={!watch('paymentType') || !watch('paymentMethodId') || !watch('proofImageUrl') || isLoading}
                type="submit" className="w-full">
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            Submit Payment Proof
                            <CheckCircle className="w-6 h-6" />
                        </>
                    )}
                </Button>
                <Button
                disabled={isLoading}
                type="button"
                onClick={() => setBookingStep('review')}
                variant="outline" className="w-full"
                >
                    Back to Review
                </Button>
            </div>
        </div>
    )
}

export default PaymentForm;