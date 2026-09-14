import { GuestCard, GuestDivider, GuestInfoChip } from "@/features/public/layout/components/guest";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessages } from "@/lib/getErrorMessages";
import { formatStayOptionRange } from "@/lib/stayOptionTime";
import { formatPeso } from "@/lib/utils";
import type { Accommodation } from "@/features/shared/accommodations/types/accommodation.type";
import { ArrowRight, CalendarDays, Clock, Home, Minus, Plus, Users } from "lucide-react";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import { Controller, useFormContext } from "react-hook-form";
import type { multiStepBookingFormSchema } from "./MultiStepBookingForm";

type GuestFormProps = {
    accommodation: Accommodation,
    selectedStayType: string,
    selectedStayCode?: string,
    selectedCheckIn: Date,
    selectedCheckOut: Date,
    setBookingStep: Dispatch<SetStateAction<'form' | 'add-on' | 'review'  | 'pre-order' | 'payment'>>,
}

const GuestForm =  ({
    accommodation,
    selectedStayType,
    selectedStayCode,
    selectedCheckIn,
    selectedCheckOut,
    setBookingStep
}: GuestFormProps) => {
    const { control, watch, reset, getValues, setError, setValue, trigger } = useFormContext<multiStepBookingFormSchema>();

    const adultGuests = watch('adultGuests'); 
    const seniorGuests = watch('seniorGuests');
    const kidGuests = watch('kidGuests'); 
    const totalGuests = (adultGuests || 0) + (seniorGuests || 0) + (kidGuests || 0);

    const adultFee = selectedStayCode?.toLowerCase() === 'daystay' ? 150 : 180; // full price
    const seniorFee = adultFee - (adultFee * 0.20); // 20 percent discount
    const kidsFee = 100 // just a kid 4-7 years old

    const selectedStayOption = accommodation.stayOptions?.find((option) => option.code === selectedStayCode);
    const checkInLabel = selectedCheckIn.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const checkOutLabel = selectedCheckOut.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const checkInTime = selectedCheckIn.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    const checkOutTime = selectedCheckOut.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    const staySchedule = selectedStayOption?.startTime && selectedStayOption?.endTime
        ? formatStayOptionRange(selectedStayOption)
        : selectedStayOption?.durationHours
            ? `${selectedStayOption.durationHours} hours`
            : "Schedule shown during booking";

    useEffect(() => {
        // set the numberof guests based on the sum of adult, senior, and kid guests
        const totalGuests = (adultGuests || 0) + (seniorGuests || 0) + (kidGuests || 0);
        setValue('numberOfGuests', totalGuests);

    }, [adultGuests, seniorGuests, kidGuests, setValue])

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
        setBookingStep('add-on')
    }
    
    return (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="space-y-4">
                <GuestCard className="p-4 md:p-5">
                    <h3 className="text-base font-bold">Guest Details</h3>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
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

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
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
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">
                        Used only for booking updates and urgent resort contact.
                    </p>
                </GuestCard>

                <GuestCard className="p-4 md:p-5">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h3 className="text-base font-bold">Guest Count</h3>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Entrance fees are based on guest type.
                            </p>
                        </div>
                        <GuestInfoChip className="shrink-0">
                            Max {accommodation.capacity}
                        </GuestInfoChip>
                    </div>

                    <div className="mt-4 space-y-3">
                        <Controller
                        name="adultGuests"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="grid gap-2">
                                <div className="flex items-center justify-between rounded-lg bg-muted/60 p-3">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Users className="size-4 text-primary" />
                                            <span className="text-sm font-semibold">Adults</span>
                                        </div>
                                        <FieldDescription className="text-xs">{formatPeso(adultFee)} per person</FieldDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                        type="button"
                                        variant="outline"
                                        size="icon-sm"
                                        onClick={() => field.onChange(Math.max(0, (field.value || 0) - 1))}
                                        >
                                            <Minus className="size-4" />
                                        </Button>
                                        <span className="w-7 text-center text-sm font-bold">{field.value || 0}</span>
                                        <Button
                                        type="button"
                                        variant="outline"
                                        size="icon-sm"
                                        onClick={() => field.onChange((field.value || 0) + 1)}
                                        >
                                            <Plus className="size-4" />
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
                                <div className="flex items-center justify-between rounded-lg bg-muted/60 p-3">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Users className="size-4 text-primary" />
                                            <span className="text-sm font-semibold">Seniors</span>
                                        </div>
                                        <FieldDescription className="text-xs">{formatPeso(seniorFee)} per senior (60+)</FieldDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                        type="button"
                                        variant="outline"
                                        size="icon-sm"
                                        onClick={() => field.onChange(Math.max(0, (field.value || 0) - 1))}
                                        >
                                            <Minus className="size-4" />
                                        </Button>
                                        <span className="w-7 text-center text-sm font-bold">{field.value || 0}</span>
                                        <Button
                                        type="button"
                                        variant="outline"
                                        size="icon-sm"
                                        onClick={() => field.onChange((field.value || 0) + 1)}
                                        >
                                            <Plus className="size-4" />
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
                                <div className="flex items-center justify-between rounded-lg bg-muted/60 p-3">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Users className="size-4 text-primary" />
                                            <span className="text-sm font-semibold">Kids</span>
                                        </div>
                                        <FieldDescription className="text-xs">{formatPeso(kidsFee)} per kid (4-7)</FieldDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                        type="button"
                                        variant="outline"
                                        size="icon-sm"
                                        onClick={() => field.onChange(Math.max(0, (field.value || 0) - 1))}
                                        >
                                            <Minus className="size-4" />
                                        </Button>
                                        <span className="w-7 text-center text-sm font-bold">{field.value || 0}</span>
                                        <Button
                                        type="button"
                                        variant="outline"
                                        size="icon-sm"
                                        onClick={() => field.onChange((field.value || 0) + 1)}
                                        >
                                            <Plus className="size-4" />
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
                                type="hidden"
                                min="1"
                                max={accommodation.capacity}
                                {...field}
                                onChange={(e) => field.onChange(e.target.valueAsNumber || "")}
                                readOnly
                                />

                                <div className="flex items-center justify-between rounded-lg bg-primary/5 px-4 py-3">
                                    <div>
                                        <p className="text-sm font-semibold">Total Guests</p>
                                        <p className="text-xs text-muted-foreground">Maximum capacity: {accommodation.capacity}</p>
                                    </div>
                                    <p className="text-2xl font-extrabold">{totalGuests}</p>
                                </div>

                                {fieldState.invalid && (
                                    <FieldError errors={getErrorMessages(fieldState.error)} />
                                )}
                            </Field>
                        )}
                        />
                    </div>
                </GuestCard>

                <GuestCard className="p-4 md:p-5">
                    <h3 className="text-base font-bold">Special Requests</h3>
                    <div className="mt-4">
                        <Controller 
                        name="specialRequest"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field aria-invalid={fieldState.invalid} className="grid gap-2">
                                <FieldLabel htmlFor={field.name} className="gap-1">
                                    Any specific needs? <span className="text-muted-foreground">(Optional)</span>
                                </FieldLabel>
                                <Textarea
                                id={field.name}
                                className="min-h-28 resize-y"
                                placeholder="Let us know if you need early check-in, accessibility support, or notes for your stay..."
                                aria-invalid={fieldState.invalid}
                                {...field}
                                />

                                <FieldDescription>
                                    These notes help the resort prepare, but they may still depend on availability.
                                </FieldDescription>
                                {fieldState.invalid && (
                                    <FieldError errors={getErrorMessages(fieldState.error)} />
                                )}
                            </Field>
                        )}
                        />
                    </div>
                </GuestCard>
            </div>

            <aside className="space-y-3 lg:sticky lg:top-24 lg:self-start">
                <GuestCard padded={false} className="overflow-hidden">
                    <div className="aspect-[16/9] bg-muted">
                        <img
                        src={accommodation.imageUrl}
                        alt={accommodation.name}
                        className="size-full object-cover"
                        />
                    </div>
                    <div className="p-4 md:p-5">
                        <div className="flex flex-wrap gap-2">
                            <GuestInfoChip>
                                <Home className="size-3.5" />
                                {accommodation.type === "EventHall" ? "Event Hall" : accommodation.type}
                            </GuestInfoChip>
                            <GuestInfoChip>
                                <Users className="size-3.5" />
                                Up to {accommodation.capacity}
                            </GuestInfoChip>
                        </div>

                        <h3 className="mt-4 text-xl font-bold">{accommodation.name}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{selectedStayType}</p>

                        <GuestDivider className="my-4" />

                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="rounded-lg bg-muted/60 p-3">
                                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    <CalendarDays className="size-3.5" />
                                    Check-in
                                </div>
                                <p className="mt-2 font-semibold">{checkInLabel}</p>
                                <p className="text-xs text-muted-foreground">{checkInTime}</p>
                            </div>
                            <div className="rounded-lg bg-muted/60 p-3">
                                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    <CalendarDays className="size-3.5" />
                                    Check-out
                                </div>
                                <p className="mt-2 font-semibold">{checkOutLabel}</p>
                                <p className="text-xs text-muted-foreground">{checkOutTime}</p>
                            </div>
                        </div>

                        <div className="mt-3 flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm">
                            <Clock className="size-4 text-primary" />
                            <span className="font-medium">{staySchedule}</span>
                        </div>

                        <GuestDivider className="my-4" />

                        <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-muted-foreground">Base rate</span>
                                <span className="font-semibold">{formatPeso(accommodation.price)}</span>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-muted-foreground">Adult</span>
                                <span>{formatPeso(adultFee)}</span>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-muted-foreground">Senior</span>
                                <span>{formatPeso(seniorFee)}</span>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-muted-foreground">Kid</span>
                                <span>{formatPeso(kidsFee)}</span>
                            </div>
                        </div>
                    </div>
                </GuestCard>

                <Button type="button" className="w-full" onClick={() => validateStep()}>
                    Continue to Add-ons
                    <ArrowRight className="size-4" />
                </Button>
            </aside>
        </div>
    )
}

export default GuestForm;
