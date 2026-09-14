import FormSection from "@/components/common/FormSection"
import { CloudinaryPreview } from "@/components/common/CloudinaryPreview"
import { CloudinaryUpload } from "@/components/common/CloudinaryUpload"
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel, FieldLegend, FieldSet, FieldTitle } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import type { MaintenanceExpertise } from "@/features/admin/staff-management/types/staff-management.type"
import type { Maintenance } from "@/features/admin/maintenance/types/maintenance.type"
import { getErrorMessages } from "@/lib/getErrorMessages"
import { handleNestError, ValidationError } from "@/lib/handleNestError"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import MaintenancePreviewCard from "./MaintenancePreviewCard"

const MaintenanceSchema = z.object({
    title: z.string().nonempty("Title is required"),
    description: z.string().nonempty("Description is required"),
    imagesUrl: z.array(z.string().url("Invalid URL format")).nonempty("At least one image URL is required"),
    priority: z.enum(["Low", "Medium", "High"], { message: "Priority must be one of: Low, Medium, High" }),
    expertise: z.enum(["Electrical", "Pool", "Construction"], { message: "Expertise is required" }),
})

type MaintenanceFormValues = z.infer<typeof MaintenanceSchema>

type MaintenanceFormProps = {
    onsubmit: (data: MaintenanceFormValues) => Promise<void>,
    oncancel: () => void,
    className?: string,
    initialData?: Maintenance,
    isUpdate?: boolean,
}
    
const MaintenanceForm = ({ onsubmit, oncancel, className, initialData, isUpdate }: MaintenanceFormProps) => {
    const [isLoading, setIsLoading] = useState(false)
    const { 
        control, 
        handleSubmit,
        setError
    } = useForm<MaintenanceFormValues>({
        resolver: zodResolver(MaintenanceSchema),
        defaultValues: {
            title: initialData?.title || "",
            description: initialData?.description || "",
            imagesUrl: initialData?.imagesUrl || [],
            priority: initialData?.priority || "Low",
            expertise: initialData?.expertise || "Electrical",
        },
        criteriaMode: "all",
    })

    const buttonText = isUpdate ? "Update Maintenance" : "Create Maintenance"

    const onSubmit = async (data: MaintenanceFormValues) => {
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
        className={cn("grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]", className)}
        >
            <div className="space-y-5">
                <FormSection title="Basic Information" contentClassName="space-y-5">
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
                            className="min-h-32 resize-none"
                            />

                            {fieldState.error && (
                                <FieldError errors={getErrorMessages(fieldState.error)} />
                            )}
                        </Field>
                    )}
                    />
                </FormSection>

                <FormSection title="Classification" contentClassName="space-y-5">
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
                            className="grid gap-3 md:grid-cols-3"
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

                    <Controller
                    name="expertise"
                    control={control}
                    render={({ field, fieldState }) => (
                        <FieldSet>
                            <FieldLegend data-invalid={fieldState.invalid} className="gap-1 data-[invalid=true]:text-destructive" variant="label">
                                Expertise <span className="text-red-700">*</span>
                            </FieldLegend>

                            <RadioGroup
                            name={field.name}
                            value={field.value}
                            onValueChange={(value) => field.onChange(value as MaintenanceExpertise)}
                            aria-invalid={fieldState.invalid}
                            className="grid gap-3 md:grid-cols-3"
                            >
                                <FieldLabel htmlFor="maintenance-expertise-electrical">
                                    <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                        <FieldContent>
                                            <FieldTitle>Electrical</FieldTitle>
                                            <FieldDescription>
                                                Use this for wiring, outlets, breakers, lighting, and electrical faults.
                                            </FieldDescription>
                                        </FieldContent>
                                        <RadioGroupItem
                                        value="Electrical"
                                        id="maintenance-expertise-electrical"
                                        aria-invalid={fieldState.invalid}
                                        />
                                    </Field>
                                </FieldLabel>

                                <FieldLabel htmlFor="maintenance-expertise-pool">
                                    <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                        <FieldContent>
                                            <FieldTitle>Pool</FieldTitle>
                                            <FieldDescription>
                                                Use this for pool equipment, pumps, water issues, and pool-area upkeep.
                                            </FieldDescription>
                                        </FieldContent>
                                        <RadioGroupItem
                                        value="Pool"
                                        id="maintenance-expertise-pool"
                                        aria-invalid={fieldState.invalid}
                                        />
                                    </Field>
                                </FieldLabel>

                                <FieldLabel htmlFor="maintenance-expertise-construction">
                                    <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                        <FieldContent>
                                            <FieldTitle>Construction</FieldTitle>
                                            <FieldDescription>
                                                Use this for structural repairs, furniture damage, and physical wear.
                                            </FieldDescription>
                                        </FieldContent>
                                        <RadioGroupItem
                                        value="Construction"
                                        id="maintenance-expertise-construction"
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
                </FormSection>

                <FormSection title="Issue Photos">
                    <Controller 
                    name="imagesUrl"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className="gap-1">
                                Images <span className="text-red-700">*</span>
                            </FieldLabel>
                
                            <CloudinaryUpload
                            purpose="MAINTENANCE_ISSUE"
                            onSuccess={(url) => field.onChange([...(field.value || []), url])}
                            onError={(err) => toast.error(err.message || "Image upload failed. Please try again.")}
                            />
                
                            {field.value.length > 0 ? (
                                <CloudinaryPreview 
                                images={field.value.map((url) => ({ url }))}
                                onRemove={(index) => field.onChange(field.value.filter((_, i) => i !== index))}
                                />
                            ) : null}
                
                            {fieldState.invalid && (
                                <FieldError errors={getErrorMessages(fieldState.error)} />
                            )}
                        </Field>
                    )}
                    />
                </FormSection>
            </div>

            <MaintenancePreviewCard
            control={control}
            buttonText={buttonText}
            isLoading={isLoading}
            oncancel={oncancel}
            initialData={initialData}
            />
        </form>
    )
}

export default MaintenanceForm
