import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessages } from "@/lib/getErrorMessages";
import type { Accommodation } from "@/types/admin/accommodation.type";
import { ArrowRight, Minus, Plus, Users } from "lucide-react";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import { Controller, useFormContext } from "react-hook-form";
import type { multiStepBookingFormSchema } from "./MultiStepBookingForm";

type GuestFormProps = {
    accommodation: Accommodation,
    selectedStayType: 'OverNight' | 'DayStay',
    selectedCheckIn: Date,
    selectedCheckOut: Date,
    setBookingStep: Dispatch<SetStateAction<'form' | 'review'  | 'pre-order' | 'payment'>>,
}

const GuestForm =  ({ accommodation, selectedStayType, selectedCheckIn, selectedCheckOut, setBookingStep }: GuestFormProps) => {
    const { control, watch, reset, getValues, setError, setValue, trigger } = useFormContext<multiStepBookingFormSchema>();

    const adultGuests = watch('adultGuests'); 
    const seniorGuests = watch('seniorGuests');
    const kidGuests = watch('kidGuests'); 

    const adultFee = watch('stayType') === 'DayStay' ? 150 : 180; // full price
    const seniorFee = adultFee - (adultFee * 0.20); // 20 percent discount
    const kidsFee = 100 // just a kid 4-7 years old

    useEffect(() => {
        // set the numberof guests based on the sum of adult, senior, and kid guests
        const totalGuests = (adultGuests || 0) + (seniorGuests || 0) + (kidGuests || 0);
        setValue('numberOfGuests', totalGuests);

    }, [adultGuests, seniorGuests, kidGuests])

    const calculateGuestFee = (adultGuests: number, seniorGuests: number, kidGuests: number) => {
        const adultTotal = adultGuests * adultFee;
        const seniorTotal = seniorGuests * seniorFee;
        const kidsTotal = kidGuests * kidsFee; 

        return { adultTotal, seniorTotal, kidsTotal };
    }
 
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
        setBookingStep('pre-order')
    }
    
    return (
        <div className="space-y-6">

            <div className="space-y-4">
                <h3 className="font-bold text-lg">
                    Guest Information
                </h3>

                <div className="flex gap-4">
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
                </div>

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
                name="adultGuests"
                control={control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="grid gap-2">
                        <FieldLabel htmlFor={field.name} className="gap-1">
                            Number of Guests<span className="text-red-700">*</span>
                        </FieldLabel>

                        <div className="flex items-center justify-between p-3 rounded-md bg-muted">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 mx-1">
                                    <Users className="w-4 h-4 text-primary" />
                                    <span className="text-sm font-semibold">Adult</span>
                                </div>
                                <FieldDescription className="text-xs">₱{adultFee} per person</FieldDescription>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => field.onChange(Math.max(0, (field.value || 0) - 1))}
                                >
                                    <Minus className="w-4 h-4" />
                                </Button>
                                <span className="text-sm font-bold w-6 text-center">{field.value || 0}</span>
                                <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => field.onChange((field.value || 0) + 1)}
                                >
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {fieldState.invalid && (
                            <FieldError errors={getErrorMessages(fieldState.error)} />
                        )}
                    </Field>
                )}
                />

                <Controller
                name="seniorGuests"
                control={control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="grid gap-2">
                        <div className="flex items-center justify-between p-3 rounded-md bg-muted">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 mx-1">
                                    <Users className="w-4 h-4 text-amber-600" />
                                    <span className="text-sm font-semibold">Senior</span>
                                </div>
                                <FieldDescription className="text-xs">₱{seniorFee} per senior (60+ years old)</FieldDescription>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => field.onChange(Math.max(0, (field.value || 0) - 1))}
                                >
                                    <Minus className="w-4 h-4" />
                                </Button>
                                <span className="text-sm font-bold w-6 text-center">{field.value || 0}</span>
                                <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => field.onChange((field.value || 0) + 1)}
                                >
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {fieldState.invalid && (
                            <FieldError errors={getErrorMessages(fieldState.error)} />
                        )}
                    </Field>
                )}
                />

                <Controller
                name="kidGuests"
                control={control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="grid gap-2">
                        <div className="flex items-center justify-between p-3 rounded-md bg-muted">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 mx-1">
                                    <Users className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm font-semibold">Kid</span>
                                </div>
                                <FieldDescription className="text-xs">₱{kidsFee} per kid (4-7 years old)</FieldDescription>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => field.onChange(Math.max(0, (field.value || 0) - 1))}
                                >
                                    <Minus className="w-4 h-4" />
                                </Button>
                                <span className="text-sm font-bold w-6 text-center">{field.value || 0}</span>
                                <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => field.onChange((field.value || 0) + 1)}
                                >
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

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

                        <Input
                        id={field.name}
                        type="number"
                        min="1"
                        max={accommodation.capacity}
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber || "")}
                        readOnly
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