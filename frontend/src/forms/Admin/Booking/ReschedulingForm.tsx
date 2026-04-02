import AvailabilityCalendar from "@/components/common/AvailabilityCalendar"
import AvailabilityStayType from "@/components/common/AvailabilityStayType"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import LoadingSpinner from "@/components/ui/loadingSpinner"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { isSameDateOnly } from "@/lib/date.util"
import { getErrorMessages } from "@/lib/getErrorMessages"
import { handleNestError, ValidationError } from "@/lib/handleNestError"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { ComponentProps } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

const RescheduleSchema = z.object({
    bookingDate: z.date(),
    stayType: z.enum(['OverNight', 'DayStay'])
})

type rescheduleSchema = z.infer<typeof RescheduleSchema> 

type ReschedulingFormProps = {
    className?: string,
    onsubmit: (data: rescheduleSchema) => Promise<void>,
    isLoading: boolean,
    initialData: rescheduleSchema,
    accommodationId: string,
} & ComponentProps<"form">

const ReschedulingForm = ({ className, initialData, onsubmit, isLoading, accommodationId, ...props } : ReschedulingFormProps) => {
    const {
        control,
        handleSubmit,
        watch,
        setError,
        resetField,
    } = useForm<rescheduleSchema>({
        resolver: zodResolver(RescheduleSchema),
        defaultValues: {
            bookingDate: initialData.bookingDate,
            stayType: undefined
        },
        criteriaMode: "all"
    })

    const onSubmit = async (data: rescheduleSchema) => {
        try {
            await onsubmit(data)
        } catch (error: any) {
            if(error instanceof ValidationError) {
                handleNestError(error.response, setError)
                return
            }
            
            toast.error(error.message || "An error occurred while rescheduling the booking.")
        }
    }

    const bookingDate = watch("bookingDate")

    return (
        <form 
        className={cn("space-y-2", className)} 
        onSubmit={handleSubmit(onSubmit)}
        {...props}
        >

            <div className="grid gap-4 md:grid-cols-2">
                <Controller 
                name="bookingDate"
                control={control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="grid gap-2 h-min">
                        <FieldLabel htmlFor={field.name} className="gap-1">
                            Booking Date <span className="text-destructive">*</span>
                        </FieldLabel>
                        
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button 
                                id={field.name}
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
                                mode="single"
                                accommodationId={accommodationId}
                                aria-invalid={fieldState.invalid}
                                {...field}
                                selected={field.value}
                                onSelect={(date) => {
                                    if(date && !isSameDateOnly(date, new Date(field.value))) {
                                        resetField("stayType")
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

                <Controller 
                name="stayType"
                control={control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="grid gap-2">
                        <FieldLabel htmlFor={field.name} className="gap-1">
                            Time Slot <span className="text-destructive">*</span>
                        </FieldLabel>
                        
                        <AvailabilityStayType 
                        key={bookingDate?.toISOString()}  // ← forces remount on date change
                        className="md:grid-cols-1"
                        accommodationId={accommodationId}
                        checkInDate={bookingDate}
                        {...field}
                        name={field.name}
                        value={field.value || ""}
                        onValueChange={field.onChange}
                        invalid={fieldState.invalid}
                        />

                        {fieldState.invalid && (
                            <FieldError errors={getErrorMessages(fieldState.error)} />
                        )}
                    </Field>
                )}
                />
            </div>

            <div className="flex flex-col w-full items-center justify-between gap-3 border-t sm:flex-row pt-4">
                <p className="text-sm text-muted-foreground">
                    <span className="text-red-700">*</span> Required fields
                </p>
                
                <div className="flex items-center gap-3">
                    <Button variant="outline">
                        Cancel
                    </Button>
                    <Button>
                        {isLoading ? <LoadingSpinner /> : "Reschedule Booking"}
                    </Button>
                </div>
            </div>
        </form>
    )
}

export default ReschedulingForm