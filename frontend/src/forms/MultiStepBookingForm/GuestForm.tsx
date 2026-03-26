import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessages } from "@/lib/getErrorMessages";
import type { Accommodation } from "@/types/admin/accommodation.type";
import { ArrowRight } from "lucide-react";
import { type Dispatch, type SetStateAction } from "react";
import { Controller, useFormContext } from "react-hook-form";
import type { multiStepBookingFormSchema } from "./MultiStepBookingForm";

type GuestFormProps = {
    accommodation: Accommodation,
    selectedStayType: 'OverNight' | 'DayStay',
    selectedCheckIn: Date,
    selectedCheckOut: Date,
    setBookingStep: Dispatch<SetStateAction<'form' | 'review' | 'payment'>>,
}

const GuestForm =  ({ accommodation, selectedStayType, selectedCheckIn, selectedCheckOut, setBookingStep }: GuestFormProps) => {
    const { control, watch, reset, getValues, setError, trigger } = useFormContext<multiStepBookingFormSchema>();

    const validateStep = async () => {
        const isValid = await trigger(["firstName", "lastName", "email", "contactNo", "numberOfGuests"]);
        
        if(watch('numberOfGuests') > accommodation.capacity) {
            setError('numberOfGuests', {
                type: 'manual',
                message: `Maximum ${accommodation.capacity} guests allowed`
            });
            return;
        }
        
        if(!isValid) return;

        reset({ ...getValues() }, { keepValues: true });
        setBookingStep('review')
    }
    
    return (
        <div className="space-y-6">

            <div className="p-2 rounded-md bg-muted">
                <h3 className="font-bold mb-3">
                    Your Selection
                </h3>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Accommodation:</span>
                        <span className="font-semibold">
                            {accommodation.name}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Stay Type:</span>
                        <span className="font-semibold">
                            {selectedStayType === 'OverNight' ? 'Over Night' : 'Day Stay'}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Check-in:</span>
                        <span className="font-semibold">
                            {selectedCheckIn.toLocaleString('en-PH', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                minute: '2-digit',
                                hour: '2-digit',
                                hour12: true,
                            })}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Check-out:</span>
                        <span className="font-semibold">
                            {selectedCheckOut.toLocaleString('en-PH', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                minute: '2-digit',
                                hour: '2-digit',
                                hour12: true,
                            })}
                        </span>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="font-bold text-lg">
                    Personal Information
                </h3>

                <Controller 
                name="firstName"
                control={control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="grid gap-2">
                        <FieldLabel htmlFor={field.name} className="gap-1">
                            First Name<span className="text-red-700">*</span>
                        </FieldLabel>

                        <Input
                        id={field.name}
                        placeholder="Juan"
                        aria-invalid={fieldState.invalid}
                        {...field}
                        />

                        {fieldState.invalid && (
                            <FieldError errors={getErrorMessages(fieldState.error)} />
                        )}
                    </Field>
                )}
                />

                <Controller 
                name="lastName"
                control={control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="grid gap-2">
                        <FieldLabel htmlFor={field.name} className="gap-1">
                            Last Name<span className="text-red-700">*</span>
                        </FieldLabel>
                        <Input
                        id={field.name}
                        placeholder="Dela Cruz"
                        aria-invalid={fieldState.invalid}
                        {...field}
                        />

                        {fieldState.invalid && (
                            <FieldError errors={getErrorMessages(fieldState.error)} />
                        )}
                    </Field>
                )}
                />

                <Controller 
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                     <Field data-invalid={fieldState.invalid} className="grid gap-2">
                        <FieldLabel htmlFor={field.name} className="gap-1">
                            Email Address<span className="text-red-700">*</span>
                        </FieldLabel>
                        <Input
                        id={field.name}
                        placeholder="juan@example.com"
                        aria-invalid={fieldState.invalid}
                        {...field}
                        />

                        {fieldState.invalid && (
                            <FieldError errors={getErrorMessages(fieldState.error)} />
                        )}
                    </Field>
                )}
                />

                <Controller 
                name="contactNo"
                control={control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="grid gap-2">
                        <FieldLabel htmlFor={field.name} className="gap-1">
                            Phone Number<span className="text-red-700">*</span>
                        </FieldLabel>
                        <Input
                        id={field.name}
                        placeholder="+639613675611"
                        aria-invalid={fieldState.invalid}
                        {...field}
                        />

                        {fieldState.invalid && (
                            <FieldError errors={getErrorMessages(fieldState.error)} />
                        )}
                    </Field>
                )}
                />

                <Controller
                name="numberOfGuests" 
                control={control}
                render={({ field, fieldState }) => (
                    <Field aria-invalid={fieldState.invalid} className="grid gap-2">
                        <FieldLabel htmlFor={field.name} className="gap-1">
                            Number of Guests<span className="text-red-700">*</span>
                        </FieldLabel>
                        <Input
                        id={field.name}
                        type="number"
                        min="1"
                        max={accommodation.capacity}
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber || "")}
                        />

                        <FieldDescription>Maximum {accommodation.capacity} guests</FieldDescription>

                        {fieldState.invalid && (
                            <FieldError errors={getErrorMessages(fieldState.error)} />
                        )}
                    </Field>
                )}
                />

                <Controller 
                name="specialRequest"
                control={control}
                render={({ field, fieldState }) => (
                    <Field aria-invalid={fieldState.invalid} className="grid gap-2">
                        <FieldLabel htmlFor={field.name} className="gap-1">
                            Special Requests <span className="text-muted-foreground">(Optional)</span>
                        </FieldLabel>
                        <Textarea
                        id={field.name}
                        className="max-h-30" rows={4}
                        placeholder="Any special requests or notes..."
                        aria-invalid={fieldState.invalid}
                        {...field}
                        />

                        <FieldDescription>
                            Let us know if you have any special requests, such as late check-in, accessibility needs, or special occasions.
                        </FieldDescription>
                        {fieldState.invalid && (
                            <FieldError errors={getErrorMessages(fieldState.error)} />
                        )}
                    </Field>
                )}
                />

                <Button type="button" className="w-full" onClick={() => validateStep()}>
                    Continue to Review
                    <ArrowRight className="w-6 h-6" />
                </Button>
            </div>
        </div>
    )
}

export default GuestForm;