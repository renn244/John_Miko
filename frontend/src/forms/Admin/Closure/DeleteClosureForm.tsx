import DeleteClosureAvailabilityCalendar from "@/components/common/DeleteClosureAvailabilityCalendar";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useGetClosureByDate } from "@/hooks/admin/closure.hook";
import { toDateOnly } from "@/lib/date.util";
import { getErrorMessages } from "@/lib/getErrorMessages";
import { handleNestError, ValidationError } from "@/lib/handleNestError";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const DeleteClosureSchema = z.object({
    date: z.date().nonoptional("date is required")
});

type deleteClosureSchema = z.infer<typeof DeleteClosureSchema>;

type DeleteClosureFormProps = {
    onsubmit: (closureId: string) => Promise<void | any>,
    oncancel: () => void,
    className?: string,
    accommodationId?: string
}

const DeleteClosureForm = ({
    onsubmit, oncancel, accommodationId, className
}: DeleteClosureFormProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const {
        control,
        handleSubmit,
        setError,
        watch
    } = useForm<deleteClosureSchema>({
        resolver: zodResolver(DeleteClosureSchema),
        defaultValues: {
            date: undefined
        },
        criteriaMode: "all"
    })

    const date = watch("date");
    const { data: closure, isLoading: closureLoading } = useGetClosureByDate(accommodationId ?? undefined, date ? toDateOnly(date) : undefined)

    const onSubmit = async () => {
        setIsLoading(true);
        try {
            await onsubmit(closure?.id ?? '');
        } catch(error: any) {
            if(error instanceof ValidationError) {
                handleNestError(error.response, setError);
                return
            }

            toast.error("An error occurred while deleting the closure.");
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
                            aria-invalid={fieldState.invalid}
                            variant="outline"
                            className="w-70 justify-start text-left data=[empty=true]:text-muted-foreground"
                            >
                                {field.value ? format(field.value, "PPP") : "Select Date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-auto p-0">
                            <DeleteClosureAvailabilityCalendar
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

            <div className="bg-gray-50 p-4 rounded-lg border">
                <h4 className="text-sm font-semibold mb-3">
                    Closure to be deleted:
                </h4>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">
                            Date:
                        </span>
                        <span className="font-semibold">
                            {closure?.date ? format(closure.date, "PPP") : "N/A"}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">
                            Type:
                        </span>
                        <span className="font-semibold">
                            {closure?.type ? closure.type : "N/A"}
                        </span>
                    </div>
                    {closure?.reason && (
                        <div className="grid gap-2">
                            <span className="text-muted-foreground">
                                Reason:
                            </span>
                            <Textarea 
                            value={closure.reason}
                            readOnly
                            className="resize-none flex-1"
                            />
                        </div>
                    )}
                </div>
            </div>

            <p className="text-sm font-medium text-muted-foreground">
                Are you sure you want to delete this closure?
            </p>

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
                variant="destructive"
                type="submit"
                className="flex-1"
                disabled={isLoading || closureLoading}
                >
                    {isLoading ? <LoadingSpinner /> : "Confirm Deletion"} 
                </Button>
            </div>
        </form>
    )
}

export default DeleteClosureForm