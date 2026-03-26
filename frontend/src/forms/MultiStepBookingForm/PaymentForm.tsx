import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet, FieldTitle } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getErrorMessages } from "@/lib/getErrorMessages";
import { CheckCircle } from "lucide-react";
import { type Dispatch, type SetStateAction } from "react";
import { Controller, useFormContext } from "react-hook-form";
import type { multiStepBookingFormSchema } from "./MultiStepBookingForm";

type PaymentFormProps = {
    setBookingStep: Dispatch<SetStateAction<'form' | 'review' | 'payment'>>,
    total: number;
    isLoading: boolean;
}

const PaymentForm = ({ setBookingStep, total, isLoading }: PaymentFormProps) => {
    const { control, watch } = useFormContext<multiStepBookingFormSchema>();

    const partial = Math.round(total / 2);

    const amountToPayNow = watch('paymentType') && (watch('paymentType') === 'Full' ? total : partial);

    return (
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
                                            <span className="font-semibold text-base text-primary">
                                                ₱{total.toLocaleString()}
                                            </span>
                                        </FieldDescription>
                                    </FieldContent>
                                    <RadioGroupItem 
                                    value="Full" 
                                    id="full-payment"
                                    aria-invalid={fieldState.invalid}
                                    />
                                </Field>
                            </FieldLabel>
                            <FieldLabel htmlFor="partial-payment">
                                <Field data-invalid={fieldState.invalid} orientation="horizontal">
                                    <FieldContent>
                                        <FieldTitle>50% Downpayment</FieldTitle>
                                        <FieldDescription>
                                            Pay 50% now, remaining balance on check-in. <br />
                                            <span className="font-semibold text-base text-primary">
                                                ₱{partial.toLocaleString()}
                                            </span>
                                        </FieldDescription>
                                    </FieldContent>
                                    <RadioGroupItem 
                                    value="Partial" 
                                    id="partial-payment" 
                                    aria-invalid={fieldState.invalid}
                                    />
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

            {amountToPayNow && (
                <div className="p-4 rounded-xl border-2 border-primary/75 bg-primary/5">
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-lg">
                            Amount to Pay Now
                        </span>
                        <span className="font-bold text-xl text-primary">
                            ₱{amountToPayNow.toLocaleString()}
                        </span>
                    </div>
                </div>
            )}

            <div className="space-y-2">
                <Button 
                disabled={!watch('paymentType') || isLoading}
                type="submit" className="w-full">
                    <CheckCircle className="w-6 h-6" />
                    Confirm & Pay
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