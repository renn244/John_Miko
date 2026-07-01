import { CloudinaryPreview } from "@/components/common/CloudinaryPreview";
import { CloudinaryUpload } from "@/components/common/CloudinaryUpload";
import ViewPhotoDialog from "@/components/common/ViewPhotoDialog";
import { GuestCard, GuestDivider } from "@/components/guest";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "@/components/ui/field";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useGetActivePaymentMethodsQuery } from "@/hooks/payment-methods.hook";
import { getErrorMessages } from "@/lib/getErrorMessages";
import { cn, formatPeso } from "@/lib/utils";
import { CheckCircle } from "lucide-react";
import { type Dispatch, type SetStateAction } from "react";
import { Controller, useFormContext } from "react-hook-form";
import type { multiStepBookingFormSchema } from "./MultiStepBookingForm";

type PaymentFormProps = {
    setBookingStep: Dispatch<SetStateAction<"form" | "add-on" | "review" | "pre-order" | "payment">>;
    total: number;
    isLoading: boolean;
};

const PaymentSummaryLine = ({
    label,
    value,
    emphasize = false,
}: {
    label: string;
    value: string;
    emphasize?: boolean;
}) => (
    <div className="flex items-center justify-between gap-4 text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className={emphasize ? "font-bold text-primary" : "font-semibold"}>
            {value}
        </span>
    </div>
);

const PaymentForm = ({ setBookingStep, total, isLoading }: PaymentFormProps) => {
    const { control, watch } = useFormContext<multiStepBookingFormSchema>();
    const { data: paymentMethods, isLoading: isLoadingMethods } = useGetActivePaymentMethodsQuery();

    const paymentType = watch("paymentType");
    const paymentMethodId = watch("paymentMethodId");
    const proofImageUrl = watch("proofImageUrl");
    const partial = Math.round(total / 2);
    const amountToPayNow = paymentType && (paymentType === "Full" ? total : partial);
    const amountToPayLater = paymentType && (paymentType === "Full" ? 0 : total - partial);
    const selectedMethod = paymentMethods?.find((method) => method.id === paymentMethodId);

    return (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="space-y-4">
                <GuestCard className="p-4 md:p-5">
                    <FieldGroup>
                        <Controller
                            name="paymentType"
                            control={control}
                            render={({ field, fieldState }) => (
                                <FieldSet aria-invalid={fieldState.invalid}>
                                    <FieldLegend className="gap-1 text-base font-bold">
                                        Payment Type <span className="text-red-700">*</span>
                                    </FieldLegend>
                                    <RadioGroup
                                        disabled={isLoading}
                                        name={field.name}
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        aria-invalid={fieldState.invalid}
                                        className="mt-3 flex gap-3"
                                    >
                                        <FieldLabel htmlFor="full-payment" className="block h-full">
                                            <div
                                                className={cn(
                                                    "flex h-full cursor-pointer items-start justify-between gap-4 rounded-lg border bg-background p-4 transition",
                                                    field.value === "Full"
                                                        ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                                                        : "hover:border-primary/40"
                                                )}
                                            >
                                                <div>
                                                    <p className="font-semibold">Full Payment</p>
                                                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                                        Pay the full amount now.
                                                    </p>
                                                    <p className="mt-3 text-sm font-bold text-primary">
                                                        {formatPeso(total)}
                                                    </p>
                                                </div>
                                                <RadioGroupItem
                                                    value="Full"
                                                    id="full-payment"
                                                    aria-invalid={fieldState.invalid}
                                                />
                                            </div>
                                        </FieldLabel>
                                        <FieldLabel htmlFor="partial-payment" className="block h-full">
                                            <div
                                                className={cn(
                                                    "flex h-full cursor-pointer items-start justify-between gap-4 rounded-lg border bg-background p-4 transition",
                                                    field.value === "Partial"
                                                        ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                                                        : "hover:border-primary/40"
                                                )}
                                            >
                                                <div>
                                                    <p className="font-semibold">50% Downpayment</p>
                                                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                                        Pay half now, balance on check-in.
                                                    </p>
                                                    <p className="mt-3 text-sm font-bold text-primary">
                                                        {formatPeso(partial)}
                                                    </p>
                                                </div>
                                                <RadioGroupItem
                                                    value="Partial"
                                                    id="partial-payment"
                                                    aria-invalid={fieldState.invalid}
                                                />
                                            </div>
                                        </FieldLabel>
                                    </RadioGroup>

                                    {fieldState.invalid && (
                                        <FieldError errors={getErrorMessages(fieldState.error)} />
                                    )}
                                </FieldSet>
                            )}
                        />
                    </FieldGroup>
                </GuestCard>

                <GuestCard className="p-4 md:p-5">
                    <FieldGroup>
                        <Controller
                            name="paymentMethodId"
                            control={control}
                            render={({ field, fieldState }) => (
                                <FieldSet aria-invalid={fieldState.invalid}>
                                    <FieldLegend className="gap-1 text-base font-bold">
                                        Payment Method <span className="text-red-700">*</span>
                                    </FieldLegend>

                                    {isLoadingMethods && (
                                        <p className="mt-3 text-sm text-muted-foreground">
                                            Loading payment methods...
                                        </p>
                                    )}

                                    {!isLoadingMethods && (!paymentMethods || paymentMethods.length === 0) && (
                                        <p className="mt-3 text-sm text-muted-foreground">
                                            No active payment methods are available right now.
                                        </p>
                                    )}

                                    {paymentMethods && paymentMethods.length > 0 && (
                                        <div className="mt-3 grid gap-2 sm:grid-cols-3">
                                            {paymentMethods.map((method) => {
                                                const isSelected = field.value === method.id;

                                                return (
                                                    <button
                                                        key={method.id}
                                                        type="button"
                                                        disabled={isLoading}
                                                        onClick={() => field.onChange(method.id)}
                                                        className={cn(
                                                            "rounded-lg border px-3 py-2 text-left text-sm transition",
                                                            isSelected
                                                                ? "border-primary bg-primary text-primary-foreground"
                                                                : "bg-background hover:border-primary/40"
                                                        )}
                                                    >
                                                        <span className="font-semibold">{method.name}</span>
                                                        <span
                                                            className={cn(
                                                                "mt-0.5 block text-xs",
                                                                isSelected
                                                                    ? "text-primary-foreground/80"
                                                                    : "text-muted-foreground"
                                                            )}
                                                        >
                                                            {method.type}
                                                        </span>
                                                    </button>
                                                );
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
                </GuestCard>

                {selectedMethod && (
                    <GuestCard className="p-4 md:p-5">
                        <h3 className="text-base font-bold tracking-normal">Transfer Details</h3>
                        <div className="mt-4 grid items-start gap-4 md:grid-cols-[150px_minmax(0,1fr)]">
                            <div className="self-start rounded-lg border bg-background p-2">
                                {selectedMethod.qrCodeUrl ? (
                                    <ViewPhotoDialog imageUrl={selectedMethod.qrCodeUrl}>
                                        <img
                                            src={selectedMethod.qrCodeUrl}
                                            alt={`${selectedMethod.name} QR code`}
                                            className="w-full rounded-md"
                                        />
                                    </ViewPhotoDialog>
                                ) : (
                                    <div className="flex h-32 items-center justify-center text-center text-xs text-muted-foreground">
                                        QR code not provided
                                    </div>
                                )}
                            </div>
                            <div className="space-y-4 text-sm">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                        Account name
                                    </p>
                                    <p className="mt-1 font-semibold">
                                        {selectedMethod.accountName || "-"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                        Account number
                                    </p>
                                    <p className="mt-1 font-semibold">
                                        {selectedMethod.accountNumber || "-"}
                                    </p>
                                </div>
                                {selectedMethod.instructions && (
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                            Instructions
                                        </p>
                                        <p className="mt-1 whitespace-pre-line leading-6 text-muted-foreground">
                                            {selectedMethod.instructions}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </GuestCard>
                )}

                <GuestCard className="p-4 md:p-5">
                    <FieldGroup>
                        <Controller
                            name="proofImageUrl"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel className="gap-1 text-base font-bold">
                                        Proof of Payment <span className="text-red-700">*</span>
                                    </FieldLabel>

                                    <div className="mt-3">
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
                                    </div>

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
                </GuestCard>
            </div>

            <aside className="lg:sticky lg:top-4 lg:self-start">
                <GuestCard accent className="p-4 md:p-5">
                    <h3 className="text-lg font-bold tracking-normal">Payment Summary</h3>
                    <GuestDivider className="my-4" />

                    <div className="space-y-3">
                        <PaymentSummaryLine label="Payment type" value={paymentType || "Not selected"} />
                        <PaymentSummaryLine label="Method" value={selectedMethod?.name || "Not selected"} />
                        <PaymentSummaryLine label="Total booking value" value={formatPeso(total)} />
                    </div>

                    <GuestDivider className="my-4" />

                    <div className="rounded-lg bg-primary/10 p-3">
                        <PaymentSummaryLine
                            label="Amount to pay now"
                            value={amountToPayNow ? formatPeso(amountToPayNow) : formatPeso(0)}
                            emphasize
                        />
                    </div>

                    <div className="mt-3 rounded-lg bg-muted/40 p-3">
                        <PaymentSummaryLine
                            label="Amount to pay later"
                            value={amountToPayLater ? formatPeso(amountToPayLater) : formatPeso(0)}
                        />
                    </div>

                    <p className="mt-4 text-xs leading-5 text-muted-foreground">
                        Submit your proof after transferring the amount. Staff will verify the payment before confirming your booking.
                    </p>

                    <div className="mt-5 space-y-2">
                        <Button
                            disabled={!paymentType || !paymentMethodId || !proofImageUrl || isLoading}
                            type="submit"
                            className="w-full"
                        >
                            {isLoading ? (
                                <LoadingSpinner />
                            ) : (
                                <>
                                    Submit Payment Proof
                                    <CheckCircle className="size-4" />
                                </>
                            )}
                        </Button>
                        <Button
                            disabled={isLoading}
                            type="button"
                            onClick={() => setBookingStep("review")}
                            variant="outline"
                            className="w-full"
                        >
                            Back to Review
                        </Button>
                    </div>
                </GuestCard>
            </aside>
        </div>
    );
};

export default PaymentForm;
