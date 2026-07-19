import AvailabilityCalendar from "@/components/common/AvailabilityCalendar";
import AvailabilityStayType from "@/components/common/AvailabilityStayType";
import { CloudinaryPreview } from "@/components/common/CloudinaryPreview";
import { CloudinaryUpload } from "@/components/common/CloudinaryUpload";
import FormSection from "@/components/common/FormSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useGetAccommodationsQuery } from "@/hooks/admin/accommodation.hook";
import { useCreateBookingAdminMutation } from "@/hooks/admin/booking.hook";
import { isSameDateOnly } from "@/lib/date.util";
import { getErrorMessages } from "@/lib/getErrorMessages";
import { handleNestError, ValidationError } from "@/lib/handleNestError";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, CheckCircle, Minus, Plus, Users } from "lucide-react";
import { useState } from "react";
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import ManualAddOnSelector from "./ManualAddOnSelector";
import { ManualBookingSchema, type ManualBookingFormValues } from "./manualBooking.schema";
import ManualPreOrderSelector from "./ManualPreOrderSelector";

const ManualBookingForm = () => {
    const navigate = useNavigate();
    const [addOnSubtotal, setAddOnSubtotal] = useState(0);
    const [preOrderSubtotal, setPreOrderSubtotal] = useState(0);
    const form = useForm<ManualBookingFormValues>({
        resolver: zodResolver(ManualBookingSchema),
        defaultValues: {
            name: "",
            email: "",
            contactNo: "",
            adultGuests: 1,
            seniorGuests: 0,
            kidGuests: 0,
            specialRequest: "",
            proofImageUrl: "",
            accommodationId: "",
            checkIn: undefined,
            stayOptionId: undefined,
            addOnServices: [],
            preOrderItems: [],
            paymentType: undefined
        },
        criteriaMode: "all"
    });
    const {
        control,
        handleSubmit,
        setError,
        resetField
    } = form;
    const { mutateAsync: createBooking, isPending } = useCreateBookingAdminMutation();

    const { data: accommodations } = useGetAccommodationsQuery({ page: 1, limit: 100 });

    const selectedAccommodationId = useWatch({ control, name: 'accommodationId' });
    const selectedCheckInDate = useWatch({ control, name: 'checkIn' });
    const selectedStayOptionId = useWatch({ control, name: 'stayOptionId' });
    const selectedPaymentType = useWatch({ control, name: 'paymentType' });
    const selectedAdultGuests = useWatch({ control, name: 'adultGuests' });
    const selectedSeniorGuests = useWatch({ control, name: 'seniorGuests' });
    const selectedKidGuests = useWatch({ control, name: 'kidGuests' });
    const selectedNumberOfGuests = selectedAdultGuests + selectedSeniorGuests + selectedKidGuests;

    const isAccommodationSelected = !!selectedAccommodationId;

    const onSubmit = async (data: ManualBookingFormValues) => {
        const numberOfGuests = data.adultGuests + data.seniorGuests + data.kidGuests;

        if(selectedAccommodation && numberOfGuests > selectedAccommodation.capacity) {
            setError('adultGuests', {
                type: 'manual',
                message: `Maximum capacity for ${selectedAccommodation.name} is ${selectedAccommodation.capacity} guests`
            })
            return;
        }

        try {
            const booking = await createBooking({
                accommodationId: data.accommodationId,
                name: data.name.trim(),
                email: data.email.trim().toLowerCase(),
                contactNo: data.contactNo.trim(),
                adultGuests: data.adultGuests,
                seniorGuests: data.seniorGuests,
                kidGuests: data.kidGuests,
                specialRequest: data.specialRequest?.trim() || undefined,
                proofImageUrl: data.proofImageUrl || undefined,
                addOnServices: data.addOnServices.map(({ addOnServiceId, quantity }) => ({
                    addOnServiceId,
                    quantity,
                })),
                preOrderItems: data.preOrderItems.map(({ menuItemId, quantity }) => ({
                    menuItemId,
                    quantity,
                })),
                checkIn: data.checkIn,
                stayOptionId: data.stayOptionId,
                paymentType: data.paymentType,
            });

            toast.success("Booking created successfully");
            navigate(`/admin/booking/${booking.id}`);
        } catch (error: unknown) {
            if(error instanceof ValidationError) {
                handleNestError(error.response, setError);
                return;
            }

            toast.error(error instanceof Error ? error.message : "Failed to create booking");
        }
    }

    const selectedAccommodation = accommodations?.data.find((acc) => acc.id === selectedAccommodationId);
    const selectedStayOption = selectedAccommodation?.stayOptions.find((option) => option.id === selectedStayOptionId);

    const accommodationPrice = selectedAccommodation?.price || 0;
    const adultGuestFee = selectedStayOption?.code.toLowerCase() === 'daystay' ? 150 : 180;
    const seniorGuestFee = adultGuestFee * 0.8;
    const kidGuestFee = 100;
    const guestFee = selectedAccommodation?.isGuestFeeWaived || !selectedStayOption
        ? 0
        : (selectedAdultGuests * adultGuestFee)
            + (selectedSeniorGuests * seniorGuestFee)
            + (selectedKidGuests * kidGuestFee);
    const totalAmount = accommodationPrice + guestFee + addOnSubtotal + preOrderSubtotal;
    const amountToPayNow = selectedPaymentType
        ? selectedPaymentType === "Partial"
            ? Math.round(totalAmount / 2)
            : totalAmount
        : 0;

    return (
        <FormProvider {...form}>
        <form
        className="space-y-5"
        onSubmit={handleSubmit(onSubmit)}
        >
                <FormSection title="Guest Information" contentClassName="space-y-5">

                        <Controller 
                        name="name"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="grid gap-2">
                                <FieldLabel htmlFor={field.name} className="gap-1">
                                    Guest Name <span className="text-red-700">*</span>
                                </FieldLabel>

                                <Input 
                                id={field.name}
                                aria-invalid={fieldState.invalid}
                                type="text"
                                placeholder="Enter guest name"
                                {...field}
                                />

                                {fieldState.invalid && (
                                    <FieldError errors={getErrorMessages(fieldState.error)} />
                                )}
                            </Field>
                        )}
                        />

                        <div className="grid md:grid-cols-2 gap-5 md:gap-3">

                            <Controller 
                            name="email"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className="grid gap-2">
                                    <FieldLabel htmlFor={field.name} className="gap-1">
                                        Email Address <span className="text-red-700">*</span>
                                    </FieldLabel>

                                    <Input 
                                    id={field.name}
                                    aria-invalid={fieldState.invalid}
                                    placeholder="guest@example.com"
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
                                        Phone Number <span className="text-red-700">*</span>
                                    </FieldLabel>

                                    <Input 
                                    id={field.name}
                                    aria-invalid={fieldState.invalid}
                                    placeholder="09-XXX-XXX-XXX"
                                    {...field}
                                    />

                                    {fieldState.invalid && (
                                        <FieldError errors={getErrorMessages(fieldState.error)} />
                                    )}
                                </Field>
                            )}
                            />

                        </div>

                </FormSection>

                <FormSection title="Stay Details" contentClassName="space-y-5">
                        
                        <Controller 
                        name="accommodationId"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="grid gap-2">
                                <FieldLabel htmlFor={field.name} className="gpa-1">
                                    Choose Accommodation <span className="text-red-700">*</span>
                                </FieldLabel>

                                <RadioGroup 
                                name={field.name}
                                value={field.value}
                                onValueChange={(value) => {
                                    resetField('checkIn')
                                    resetField('stayOptionId')
                                    field.onChange(value)
                                }}
                                aria-invalid={fieldState.invalid}
                                className="grid md:grid-cols-2 gap-3"
                                >
                                    {accommodations?.data.map((acc) => (
                                        <FieldLabel key={acc.id} className="gap-0 has-[>[data-slot=field]]:border [&>*]:data-[slot=field]:pb-2">
                                            <Field orientation="horizontal">
                                                <FieldContent>
                                                    <FieldTitle className="w-full">
                                                        {acc.name}
                                                        <Badge>
                                                            {acc.type}
                                                        </Badge>
                                                    </FieldTitle>
                                                    <FieldDescription className="line-clamp-1">
                                                        {acc.description}
                                                    </FieldDescription>
                                                </FieldContent>

                                                <RadioGroupItem 
                                                value={acc.id}
                                                id={`form-rhf-radiogroup-${acc.id}`}
                                                />
                                            </Field>
                                            <div className="flex items-center justify-between text-xs p-4 pt-2 w-full border-t">
                                                <div className="flex items-center gap-1 text-muted-foreground">
                                                    <Users className="h-3.5 w-3.5" />
                                                    Up to {acc.capacity}
                                                </div>
                                                <div className="font-bold text-primary">
                                                    ₱{acc.price.toLocaleString()}/stay
                                                </div>
                                            </div>
                                        </FieldLabel>
                                    ))}
                                </RadioGroup>

                                {fieldState.invalid && (
                                    <FieldError errors={getErrorMessages(fieldState.error)} />
                                )}
                            </Field>        
                        )}
                        />

                        {selectedAccommodation && (
                            <div className="p-3 rounded-lg border-2 bg-green-50 border-green-600">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    <span className="text-sm font-semibold text-green-600">
                                        Selected: {selectedAccommodation.name} - ₱{selectedAccommodation.price.toLocaleString()}/stay (Max: {selectedAccommodation.capacity} guests)
                                    </span>
                                </div>
                            </div>
                        )}

                    <div className="space-y-5">
                         
                        <div className="grid gap-5">
                            
                            <Controller
                            name="checkIn"
                            control={control} 
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className="grid gap-2">
                                    <FieldLabel>
                                        Check-in Date <span className="text-red-700">*</span>
                                    </FieldLabel>

                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button 
                                            aria-invalid={fieldState.invalid}
                                            variant="outline" 
                                            className="w-70 justify-start text-left data=[empty=true]:text-muted-foreground"
                                            >
                                                <CalendarIcon />
                                                {field.value ? format(new Date(field.value), "PPP") : "Pick a date"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <AvailabilityCalendar
                                            accommodationId={selectedAccommodationId}
                                            mode="single" 
                                            aria-invalid={fieldState.invalid}
                                            {...field}
                                            selected={field.value}
                                            onSelect={(date) => {
                                                if(date && !isSameDateOnly(date, new Date(field.value))) {
                                                    resetField('stayOptionId')
                                                }
                                                field.onChange(date)
                                            }}
                                            />
                                        </PopoverContent>
                                    </Popover>

                                    {fieldState.invalid && (
                                        <FieldError errors={getErrorMessages(fieldState.error)} />
                                    )}
                                </Field>
                            )}
                            />

                        </div>

                        <FieldGroup>
                            <Controller
                            name="stayOptionId"
                            control={control}
                            render={({ field, fieldState }) => (
                                <FieldSet data-invalid={fieldState.invalid} className="grid gap-2">
                                    <FieldLegend data-invalid={fieldState.invalid} className="gap-1 data-[invalid=true]:text-destructive" variant="label">
                                        Stay Option <span className="text-red-700">*</span>
                                    </FieldLegend>
                                    
                                    {!selectedAccommodationId ? (
                                        <div className="rounded-lg border border-dashed px-3 py-2 text-sm text-muted-foreground">
                                            Choose an accommodation and check-in date first to view stay options.
                                        </div>
                                    ) : !selectedCheckInDate ? (
                                        <div className="rounded-lg border border-dashed px-3 py-2 text-sm text-muted-foreground">
                                            Pick a check-in date first to view available stay options.
                                        </div>
                                    ) : (
                                        <AvailabilityStayType
                                        key={selectedCheckInDate.toISOString()}
                                        checkInDate={selectedCheckInDate}
                                        accommodationId={selectedAccommodationId}
                                        {...field}
                                        name={field.name}
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        invalid={fieldState.invalid}
                                        />
                                    )}

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </FieldSet>
                            )}
                            />
                        </FieldGroup>

                        <FieldSet className="grid gap-3">
                            <FieldLegend variant="label">
                                Guest Breakdown <span className="text-red-700">*</span>
                            </FieldLegend>
                            <FieldDescription>
                                Entrance fees are based on guest type. Maximum capacity: {selectedAccommodation?.capacity ?? "Select an accommodation"}.
                            </FieldDescription>

                            <div className="grid gap-3 md:grid-cols-3">
                                <Controller
                                name="adultGuests"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className="rounded-lg border p-3">
                                        <div className="space-y-1">
                                            <FieldLabel>Adults</FieldLabel>
                                            <FieldDescription>₱{adultGuestFee} per person</FieldDescription>
                                        </div>
                                        <div className="mt-3 flex items-center justify-between gap-2">
                                            <Button type="button" variant="outline" size="icon" aria-label="Decrease adults" onClick={() => field.onChange(Math.max(0, field.value - 1))}>
                                                <Minus className="size-4" />
                                            </Button>
                                            <span className="w-8 text-center font-bold">{field.value}</span>
                                            <Button type="button" variant="outline" size="icon" aria-label="Increase adults" onClick={() => field.onChange(field.value + 1)}>
                                                <Plus className="size-4" />
                                            </Button>
                                        </div>
                                        {fieldState.invalid && <FieldError errors={getErrorMessages(fieldState.error)} />}
                                    </Field>
                                )}
                                />

                                <Controller
                                name="seniorGuests"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className="rounded-lg border p-3">
                                        <div className="space-y-1">
                                            <FieldLabel>Seniors</FieldLabel>
                                            <FieldDescription>₱{seniorGuestFee} per senior (60+)</FieldDescription>
                                        </div>
                                        <div className="mt-3 flex items-center justify-between gap-2">
                                            <Button type="button" variant="outline" size="icon" aria-label="Decrease seniors" onClick={() => field.onChange(Math.max(0, field.value - 1))}>
                                                <Minus className="size-4" />
                                            </Button>
                                            <span className="w-8 text-center font-bold">{field.value}</span>
                                            <Button type="button" variant="outline" size="icon" aria-label="Increase seniors" onClick={() => field.onChange(field.value + 1)}>
                                                <Plus className="size-4" />
                                            </Button>
                                        </div>
                                        {fieldState.invalid && <FieldError errors={getErrorMessages(fieldState.error)} />}
                                    </Field>
                                )}
                                />

                                <Controller
                                name="kidGuests"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className="rounded-lg border p-3">
                                        <div className="space-y-1">
                                            <FieldLabel>Kids</FieldLabel>
                                            <FieldDescription>₱{kidGuestFee} per kid (4–7)</FieldDescription>
                                        </div>
                                        <div className="mt-3 flex items-center justify-between gap-2">
                                            <Button type="button" variant="outline" size="icon" aria-label="Decrease kids" onClick={() => field.onChange(Math.max(0, field.value - 1))}>
                                                <Minus className="size-4" />
                                            </Button>
                                            <span className="w-8 text-center font-bold">{field.value}</span>
                                            <Button type="button" variant="outline" size="icon" aria-label="Increase kids" onClick={() => field.onChange(field.value + 1)}>
                                                <Plus className="size-4" />
                                            </Button>
                                        </div>
                                        {fieldState.invalid && <FieldError errors={getErrorMessages(fieldState.error)} />}
                                    </Field>
                                )}
                                />
                            </div>

                            <div className="flex items-center justify-between rounded-lg bg-primary/5 px-4 py-3">
                                <span className="text-sm font-semibold">Total Guests</span>
                                <span className="text-xl font-bold">{selectedNumberOfGuests}</span>
                            </div>
                        </FieldSet>

                        <Controller
                        name="specialRequest"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="grid gap-2">
                                <FieldLabel htmlFor={field.name}>
                                    Special Requests <span className="text-muted-foreground">(Optional)</span>
                                </FieldLabel>
                                <Textarea
                                id={field.name}
                                className="min-h-24 resize-y"
                                placeholder="Add accessibility needs, arrival notes, or other requests..."
                                aria-invalid={fieldState.invalid}
                                {...field}
                                />
                                <FieldDescription>Requests are subject to availability.</FieldDescription>
                                {fieldState.invalid && <FieldError errors={getErrorMessages(fieldState.error)} />}
                            </Field>
                        )}
                        />

                    </div>
                </FormSection>

                <FormSection title="Add-on Services">
                    <ManualAddOnSelector
                        bookingDate={selectedCheckInDate}
                        stayOptionId={selectedStayOptionId}
                        onSubtotalChange={setAddOnSubtotal}
                    />
                </FormSection>

                <FormSection title="Food Preorders">
                    <ManualPreOrderSelector onSubtotalChange={setPreOrderSubtotal} />
                </FormSection>

                <FormSection title="Payment Information" contentClassName="space-y-5">
                        
                        <Controller 
                        name="paymentType"
                        control={control}
                        render={({ field, fieldState }) => (
                            <FieldSet data-invalid={fieldState.invalid}>
                                <FieldLegend data-invalid={fieldState.invalid} className="gap-1 data-[invalid=true]:text-destructive" variant="label">
                                    Payment Type <span className="text-red-700">*</span>
                                </FieldLegend>

                                <RadioGroup
                                {...field}
                                name={field.name}
                                value={field.value ?? ""}
                                onValueChange={field.onChange}
                                aria-invalid={fieldState.invalid}
                                className="grid md:grid-cols-2 gap-3"
                                >
                                    <FieldLabel htmlFor="form-rhf-radiogroup-Full">
                                        <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                            <FieldContent>
                                                <FieldTitle>
                                                    Full
                                                </FieldTitle>
                                                <FieldDescription>
                                                    The booking is fully paid
                                                </FieldDescription>
                                            </FieldContent>
                                            <RadioGroupItem
                                            value="Full"
                                            id={`form-rhf-radiogroup-Full`}
                                            aria-invalid={fieldState.invalid}
                                            />
                                        </Field>
                                    </FieldLabel>
                                    <FieldLabel htmlFor="form-rhf-radiogroup-Partial">
                                        <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                            <FieldContent>
                                                <FieldTitle>
                                                    Partial (50% downpayment)
                                                </FieldTitle>
                                                <FieldDescription>
                                                    The booking is partially paid with a 50% downpayment
                                                </FieldDescription>
                                            </FieldContent>
                                            <RadioGroupItem
                                            value="Partial"
                                            id={`form-rhf-radiogroup-Partial`}
                                            aria-invalid={fieldState.invalid}
                                            />
                                        </Field>
                                    </FieldLabel>
                                </RadioGroup>

                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </FieldSet>
                        )}
                        />

                        <Controller
                        name="proofImageUrl"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="grid gap-2">
                                <FieldLabel className="gap-1">
                                    Attach Payment Proof <span className="text-muted-foreground">(Optional)</span>
                                </FieldLabel>

                                {!field.value ? (
                                    <CloudinaryUpload onSuccess={field.onChange} />
                                ) : (
                                    <CloudinaryPreview
                                    images={[{ url: field.value }]}
                                    onRemove={() => field.onChange("")}
                                    />
                                )}

                                <FieldDescription>
                                    Add a receipt or payment screenshot for recordkeeping. Manual payments remain approved by the owner.
                                </FieldDescription>
                                {fieldState.invalid && <FieldError errors={getErrorMessages(fieldState.error)} />}
                            </Field>
                        )}
                        />

                        {isAccommodationSelected && (
                            <div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Base Price:</span>
                                        <span className="font-semibold" >
                                            ₱{(selectedAccommodation?.price || 0).toLocaleString()}/stay
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Guest Fee:</span>
                                        <span className="font-semibold">
                                            ₱{guestFee.toLocaleString()}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Add-on Services:</span>
                                        <span className="font-semibold">
                                            ₱{addOnSubtotal.toLocaleString()}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Food Preorders:</span>
                                        <span className="font-semibold">
                                            ₱{preOrderSubtotal.toLocaleString()}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center pt-2 border-t">
                                        <span className="font-bold">Total Amount:</span>
                                        <span className="text-lg font-bold text-primary">
                                            ₱{totalAmount.toLocaleString()}
                                        </span>
                                    </div>
                                    {amountToPayNow ? (
                                        <div className="flex justify-between items-center pt-2 border-t">
                                            <span className="font-bold text-emerald-600">Amount to be Paid Now:</span>
                                            <span className="text-lg font-bold text-emerald-600">
                                                ₱{amountToPayNow.toLocaleString()}
                                            </span>
                                        </div>
                                    ) : null}
                                    {selectedPaymentType === 'Partial' && (
                                        <div className="flex justify-between items-center pt-2 border-t">
                                            <span className="font-medium text-amber-600">Balance Due at Check-in:</span>
                                            <span className="font-bold text-amber-600">
                                                ₱{(totalAmount - amountToPayNow).toLocaleString()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                </FormSection>

            <div className="rounded-xl border border-border bg-card px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                    <span className="text-red-700">*</span> Required fields
                </p>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button type="button" variant="outline" onClick={() => navigate("/admin/booking")}>
                        Cancel
                    </Button>
                    
                    <Button type="submit" disabled={isPending}>
                        {isPending ? <LoadingSpinner /> : "Create Booking"}
                    </Button>
                </div>
            </div>
        </form>
        </FormProvider>
    )
}

export default ManualBookingForm
