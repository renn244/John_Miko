import { CloudinaryPreview } from "@/components/common/CloudinaryPreview"
import { CloudinaryUpload } from "@/components/common/CloudinaryUpload"
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

const MenuItemSchema = z.object({
    imageUrl: z.url().nonempty({ message: "Image is required" }),
    name: z.string().nonempty({ message: "Name is required" }),
    description: z.string().nonempty({ message: "Description is required" }),
    price: z.number().min(0, { message: "Price must be a positive number" }),
    category: z.string().nonempty({ message: "Category is required" }),
    availability: z.enum(['Available', 'Unavailable'])
})

type menuItemSchema = z.infer<typeof MenuItemSchema>

type MenuItemFormProps = {
    onsubmit: (data: any) => Promise<void | any>,
    oncancel: () => void,
    className?: string,
    initialData?: menuItemSchema,
    isUpdate?: boolean
}

const MenuItemForm = ({ onsubmit, oncancel, className, initialData, isUpdate }: MenuItemFormProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const {
        control,
        handleSubmit,
        setError
    } = useForm<menuItemSchema>({
        resolver: zodResolver(MenuItemSchema),
        defaultValues: {
            imageUrl: initialData?.imageUrl || '',
            name: initialData?.name || '',
            description: initialData?.description || '',
            price: initialData?.price || 0,
            category: initialData?.category || '',
            availability: initialData?.availability || 'Available'
        },
        criteriaMode: "all"
    })
    
    const buttonText = isUpdate ? 'Update Menu Item' : 'Add Menu Item'

    const onSubmit = async (data: menuItemSchema) => {
        setIsLoading(true)
        try {
            await onsubmit(data)
        } catch (error: any) {
            if(error instanceof ValidationError) {
                handleNestError(error.response, setError);
                return
            }

            toast.error('An unexpected error occurred. Please try again.');
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
                                    Item Name <span className="text-red-700">*</span>
                                </FieldLabel>
                                
                                <Input
                                {...field}
                                id={field.name}
                                aria-invalid={fieldState.invalid}
                                placeholder="e.g., Grilled Fish with Lemon Butter"
                                />

                                {fieldState.error && (
                                    <FieldError errors={getErrorMessages(fieldState.error)} />
                                )}
                            </Field>
                        )}
                        />

                        <div className="grid md:grid-cols-2 gap-5">
                            <Controller 
                            name="category"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name} className="gap-1">
                                        Category <span className="text-red-700">*</span>
                                    </FieldLabel>

                                    <Input 
                                    {...field}
                                    id={field.name}
                                    aria-invalid={fieldState.invalid}
                                    placeholder="e.g., Grilled Fish with Lemon Butter"
                                    />

                                    {fieldState.error && (
                                        <FieldError errors={getErrorMessages(fieldState.error)} />
                                    )}
                                </Field>
                            )}
                            />

                            <Controller 
                            name="price"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel htmlFor={field.name} className="gap-1">
                                        Price (₱) <span className="text-red-700">*</span>
                                    </FieldLabel>

                                    <Input
                                    id={field.name}
                                    type="number"
                                    aria-invalid={fieldState.invalid}
                                    {...field}
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                    placeholder="e.g., 450"
                                    />

                                    {fieldState.error && (
                                        <FieldError errors={getErrorMessages(fieldState.error)} />
                                    )}
                                </Field>
                            )}
                            />
                        </div>

                    </div>
                </div>

                <div>
                    <h2 className="text-lg font-bold mb-4 pb-2 border-b" style={{ color: '#1F2937', borderColor: '#E5E7EB' }}>
                        Description
                    </h2>
                    <Controller 
                    name="description"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel htmlFor={field.name} className="gap-1">
                                Item Description <span className="text-red-700">*</span>
                            </FieldLabel>
                                
                            <Textarea
                            {...field}
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                            rows={3}
                            placeholder="Provide a detailed description of the dish, including key ingredient and cooking methods..."
                            />

                            <FieldDescription>
                                This will be shown to guests when browsing the menu
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
                        Media
                    </h2>
                    <Controller
                    name="imageUrl"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className="gap-1">
                                Image <span className="text-red-700">*</span>
                            </FieldLabel>

                            {!field.value && (
                                <CloudinaryUpload
                                onSuccess={(url) => field.onChange(url)}
                                onError={(err) => setError('imageUrl', { type: 'manual', message: err.message })}
                                />
                            )}

                            {field.value && (
                                <CloudinaryPreview 
                                images={[{ url: field.value }]}
                                onRemove={() => field.onChange("")}
                                />
                            )}

                            {fieldState.invalid && (
                                <FieldError errors={getErrorMessages(fieldState.error)} />
                            )}
                        </Field>
                    )}
                    />
                </div>

                {!isUpdate && (
                    <div>
                        <h2 className="text-lg font-bold mb-4 pb-2 border-b" style={{ color: '#1F2937', borderColor: '#E5E7EB' }}>
                            Availability
                        </h2>
                        <Controller 
                        name="availability"
                        control={control}
                        render={({ field, fieldState }) => (
                            <FieldSet data-invalid={fieldState.invalid}>
                                <FieldLegend data-invalid={fieldState.invalid} className="gap-1 data-[invalid=true]:text-destructive" variant="label">
                                    Initial Availability Status <span className="text-red-700">*</span>
                                </FieldLegend >
                                
                                <RadioGroup
                                {...field}
                                name={field.name}
                                value={field.value}
                                onValueChange={field.onChange}
                                aria-invalid={fieldState.invalid}
                                className="grid md:grid-cols-2 gap-3"
                                >
                                    <FieldLabel htmlFor="form-rhf-radiogroup-Available">
                                        <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                            <FieldContent>
                                                <FieldTitle>Available</FieldTitle>
                                                <FieldDescription>
                                                    It will be available for customers after creation.
                                                </FieldDescription>
                                            </FieldContent>
                                            <RadioGroupItem
                                            value="Available"
                                            id="form-rhf-radiogroup-Available"
                                            aria-invalid={fieldState.invalid}
                                            />
                                        </Field>
                                    </FieldLabel>
                                    <FieldLabel htmlFor="form-rhf-radiogroup-Unavailable">
                                        <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                            <FieldContent>
                                                <FieldTitle>Unavailable</FieldTitle>
                                                <FieldDescription>
                                                    It will not be available for customers after creation.
                                                </FieldDescription>
                                            </FieldContent>
                                            <RadioGroupItem
                                            value="Unavailable"
                                            id="form-rhf-radiogroup-Unavailable"
                                            aria-invalid={fieldState.invalid}
                                            />
                                        </Field>
                                    </FieldLabel>
                                </RadioGroup>

                                <FieldDescription className="text-xs mt-2" style={{ color: '#9CA3AF' }}>
                                    You can change this status later from the menu management page
                                </FieldDescription>

                                {fieldState.invalid && (
                                    <FieldError errors={getErrorMessages(fieldState.error)} />
                                )}
                            </FieldSet>
                        )}
                        />
                    </div>
                )}
            </div>

            <div className="px-6 md:px-8 py-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50">
                <p className="text-sm text-muted-foreground">
                    <span className="text-red-700">*</span> Required fields
                </p>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button onClick={oncancel} type="button" variant="outline">
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

export default MenuItemForm