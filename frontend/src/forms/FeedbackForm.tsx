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
            console.log(data)
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
        className={cn("bg-white rounded-xl shadow-sm border overflow-hidden", className)}
        onSubmit={handleSubmit(onSubmit)}
        >
            <div className="p-6 md:p-8 space-y-6">

                {children}

                <Controller 
                name="rating"                
                control={control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                            Rating <span className="text-red-700">*</span>
                        </FieldLabel>

                        <div className="flex gap-2">
                            {Array.from({ length: 5 }, (_, i) => i + 1).map((star) => (
                                <button
                                key={star}
                                type="button"
                                onClick={() => field.onChange(star)}
                                >
                                    <Star 
                                    className={`
                                        w-10 h-10 
                                        ${field.value >= star ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground/50"}    
                                    `}
                                    />
                                </button>     
                            ))}
                        </div>

                        <FieldDescription>
                            Please provide a rating between 1 and 5.
                        </FieldDescription>

                        {fieldState.invalid && <FieldError errors={getErrorMessages(fieldState.error)} />}
                    </Field>
                )}
                />

                <Controller 
                name="comment"
                control={control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                            Comment
                        </FieldLabel>
                        
                        <Textarea 
                        {...field}
                        rows={3}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="E.g, the service is good!"
                        className="max-h-40"
                        />

                        <FieldDescription>
                            Please provide any additional feedback or comments you may have.
                        </FieldDescription>

                        {fieldState.invalid && <FieldError errors={getErrorMessages(fieldState.error)} />}
                    </Field>
                )}
                />

            </div>

            <div className="px-6 md:px-8 py-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50">
                <p className="text-sm text-muted-foreground">
                    <span className="text-red-700">*</span> Required fields
                </p>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button type="button" variant="outline" onClick={oncancel}>
                        Cancel
                    </Button>
                    
                    <Button disabled={isLoading} type="submit">
                        {isLoading ? <LoadingSpinner /> : `${buttonText} Feedback`}
                    </Button>
                </div>
            </div>
        </form>
    )
}

export default FeedbackForm