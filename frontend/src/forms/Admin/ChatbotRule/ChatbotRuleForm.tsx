import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { Switch } from "@/components/ui/switch";
import { InputTags } from "@/components/ui/tag-input";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessages } from "@/lib/getErrorMessages";
import { handleNestError, ValidationError } from "@/lib/handleNestError";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const ChatbotRuleSchema = z.object({
    name: z.string().nonempty("Name is required"),
    keywords: z.array(z.string()).nonempty("At least one keyword is required"),
    response: z.string().nonempty("Response is required"),
    quickReplies: z.array(z.string()).optional(),
    isActive: z.boolean().default(true).optional(),
})

type chatbotRuleSchema  = z.infer<typeof ChatbotRuleSchema>; 

type MenuItemFormProps = {
    onsubmit: (data: any) => Promise<void>;
    oncancel: () => void;
    className?: string;
    initialData?: chatbotRuleSchema;
    isUpdate?: boolean;
}

const ChatbotRuleForm = ({ onsubmit, oncancel, className, initialData, isUpdate }: MenuItemFormProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const {
        control,
        handleSubmit,
        setError
    } = useForm<chatbotRuleSchema>({
        resolver: zodResolver(ChatbotRuleSchema),
        defaultValues: {
            name: initialData?.name || "",
            keywords: initialData?.keywords || [],
            response: initialData?.response || "",
            quickReplies: initialData?.quickReplies || [],
            isActive: initialData?.isActive ?? true
        },
        criteriaMode: "all"
    })
    
    const buttonText = isUpdate ? "Update Rule" : "Create Rule";

    const onSubmit = async (data: chatbotRuleSchema) => {
        setIsLoading(true);
        try {
            await onsubmit(data);
        } catch (error: any) {
            if(error instanceof ValidationError) {
                handleNestError(error.response, setError);
                return
            }

            toast.error("An error occurred while submitting the form. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form
        onSubmit={handleSubmit(onSubmit)}
        className={cn("bg-white rounded-xl shadow-sm border-2 overflow-hidden", className)}
        >
            <div className="p-6 md:p-8 space-y-6">
                
                <div>
                    <h2 className="text-lg font-bold mb-4 pb-2 border-b" style={{ color: '#1F2937', borderColor: '#E5E7EB' }}>
                        Basic Information
                    </h2>

                    <div className="space-y-5">

                        <Controller 
                        name="name"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name} className="gap-1">
                                    Rule Name <span className="text-red-700">*</span>
                                </FieldLabel>
                                
                                <Input
                                {...field}
                                id={field.name}
                                aria-invalid={fieldState.invalid}
                                placeholder="e.g., Pricing Information, Check-in Hours"
                                />

                                {fieldState.error && (
                                    <FieldError errors={getErrorMessages(fieldState.error)} />
                                )}
                            </Field>
                        )}
                        />

                        <Controller 
                        name="keywords"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name} className="gap-1">
                                    Keywords <span className="text-red-700">*</span>
                                </FieldLabel>

                                <InputTags 
                                fieldDescription="no quick replies added yet! start adding some, to help the bot have an easier way identifying manual inputs!"
                                value={field.value}
                                onChange={field.onChange}
                                invalid={fieldState.invalid}
                                />

                                <FieldDescription>
                                    Enter keywords and enter to add them to the list. The chatbot will respond when any of these words are detected in the user's message.
                                </FieldDescription>

                                {fieldState.error && (
                                    <FieldError errors={getErrorMessages(fieldState.error)} />
                                )}
                            </Field>
                        )}
                        />

                    </div>
                </div>

                <div>
                    <h2 className="text-lg font-bold mb-4 pb-2 border-b" style={{ color: '#1F2937', borderColor: '#E5E7EB' }}>
                        Response Message
                    </h2>

                    <Controller 
                    name="response"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="grid gap-2">
                            <FieldLabel htmlFor={field.name} className="gap-1">
                                Response Message <span className="text-red-700">*</span>
                            </FieldLabel>

                            <Textarea 
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                            className="max-h-40"
                            rows={4}
                            placeholder="e.g., Our check-in time starts at 3 PM. Let us know if you have any other questions!"
                            {...field}
                            />

                            <FieldDescription>
                                This is the message users will receive. Use \n in your text for line breaks, or press Enter to add new lines. Emojis are fully supported!
                            </FieldDescription>

                            {fieldState.invalid && (
                                <FieldError errors={getErrorMessages(fieldState.error)} />
                            )}
                        </Field>
                    )}
                    />
                </div>

                <div>
                    <h2 className="text-lg font-bold mb-4 pb-2 border-b" style={{ color: '#1F2937', borderColor: '#E5E7EB' }}>
                        Quick Replies
                    </h2>

                    <Controller 
                    name="quickReplies"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="grid gap-2">
                            <FieldLabel htmlFor={field.name}>
                                Add Quick Reply Buttons
                            </FieldLabel>

                            <InputTags 
                            fieldDescription="no quick replies added yet! start adding some, to help user have an easier navigation!"
                            value={field.value || []}
                            onChange={field.onChange}
                            />

                            <FieldDescription>
                                Quick replies appear as clickable buttons below the chatbot's message, helping users navigate to common actions or topics.
                            </FieldDescription>

                            {fieldState.error && (
                                <FieldError errors={getErrorMessages(fieldState.error)} />
                            )}
                        </Field>
                    )}
                    />
                </div>

                <div>
                    <h2 className="text-lg font-bold mb-4 pb-2 border-b" style={{ color: '#1F2937', borderColor: '#E5E7EB' }}>
                        Rule Status
                    </h2>

                    <Controller 
                    name="isActive"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field 
                        orientation="horizontal"
                        data-invalid={fieldState.invalid}
                        >
                            <FieldContent>
                                <FieldLabel htmlFor={field.name}>
                                    Active Status
                                </FieldLabel>
                                <FieldDescription>
                                    {field.value
                                        ? 'This rule is active and will respond to matching keywords'
                                        : 'This rule is inactive and will not trigger responses'}
                                </FieldDescription>

                                {fieldState.invalid && (
                                    <FieldError errors={getErrorMessages(fieldState.error)} />
                                )}
                            </FieldContent>

                            <Switch
                            id={field.name}
                            name={field.name}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            aria-invalid={fieldState.invalid}
                            />
                        </Field>
                    )}
                    />
                </div>
            </div>

            <div className="px-6 md:px-8 py-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50">
                <p className="text-sm text-muted-foreground">
                    <span className="text-red-700">*</span> Required fields
                </p>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button onClick={oncancel} type="button" variant="outline">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? <LoadingSpinner /> : buttonText}
                    </Button>
                </div>
            </div>
        </form>
    )
}

export default ChatbotRuleForm