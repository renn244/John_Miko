import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useGetAccommodationsQuery } from "@/hooks/admin/accommodation.hook";
import { getErrorMessages } from "@/lib/getErrorMessages";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar as CalendarIcon, CheckCircle, Users } from "lucide-react";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

const ManualBookingSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email().nonempty("Email is required"),
    contactNo: z.string().nonempty("Contact number is required"),
    numberOfGuests: z.number().min(1, "At least one guest is required"),
    accommodationId: z.string().nonempty("Accommodation is required"),

    checkIn: z.date().nonoptional("Check-in date is required"),
    stayType: z.enum(['OverNight', 'DayStay']),

    paymentType: z.enum(['Partial', 'Full']).nonoptional("Payment type is required"),
})

type manualBookingSchema = z.infer<typeof ManualBookingSchema>;

const ManualBookingForm = () => {
    const {
        control,
        handleSubmit,
        watch
    } = useForm<manualBookingSchema>({
        resolver: zodResolver(ManualBookingSchema),
        defaultValues: {
            name: "",
            email: "",
            contactNo: "",
            numberOfGuests: 1,
            accommodationId: "",
            checkIn: undefined,
            stayType: undefined,
            paymentType: undefined
        },
        criteriaMode: "all"
    })

    // get accommodation hook
    const { data: accommodations, isLoading } = useGetAccommodationsQuery();

    const onSubmit = (data: manualBookingSchema) => {
        console.log(data);
    }

    const accommodationId = watch('accommodationId');

    const selectedAccommodation = useMemo(() => {
        return accommodations?.find((acc) => acc.id === accommodationId);
    }, [accommodationId, accommodations]);

    const accommodationPrice = selectedAccommodation?.price || 0;

    const serviceFee = 500; // because in the booking form there is 500, remove later if no service fee...
    const totalAmount = accommodationPrice + serviceFee; // get base price from selected accommodation
    const amountToPayNow = watch('paymentType') ? (watch('paymentType') === "Partial" ? totalAmount / 2 : totalAmount) : 0;

    return (
        <form  
        className="bg-white rounded-xl shadow-sm border-2 overflow-hidden" 
        onSubmit={handleSubmit(onSubmit)}
        >
            <div className="p-6 md:p-8 space-y-6">

                <div>
                    <h2 className="text-lg font-bold mb-4 pb-2 border-b">
                        Guest Information
                    </h2>

                    <div className="space-y-5">

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

                    </div>
                </div>

                <div>
                    <h2 className="text-lg font-bold mb-4 pb-2 border-b">
                        Accommodation Selection
                    </h2>

                    <div className="space-y-5">
                        
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
                                onValueChange={field.onChange}
                                aria-invalid={fieldState.invalid}
                                className="grid md:grid-cols-2 gap-3"
                                >
                                    {accommodations?.map((acc) => (
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
                                                    Up to 10
                                                </div>
                                                <div className="font-bold text-primary">
                                                    ₱2999/night
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

                        {/* Selected Accommodation Summary */}
                        {selectedAccommodation && (
                            <div
                            className="p-3 rounded-lg border-2"
                            style={{ backgroundColor: '#F0FDF4', borderColor: '#86EFAC' }}
                            >
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" style={{ color: '#059669' }} />
                                    <span className="text-sm font-semibold" style={{ color: '#059669' }}>
                                        Selected: {selectedAccommodation.name} - ₱{selectedAccommodation.price.toLocaleString()}/(OverNight Or DayStay) (Max: {selectedAccommodation.capacity} guests)
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <h2 className="text-lg font-bold mb-4 pb-2 border-b">
                        Booking Details
                    </h2>

                    <div className="space-y-5">
                         
                        <div className="grid md:grid-cols-2 gap-5">
                            
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
                                            variant="outline"
                                            className="w-70 justify-start text-left data=[empty=true]:text-muted-foreground"
                                            >
                                                <CalendarIcon />
                                                Pick a date
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar 
                                            mode="single"
                                            aria-invalid={fieldState.invalid}
                                            {...field}
                                            selected={field.value}
                                            onSelect={(date) => field.onChange(date)}
                                            />
                                        </PopoverContent>
                                    </Popover>

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
                                <Field data-invalid={fieldState.invalid} className="grid gap-2">
                                    <FieldLabel htmlFor={field.name}>
                                        Number of Guests <span className="text-red-700">*</span>
                                    </FieldLabel>

                                    <Input 
                                    id={field.name}
                                    aria-invalid={fieldState.invalid}
                                    min="1"
                                    type="number"
                                    {...field}
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                    />
                                    {selectedAccommodation && (
                                        <FieldDescription>
                                            Maximum capacity: {selectedAccommodation.capacity} guests
                                        </FieldDescription>
                                    )}

                                    {fieldState.invalid && (
                                        <FieldError errors={getErrorMessages(fieldState.error)} />
                                    )}
                                </Field>
                            )}
                            />
                        </div>

                        <FieldGroup>
                            <Controller
                            name="stayType"
                            control={control}
                            render={({ field, fieldState }) => (
                                <FieldSet data-invalid={fieldState.invalid} className="grid gap-2">
                                    <FieldLegend data-invalid={fieldState.invalid} className="gap-1 data-[invalid=true]:text-destructive" variant="label">
                                        Stay Type <span className="text-red-700">*</span>
                                    </FieldLegend>
                                    
                                    <RadioGroup
                                    name={field.name}
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    aria-invalid={fieldState.invalid}
                                    className="grid md:grid-cols-2 gap-3"
                                    >
                                        <FieldLabel htmlFor="form-rhf-radiogroup-DayStay">
                                            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                                <FieldContent>
                                                    <FieldTitle>
                                                        DayStay
                                                    </FieldTitle>
                                                    <FieldDescription>
                                                        12:00 PM to 1:00 AM
                                                    </FieldDescription>
                                                </FieldContent>
                                                <RadioGroupItem
                                                value="DayStay"
                                                id={`form-rhf-radiogroup-DayStay`}
                                                aria-invalid={fieldState.invalid}
                                                />
                                            </Field>
                                        </FieldLabel>
                                        <FieldLabel htmlFor="form-rhf-radiogroup-OverNight">
                                            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                                <FieldContent>
                                                    <FieldTitle>
                                                        OverNight
                                                    </FieldTitle>
                                                    <FieldDescription>
                                                        1:00 AM to 11:00 PM
                                                    </FieldDescription>
                                                </FieldContent>
                                                <RadioGroupItem
                                                value="OverNight"
                                                id={`form-rhf-radiogroup-OverNight`}
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
                        </FieldGroup>

                    </div>
                </div>

                <div>
                    <h2 className="text-lg font-bold mb-4 pb-2 border-b">
                        Payment Information
                    </h2>

                    <div className="space-y-5">
                        
                        <Controller 
                        name="paymentType"
                        control={control}
                        render={({ field, fieldState }) => (
                            <FieldSet data-invalid={fieldState.invalid}>
                                <FieldLegend data-invalid={fieldState.invalid} className="gap-1 data-[invalid=true]:text-destructive" variant="label">
                                    Payment Type <span className="text-red-700">*</span>
                                </FieldLegend>

                                <RadioGroup
                                name={field.name}
                                value={field.value}
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

                        {/* Amount Summary */}
                        <div className="p-4 rounded-lg">
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Base Price:</span>
                                    <span className="font-semibold" >
                                        ₱2999/night
                                    </span>
                                </div>

                                <div className="flex justify-between items-center pt-2 border-t">
                                    <span className="font-bold">Total Amount:</span>
                                    <span className="text-lg font-bold text-primary">
                                        ₱{totalAmount.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t">
                                    <span className="font-bold" style={{ color: '#059669' }}>Amount to be Paid Now:</span>
                                    <span className="text-lg font-bold" style={{ color: '#059669' }}>
                                        ₱{amountToPayNow.toLocaleString()}
                                    </span>
                                </div>
                                {watch('paymentType') === 'Partial' && (
                                    <div className="flex justify-between items-center pt-2 border-t">
                                        <span className="font-medium" style={{ color: '#D97706' }}>Balance Due at Check-in:</span>
                                        <span className="font-bold" style={{ color: '#D97706' }}>
                                            ₱{(totalAmount - amountToPayNow).toLocaleString()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-6 md:px-8 py-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50">
                <p className="text-sm text-muted-foreground">
                    <span className="text-red-700">*</span> Required fields
                </p>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button type="button" variant="outline">
                        Cancel
                    </Button>
                    
                    <Button type="submit">
                        {false ? <LoadingSpinner /> : "Create Booking"}
                    </Button>
                </div>
            </div>
        </form>
    )
}

export default ManualBookingForm