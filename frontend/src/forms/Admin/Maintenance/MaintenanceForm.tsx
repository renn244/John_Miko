import { Button } from "@/components/ui/button"
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel, FieldLegend, FieldSet, FieldTitle } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import LoadingSpinner from "@/components/ui/loadingSpinner"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { getErrorMessages } from "@/lib/getErrorMessages"
import { handleNestError, ValidationError } from "@/lib/handleNestError"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { Save } from "lucide-react"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

const MaintenanceSchema = z.object({
    title: z.string().nonempty("Title is required"),
    description: z.string().nonempty("Description is required"),
    imagesUrl: z.array(z.string().url("Invalid URL format")).nonempty("At least one image URL is required"),
    status: z.enum(["Pending", "InProgress", "Completed", "Closed"], { message: "Status must be one of: Pending, InProgress, Completed, Closed" }),
    priority: z.enum(["Low", "Medium", "High"], { message: "Priority must be one of: Low, Medium, High" })
})

type maintenanceSchema = z.infer<typeof MaintenanceSchema>

type MaintenanceFormProps = {
    onsubmit: (data: maintenanceSchema) => Promise<void>,
    oncancel: () => void,
    className?: string,
    initialData?: maintenanceSchema,
    isUpdate?: boolean,
}
    
const MaintenanceForm = ({ onsubmit, oncancel, className, initialData, isUpdate }: MaintenanceFormProps) => {
    const [isLoading, setIsLoading] = useState(false)
    const { 
        control, 
        handleSubmit,
        setError
    } = useForm<maintenanceSchema>({
        resolver: zodResolver(MaintenanceSchema),
        defaultValues: {
            title: initialData?.title || "",
            description: initialData?.description || "",
            imagesUrl: initialData?.imagesUrl || ["https://example.com"],
            status: initialData?.status || "Pending",
            priority: initialData?.priority || "Low"
        },
        criteriaMode: "all",
    })

    const buttonText = isUpdate ? "Update Maintenance" : "Create Maintenance"

    const onSubmit = async (data: maintenanceSchema) => {
        setIsLoading(true)
        try {
            await onsubmit(data)
        } catch (error: any) {
            if(error instanceof ValidationError) {
                handleNestError(error.response, setError)
                return
            }

            toast.error("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form
        onSubmit={handleSubmit(onSubmit)}
        className={cn("bg-white rounded-xl shadow-sm border-2 overflow-hidden", className)}
        >
            <div className="p-6 md:p-8 space-y-6">

                <div>
                    <h2 className="text-lg font-bold mb-4 pb-2 border-b">
                        Basic Information
                    </h2>
                    <div className="space-y-5">

                        <Controller 
                        name="title"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>
                                    Title <span className="text-red-700">*</span>
                                </FieldLabel>

                                <Input 
                                {...field}
                                id={field.name}
                                aria-invalid={fieldState.invalid}
                                placeholder="e.g, Air conditioning not working"
                                />

                                {fieldState.error && (
                                    <FieldError errors={getErrorMessages(fieldState.error)} />
                                )}
                            </Field>
                        )}
                        />

                        <Controller 
                        name="description"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>
                                    Description <span className="text-red-700">*</span>
                                </FieldLabel>

                                <Textarea 
                                 {...field}
                                id={field.name}
                                aria-invalid={fieldState.invalid}
                                placeholder="Provide a detailed description of the maintenance issue..."
                                className="max-h-30"
                                />

                                {fieldState.error && (
                                    <FieldError errors={getErrorMessages(fieldState.error)} />
                                )}
                            </Field>
                        )}
                        />

                        <Controller 
                        name="priority"
                        control={control}
                        render={({ field, fieldState }) =>  (
                            <FieldSet>
                                <FieldLegend data-invalid={fieldState.invalid} className="gap-1 data-[invalid=true]:text-destructive" variant="label">
                                    Priority <span className="text-red-700">*</span>
                                </FieldLegend>
                                
                                <RadioGroup
                                {...field}
                                name={field.name}
                                value={field.value}
                                onValueChange={field.onChange}
                                aria-invalid={fieldState.invalid}
                                className="grid md:grid-cols-3 gap-3"
                                >
                                    <FieldLabel htmlFor="form-rhf-radiogroup-Low">
                                        <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                            <FieldContent>
                                                <FieldTitle>Low</FieldTitle>
                                                <FieldDescription>
                                                    This issue can be addressed at a later time without causing significant inconvenience.
                                                </FieldDescription>
                                            </FieldContent>
                                            <RadioGroupItem 
                                            value="Low"
                                            id="form-rhf-radiogroup-Low"
                                            aria-invalid={fieldState.invalid}
                                            />
                                        </Field>
                                    </FieldLabel>
                                   <FieldLabel htmlFor="form-rhf-radiogroup-Medium">
                                        <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                            <FieldContent>
                                                <FieldTitle>Medium</FieldTitle>
                                                <FieldDescription>
                                                    This issue should be addressed within a reasonable timeframe to prevent further inconvenience.
                                                </FieldDescription>
                                            </FieldContent>
                                            <RadioGroupItem 
                                            value="Medium"
                                            id="form-rhf-radiogroup-Medium"
                                            aria-invalid={fieldState.invalid}
                                            />
                                        </Field>
                                    </FieldLabel>
                                    <FieldLabel htmlFor="form-rhf-radiogroup-High">
                                        <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                            <FieldContent>
                                                <FieldTitle>High</FieldTitle>
                                                <FieldDescription>
                                                    This issue requires immediate attention and should be resolved as soon as possible.
                                                </FieldDescription>
                                            </FieldContent>
                                            <RadioGroupItem 
                                            value="High"
                                            id="form-rhf-radiogroup-High"
                                            aria-invalid={fieldState.invalid}
                                            />
                                        </Field>
                                    </FieldLabel>
                                </RadioGroup>

                                {fieldState.error && (
                                    <FieldError errors={getErrorMessages(fieldState.error)} />
                                )}
                            </FieldSet>
                        )}
                        />

                    </div>
                </div>

                <div>
                    <h2 className="text-lg font-bold mb-4 pb-2 border-b">
                        Tracking
                    </h2>
                    <div className="space-y-5">
                        <Controller 
                        name="status"
                        control={control}
                        render={({ field, fieldState }) => (
                            <FieldSet>
                                <FieldLegend data-invalid={fieldState.invalid} className="gap-1 data-[invalid=true]:text-destructive" variant="label">
                                    Status <span className="text-red-700">*</span>
                                </FieldLegend>

                                <RadioGroup
                                {...field}
                                name={field.name}
                                value={field.value}
                                onValueChange={field.onChange}
                                aria-invalid={fieldState.invalid}
                                className="grid md:grid-cols-2 gap-3"
                                >
                                    <FieldLabel htmlFor="form-rhf-radiogroup-Pending">
                                        <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                            <FieldContent>
                                                <FieldTitle>Pending</FieldTitle>
                                                <FieldDescription>
                                                    This issue is pending further investigation or action.
                                                </FieldDescription>
                                            </FieldContent>
                                            <RadioGroupItem 
                                            value="Pending"
                                            id="form-rhf-radiogroup-Pending"
                                            aria-invalid={fieldState.invalid}
                                            />
                                        </Field>
                                    </FieldLabel>
                                    <FieldLabel htmlFor="form-rhf-radiogroup-InProgress">
                                        <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                            <FieldContent>
                                                <FieldTitle>In Progress</FieldTitle>
                                                <FieldDescription>
                                                    This issue should be addressed within a reasonable timeframe to prevent further inconvenience.
                                                </FieldDescription>
                                            </FieldContent>
                                            <RadioGroupItem 
                                            value="InProgress"
                                            id="form-rhf-radiogroup-InProgress"
                                            aria-invalid={fieldState.invalid}
                                            />
                                        </Field>
                                    </FieldLabel>
                                    <FieldLabel htmlFor="form-rhf-radiogroup-Completed">
                                        <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                            <FieldContent>
                                                <FieldTitle>Completed</FieldTitle>
                                                <FieldDescription>
                                                    This issue has been resolved and no further action is required.
                                                </FieldDescription>
                                            </FieldContent>
                                            <RadioGroupItem 
                                            value="Completed"
                                            id="form-rhf-radiogroup-Completed"
                                            aria-invalid={fieldState.invalid}
                                            />
                                        </Field>
                                    </FieldLabel>
                                    <FieldLabel htmlFor="form-rhf-radiogroup-Closed">
                                        <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                            <FieldContent>
                                                <FieldTitle>Closed</FieldTitle>
                                                <FieldDescription>
                                                    This issue has been closed and is no longer active.
                                                </FieldDescription>
                                            </FieldContent>
                                            <RadioGroupItem
                                            value="Closed"
                                            id="form-rhf-radiogroup-Closed"
                                            aria-invalid={fieldState.invalid}
                                            />
                                        </Field>
                                    </FieldLabel>
                                </RadioGroup>
                                
                                {fieldState.error && (
                                    <FieldError errors={getErrorMessages(fieldState.error)} />
                                )}
                            </FieldSet>
                        )}
                        />
                    </div>
                </div>
            </div>
            
            <div className="px-6 md:px-8 py-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50">
                <p className="text-sm text-muted-foreground">
                    <span className="text-red-700">*</span> Required fields
                </p>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button disabled={isLoading} onClick={oncancel} type="button" variant="outline">
                        Cancel
                    </Button>
                    <Button disabled={isLoading} type="submit">
                        {isLoading ? (
                            <LoadingSpinner />
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                {buttonText}
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </form>
    )
}

export default MaintenanceForm