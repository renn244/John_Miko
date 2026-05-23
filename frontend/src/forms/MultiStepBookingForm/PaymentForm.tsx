import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet, FieldTitle } from "@/components/ui/field";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getErrorMessages } from "@/lib/getErrorMessages";
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

    const partial = Math.round(total / 2);
    const amountToPayNow = watch('paymentType') && (watch('paymentType') === 'Full' ? total : partial);
    const amountToPayLater = watch('paymentType') && (watch('paymentType') === 'Full' ? 0 : total - partial);

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
                disabled={!watch('paymentType') || isLoading}
                type="submit" className="w-full">
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            Confirm & Pay
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