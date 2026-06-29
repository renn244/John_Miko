import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessages } from "@/lib/getErrorMessages";
import { handleNestError, ValidationError } from "@/lib/handleNestError";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Star } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const FeedbackSchema = z.object({
    rating: z.number()
        .min(1, { message: "Rating must be at least 1" })
        .max(5, { message: "Rating cannot be more than 5" }),
    comment: z.string().optional(),
});

type feedbackSchema = z.infer<typeof FeedbackSchema>;

type FeedbackFormProps = {
    onsubmit: (data: feedbackSchema) => Promise<void>;
    oncancel: () => void;
    children?: React.ReactNode;
    className?: string;
    initialData?: any;
    isUpdate?: boolean;
}

const FeedbackForm = ({
    onsubmit, oncancel, children,
    className, initialData, isUpdate
}: FeedbackFormProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const { 
        control,
        handleSubmit,
        setError
    } = useForm<feedbackSchema>({
        resolver: zodResolver(FeedbackSchema),
        defaultValues: {
            rating: initialData?.rating || 0,
            comment: initialData?.comment || "",
        },
        criteriaMode: "all",
    }); 

    const buttonText = isUpdate ? "Save" : "Create";

    const onSubmit = async (data: feedbackSchema) => {
        setIsLoading(true);
        try {
            await onsubmit(data);
        } catch (error: any) {
            if(error instanceof ValidationError) {
                handleNestError(error.response, setError);
                return
            }

            toast.error(error.message || "An error occurred while submitting the form. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form 
        className={cn("overflow-hidden rounded-xl border bg-card shadow-sm", className)}
        onSubmit={handleSubmit(onSubmit)}
        >
            <div className="border-b bg-muted/30 p-4 md:p-5">

                {children}
            </div>

            <div className="space-y-6 p-4 md:p-6">

                <Controller 
                name="rating"                
                control={control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="gap-3">
                        <FieldLabel htmlFor={field.name}>
                            Overall Rating <span className="text-destructive">*</span>
                        </FieldLabel>

                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex gap-1.5">
                                {Array.from({ length: 5 }, (_, i) => i + 1).map((star) => (
                                    <button
                                    key={star}
                                    type="button"
                                    className="rounded-md outline-none transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    onClick={() => field.onChange(star)}
                                    >
                                        <Star 
                                        className={cn(
                                            "size-7 transition-colors",
                                            field.value >= star
                                                ? "fill-yellow-500 text-yellow-500"
                                                : "text-muted-foreground/45"
                                        )}
                                        />
                                    </button>     
                                ))}
                            </div>
                            {field.value > 0 ? (
                                <span className="text-sm font-medium text-muted-foreground">
                                    {field.value} / 5
                                </span>
                            ) : null}
                        </div>

                        <FieldDescription>
                            How would you rate your experience?
                        </FieldDescription>

                        {fieldState.invalid && <FieldError errors={getErrorMessages(fieldState.error)} />}
                    </Field>
                )}
                />

                <Controller 
                name="comment"
                control={control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="gap-3">
                        <FieldLabel htmlFor={field.name}>
                            Detailed Feedback <span className="font-normal text-muted-foreground">(Optional)</span>
                        </FieldLabel>
                        
                        <Textarea 
                        {...field}
                        rows={5}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="Share what you liked or what could be improved."
                        className="min-h-28 max-h-48 resize-y"
                        />

                        <FieldDescription>
                            Please provide any additional feedback or comments you may have.
                        </FieldDescription>

                        {fieldState.invalid && <FieldError errors={getErrorMessages(fieldState.error)} />}
                    </Field>
                )}
                />

            </div>

            <div className="flex flex-col items-start justify-between gap-4 border-t bg-muted/30 px-4 py-4 sm:flex-row sm:items-center md:px-6">
                <p className="text-sm text-muted-foreground">
                    <span className="text-destructive">*</span> Required fields
                </p>

                <div className="flex w-full items-center gap-3 sm:w-auto">
                    <Button type="button" variant="outline" className="flex-1 sm:flex-none" onClick={oncancel}>
                        Cancel
                    </Button>
                    
                    <Button disabled={isLoading} type="submit" className="flex-1 sm:flex-none">
                        {isLoading ? <LoadingSpinner /> : `${buttonText} Feedback`}
                    </Button>
                </div>
            </div>
        </form>
    )
}

export default FeedbackForm
