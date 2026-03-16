import { Button } from "@/components/ui/button"
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel, FieldTitle } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import LoadingSpinner from "@/components/ui/loadingSpinner"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InputTags } from "@/components/ui/tag-input"
import { Textarea } from "@/components/ui/textarea"
import { getErrorMessages } from "@/lib/getErrorMessages"
import { handleNestError, ValidationError } from "@/lib/handleNestError"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

const AccommodationSchema = z.object({
    name: z.string()
        .nonempty("Name is required"),
    type: z.enum(["room", "cottage", "event-hall"])
        .nonoptional("Type is required"),
    capacity: z.number()
        .nonnegative("Capicity must be a positive number")
        .int("Capicity must be an integer"),
    price: z.number()
        .nonnegative("Price must be a positive number"),
    description: z.string()
        .nonempty("Description is required"),
    imageUrl: z.url()
        .nonempty("Image URL is required"),
    amenities: z.array(z.string()),
    availability: z.enum(["available", "unavailable", "maintenance"])
})

type accommodationSchema = z.infer<typeof AccommodationSchema>

type AccommodationFormProps = {
    onsubmit: (data: z.infer<typeof AccommodationSchema>) => Promise<void>,
    oncancel: () => void,
    className?: string,
    initialData?: any,
    isUpdate?: boolean,
}

const AccommodationForm = ({ onsubmit, oncancel, className, initialData, isUpdate }: AccommodationFormProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const {
        handleSubmit,
        control,
        setError
    } = useForm<accommodationSchema>({
        resolver:  zodResolver(AccommodationSchema),
        defaultValues: {
            name: initialData?.name || "",
            type: initialData?.type || "room",
            capacity: initialData?.capacity || 0,
            price: initialData?.price || 0,
            description: initialData?.description || "",
            imageUrl: initialData?.imageUrl || "",
            amenities: initialData?.amenities || [],
            availability: initialData?.availability || "available"
        },
        criteriaMode: "all"
    })

    const buttonText = isUpdate ? "Save" : "Create";

    const onSubmit = async (data: accommodationSchema) => {
        setIsLoading(true);
        try {
            await onsubmit(data);
        } catch (error: any) {
            if(error instanceof ValidationError) {
                handleNestError(error.response, setError);
                return
            }

            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={cn("bg-white rounded-xl shadow-sm border overflow-hidden", className)}>
            <div className="p-6 md:p-8 space-y-6">

                <div>
                    <h2 className="text-lg font-bold mb-4 pb-2 border-b">
                        Basic Information
                    </h2>
                    <div className="space-y-5">

                        <Controller 
                        name="name"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="grid gap-2">
                                
                                <FieldLabel htmlFor={field.name}>Accommodation Name</FieldLabel>
                                
                                <Input 
                                id={field.name}
                                placeholder="e.g., Deluxe Ocean View Room"
                                aria-invalid={fieldState.invalid}
                                {...field}
                                />
                                
                                {fieldState.invalid && (
                                    <FieldError errors={getErrorMessages(fieldState.error)} />
                                )}

                            </Field>
                        )}
                        />

                        <div className="grid md:grid-cols-2 gap-5">
                            <Controller 
                            name="type"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className="grid gap-2">
                                    
                                    <FieldLabel htmlFor={field.name}>Type</FieldLabel>
                                
                                    <Select 
                                    name={field.name}
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    >
                                        <SelectTrigger id={field.name} aria-invalid={fieldState.invalid}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Accommodation Type</SelectLabel>
                                                <SelectItem value="room">Room</SelectItem>
                                                <SelectItem value="cottage">Cottage</SelectItem>
                                                <SelectItem value="event-hall">Event Hall</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>

                                    {fieldState.invalid && (
                                        <FieldError errors={getErrorMessages(fieldState.error)} />
                                    )}
                                </Field>
                            )}
                            />

                            <Controller 
                            name="capacity"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className="grid gap-2">
                                    <FieldLabel htmlFor={field.name}>Capacity (pax)</FieldLabel>

                                    <Input 
                                    id={field.name}
                                    type="number"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Enter capacity"
                                    {...field}
                                    />
                                    
                                    {fieldState.invalid && (
                                        <FieldError errors={getErrorMessages(fieldState.error)} />
                                    )}
                                </Field>
                            )}
                            />

                        </div>

                        <Controller 
                        name="price"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="grid gap-2">
                                <FieldLabel htmlFor={field.name}>Price</FieldLabel>

                                <Input 
                                id={field.name}
                                type="number"
                                aria-invalid={fieldState.invalid}
                                placeholder="Enter price"
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

                <div>

                    <h2 className="text-lg font-bold mb-4 pb-2 border-b">
                        Description
                    </h2>

                    <Controller 
                    name="description"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="grid gaps-2">
                            <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                            
                            <Textarea 
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                            placeholder="Enter description"
                            {...field}
                            />

                            {fieldState.invalid ? (
                                <FieldError errors={getErrorMessages(fieldState.error)} />
                            ) : (
                                 <FieldDescription>
                                    This will be shown to guests when browsing accommodations, so make it more detailed and enticing!
                                </FieldDescription>
                            )}
                        </Field>
                    )}
                    />

                </div>

                <div>

                    <h2 className="text-lg font-bold mb-4 pb-2 border-b">
                        Media
                    </h2>

                    <Controller 
                    name="imageUrl"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="grid gaps-2">
                            <FieldLabel htmlFor={field.name}>Image URL</FieldLabel>
                            
                            {/* Should be images later not url */}
                            <Input 
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                            type="text"
                            placeholder="Enter Image URL"
                            {...field}
                            />

                            {/* ADD IMAGE PREVIEW LATER! */}

                            {fieldState.invalid && (
                                <FieldError errors={getErrorMessages(fieldState.error)} />
                            )}
                            
                        </Field>
                    )}
                    />

                    

                </div>

                <div>

                    <h2 className="text-lg font-bold mb-4 pb-2 border-b">
                        Amenities
                    </h2>
                    
                    <Controller 
                    name="amenities"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="grid gap-2">
                            <FieldLabel htmlFor={field.name}>Amenities</FieldLabel>

                            <InputTags 
                            value={field.value}
                            onChange={field.onChange}
                            />

                            {fieldState.invalid && (
                                <FieldError errors={getErrorMessages(fieldState.error)} />
                            )}
                        </Field>
                    )}
                    />
                    
                </div>

                <div>
                    
                    <h2 className="text-lg font-bold mb-4 pb-2 border-b">
                        Availability
                    </h2>

                    <div>
                        <Label className="mb-2">
                            Initial Availability Status
                        </Label>

                        <RadioGroup defaultValue="available" className="grid md:grid-cols-3 gap-3">
                            <FieldLabel htmlFor="available-status">
                                <Field orientation="horizontal">
                                    <FieldContent>
                                        <FieldTitle>Available</FieldTitle>
                                        <FieldDescription>
                                            The Accommodation is available upon creation.
                                        </FieldDescription>
                                    </FieldContent>
                                    <RadioGroupItem value="available" id="available-status" />
                                </Field>
                            </FieldLabel>
                            <FieldLabel htmlFor="unavailable-status">
                                <Field orientation="horizontal">
                                    <FieldContent>
                                        <FieldTitle>Unavailable</FieldTitle>
                                        <FieldDescription>
                                            The Accommodation is unavailable upon creation.
                                        </FieldDescription>
                                    </FieldContent>
                                    <RadioGroupItem value="unavailable" id="unavailable-status" />
                                </Field>
                            </FieldLabel>
                            <FieldLabel htmlFor="maintenance-status">
                                <Field orientation="horizontal">
                                    <FieldContent>
                                        <FieldTitle>Maintenance</FieldTitle>
                                        <FieldDescription>
                                            The Accommodation is under maintenance upon creation.
                                        </FieldDescription>
                                    </FieldContent>
                                    <RadioGroupItem value="maintenance" id="maintenance-status" />
                                </Field>
                            </FieldLabel>
                        </RadioGroup>
                    </div>

                </div>

            </div>

            <div 
            className="px-6 md:px-8 py-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{ backgroundColor: '#F9FAFB', borderColor: '#E5E7EB' }}
            >
                <p className="text-sm" style={{ color: '#6B7280' }}>
                    <span style={{ color: '#DC2626' }}>*</span> Required fields
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

export default AccommodationForm