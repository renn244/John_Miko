import { CloudinaryPreview } from "@/components/common/CloudinaryPreview";
import { CloudinaryUpload } from "@/components/common/CloudinaryUpload";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
} from "@/components/ui/field";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { Textarea } from "@/components/ui/textarea";
import { useRefundPaymentMutation } from "@/features/admin/payments/hooks/useAdminPayments";
import { getErrorMessages } from "@/lib/getErrorMessages";
import { formatPeso } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const RefundPaymentSchema = z.object({
    refundReason: z.string().trim().min(1, "A refund reason is required"),
    refundProofImageUrl: z.url("Refund proof is required"),
});

type RefundPaymentFormValues = z.infer<typeof RefundPaymentSchema>;

type RefundPaymentFormProps = {
    paymentId: string;
    amountPaid: number;
    onCancel: () => void;
    onSuccess: () => void;
};

const RefundPaymentForm = ({
    paymentId,
    amountPaid,
    onCancel,
    onSuccess,
}: RefundPaymentFormProps) => {
    const { control, handleSubmit } = useForm<RefundPaymentFormValues>({
        resolver: zodResolver(RefundPaymentSchema),
        defaultValues: { refundReason: "", refundProofImageUrl: "" },
        criteriaMode: "all",
    });
    const { mutateAsync: refundPayment, isPending } = useRefundPaymentMutation(paymentId);

    const onSubmit = async (data: RefundPaymentFormValues) => {
        try {
            await refundPayment(data);
            onSuccess();
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to record refund",
            );
        }
    };

    return (
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <p className="text-sm text-muted-foreground">
                Confirm that {formatPeso(amountPaid)} has been returned to the
                guest. This records the refund; it does not send money through a
                payment provider.
            </p>

            <Controller
                name="refundReason"
                control={control}
                render={({ field, fieldState }) => (
                    <Field
                        data-invalid={fieldState.invalid}
                        className="grid gap-2"
                    >
                        <FieldLabel htmlFor={field.name}>
                            Refund reason
                        </FieldLabel>
                        <Textarea
                            {...field}
                            id={field.name}
                            rows={4}
                            aria-invalid={fieldState.invalid}
                            placeholder="Explain why the payment was refunded..."
                        />
                        {fieldState.error && (
                            <FieldError
                                errors={getErrorMessages(fieldState.error)}
                            />
                        )}
                    </Field>
                )}
            />

            <Controller
                name="refundProofImageUrl"
                control={control}
                render={({ field, fieldState }) => (
                    <Field
                        data-invalid={fieldState.invalid}
                        className="grid gap-2"
                    >
                        <FieldLabel>
                            Refund proof{" "}
                            <span className="text-destructive">*</span>
                        </FieldLabel>
                        <FieldDescription>
                            Upload the receipt or screenshot confirming the
                            return of funds.
                        </FieldDescription>
                        {field.value ? (
                            <CloudinaryPreview
                                images={[{ url: field.value }]}
                                itemClassName="max-w-44"
                                onRemove={() => field.onChange("")}
                            />
                        ) : (
                            <CloudinaryUpload
                                purpose="REFUND_PROOF"
                                onSuccess={field.onChange}
                            />
                        )}
                        {fieldState.error && (
                            <FieldError
                                errors={getErrorMessages(fieldState.error)}
                            />
                        )}
                    </Field>
                )}
            />

            <div className="flex items-center justify-end gap-2">
                <Button variant="outline" type="button" onClick={onCancel}>
                    Cancel
                </Button>
                <Button
                    variant="destructive"
                    type="submit"
                    disabled={isPending}
                >
                    {isPending ? <LoadingSpinner /> : "Record Refund"}
                </Button>
            </div>
        </form>
    );
};

export default RefundPaymentForm;
