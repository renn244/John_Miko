import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { Textarea } from "@/components/ui/textarea";
import { useRejectPaymentMutation } from "@/features/admin/payments/hooks/useAdminPayments";
import { getErrorMessages } from "@/lib/getErrorMessages";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const RejectPaymentSchema = z.object({
    rejectionNote: z.string().trim().min(1, "A rejection reason is required"),
});

type RejectPaymentFormValues = z.infer<typeof RejectPaymentSchema>;

type RejectPaymentFormProps = {
    paymentId: string;
    onCancel: () => void;
    onSuccess: () => void;
};

const RejectPaymentForm = ({
    paymentId,
    onCancel,
    onSuccess,
}: RejectPaymentFormProps) => {
    const { control, handleSubmit } = useForm<RejectPaymentFormValues>({
        resolver: zodResolver(RejectPaymentSchema),
        defaultValues: { rejectionNote: "" },
        criteriaMode: "all",
    });
    const { mutateAsync: rejectPayment, isPending } = useRejectPaymentMutation(paymentId);

    const onSubmit = async ({ rejectionNote }: RejectPaymentFormValues) => {
        try {
            await rejectPayment(rejectionNote);
            onSuccess();
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to reject payment",
            );
        }
    };

    return (
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <p className="text-sm text-muted-foreground">
                Provide a reason for rejection. This will be shown to the guest.
            </p>

            <Controller
                name="rejectionNote"
                control={control}
                render={({ field, fieldState }) => (
                    <Field
                        data-invalid={fieldState.invalid}
                        className="grid gap-2"
                    >
                        <FieldLabel htmlFor={field.name}>
                            Rejection reason
                        </FieldLabel>
                        <Textarea
                            {...field}
                            id={field.name}
                            rows={4}
                            aria-invalid={fieldState.invalid}
                            placeholder="Explain why the payment proof was rejected..."
                        />
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
                    {isPending ? <LoadingSpinner /> : "Reject Payment"}
                </Button>
            </div>
        </form>
    );
};

export default RejectPaymentForm;
