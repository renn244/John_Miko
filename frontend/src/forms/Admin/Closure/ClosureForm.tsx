import ClosureAvailabilityCalendar from "@/components/common/ClosureAvailabilityCalendar";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessages } from "@/lib/getErrorMessages";
import { handleNestError, ValidationError } from "@/lib/handleNestError";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const ClosureSchema = z.object({
    date: z.date().nonoptional("date is required"),
    type: z.enum(["Close", "Private"]).optional(),
    reason: z.string()
        .optional()
}).superRefine((data, ctx) => {
    if(data.type === "Close" && !data.reason) {
        ctx.addIssue({
            code: 'custom',
            path: ["reason"],
            message: "Reason is required for close events",
        });
        return
    }

    if(data.type === "Private" && data.reason) {
        ctx.addIssue({
            code: 'custom',
            path: ["reason"], 
            message: "Reason must be empty for private closures",
        });
        return
    }
});

type closureSchema = z.infer<typeof ClosureSchema>;

type ClosureFormProps = {
    onsubmit: (data: closureSchema) => Promise<void | any>,
    oncancel: () => void,
    className?: string,
    accommodationId?: string;
    scope: "resort" | "accommodation"
}

const ClosureForm = ({ 
    onsubmit, oncancel, accommodationId, className, scope
}: ClosureFormProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const { 
        control,
        handleSubmit,
        setError,
        watch
    } = useForm<closureSchema>({
        resolver: zodResolver(ClosureSchema),
        defaultValues: {
            date: undefined,
            type: "Close",
            reason: ""
        },
        criteriaMode: "all"
    })
    
    const onSubmit = async (data: closureSchema) => {
        setIsLoading(true);
        try {
            await onsubmit(data);
        } catch (error: any) {
            if(error instanceof ValidationError) {
                handleNestError(error.response, setError);
                return
            }

            toast.error('An unexpected error occurred. Please try again.')
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={cn("space-y-5", className)}>
            <Controller 
            name="date"
            control={control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="grid gap-2">
                    <FieldLabel htmlFor={field.name}>
                        Date <span className="text-red-700">*</span>
                    </FieldLabel>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                            aria-invlaid={fieldState.invalid}
                            variant="outline"
                            className="w-70 justify-start text-left data=[empty=true]:text-muted-foreground"
                            >
                                {field.value ? format(field.value, "PPP") : "Select Date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-auto p-0">
                            <ClosureAvailabilityCalendar
                            accommodationId={accommodationId ? accommodationId : undefined}
                            className="w-full"
                            mode="single"
                            {...field}
                            selected={field.value}
                            onSelect={field.onChange}
                            />
                        </PopoverContent>
                    </Popover>

                    {fieldState.error && (
                        <FieldError errors={getErrorMessages(fieldState.error)} />
                    )}
                </Field>
            )}
            />

            {scope === "resort" && (
                <Controller 
                name="type"
                control={control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="grid gap-2">
                        <FieldLabel htmlFor={field.name}>
                            Closure Type <span className="text-red-700">*</span>
                        </FieldLabel>

                        <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="grid grid-cols-2 gap-3"
                        >
                            <label className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer">
                                <RadioGroupItem value="Close" />
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold">Close</p>
                                    <p className="text-xs text-muted-foreground">Reason Required</p>
                                </div>
                            </label>
                            <label className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer">
                                <RadioGroupItem value="Private" />
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold">Private</p>
                                    <p className="text-xs text-muted-foreground">No Reason Required</p>
                                </div>
                            </label>
                        </RadioGroup>

                        {fieldState.error && (
                            <FieldError errors={getErrorMessages(fieldState.error)} />
                        )}
                    </Field>
                )}
                />
            )}

            {watch("type") === "Close" && (
                <Controller 
                name="reason"
                control={control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="grid gap-2">
                        <FieldLabel htmlFor={field.name}>
                            Reason <span className="text-red-700">*</span>
                        </FieldLabel>

                        <Textarea 
                        placeholder="e.g., Renovation, private event, emergency maintenance..."
                        className="w-full max-h-62.5"
                        rows={3}
                        {...field}
                        />

                        {fieldState.error && (
                            <FieldError errors={getErrorMessages(fieldState.error)} />
                        )}
                    </Field>
                )}
                />
            )}

            <div className="flex gap-3 pt-1">
                <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={oncancel}
                disabled={isLoading}
                >
                    Cancel
                </Button>

                <Button
                type="submit"
                className="flex-1"
                disabled={isLoading}
                onClick={() => {
                    
                }}
                >
                    {isLoading ? <LoadingSpinner /> : "Confirm Closure"}
                </Button>
            </div>
        </form>
    )
}

export default ClosureForm