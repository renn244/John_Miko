import { Button } from "@/components/ui/button"
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel, FieldSet, FieldTitle } from "@/components/ui/field"
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
    type: z.enum(["Room", "Cottage", "EventHall"])
        .nonoptional("Type is required"),
    capacity: z.number()
        .nonnegative("Capicity must be a positive number")
        .int("Capicity must be an integer")
        .min(1, "Capacity must be at least 1"),
    price: z.number()
        .nonnegative("Price must be a positive number")
        .min(1, "Price must be at least 1"),
    description: z.string()
        .nonempty("Description is required"),
    imageUrl: z.url()
        .nonempty("Image URL is required"),
    amenities: z.array(z.string()),
    availability: z.enum(["Available", "Unavailable", "Maintenance"])
})

type accommodationSchema = z.infer<typeof AccommodationSchema>

type AccommodationFormProps = {
    onsubmit: (data: accommodationSchema) => Promise<void | any>,
    oncancel: () => void,
    className?: string,
    initialData?: accommodationSchema,
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
            type: initialData?.type || "Room",
            capacity: initialData?.capacity || 0,
            price: initialData?.price || 0,
            description: initialData?.description || "",
            imageUrl: initialData?.imageUrl || "",
            amenities: initialData?.amenities || [],
            availability: initialData?.availability || "Available"
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
        <form 
        className={cn("bg-white rounded-xl shadow-sm border overflow-hidden", className)}
        onSubmit={handleSubmit(onSubmit)}
        >
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
                                                <SelectItem value="Room">Room</SelectItem>
                                                <SelectItem value="Cottage">Cottage</SelectItem>
                                                <SelectItem value="EventHall">Event Hall</SelectItem>
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
                                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
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
                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
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

                        <Controller 
                        name="availability"
                        control={control}
                        render={({ field, fieldState }) => (
                            <FieldSet data-invalid={fieldState.invalid}>
                                <RadioGroup 
                                name={field.name}
                                value={field.value}
                                onValueChange={field.onChange}
                                aria-invalid={fieldState.invalid} 
                                className="grid md:grid-cols-3 gap-3"
                                >
                                    <FieldLabel htmlFor="available-status">
                                        <Field data-invalid={fieldState.invalid} orientation="horizontal">
                                            <FieldContent>
                                                <FieldTitle>Available</FieldTitle>
                                                <FieldDescription>
                                                    The Accommodation is available upon creation.
                                                </FieldDescription>
                                            </FieldContent>
                                            <RadioGroupItem value="Available" id="available-status" />
                                        </Field>
                                    </FieldLabel>
                                    <FieldLabel htmlFor="unavailable-status">
                                        <Field  data-invalid={fieldState.invalid} orientation="horizontal">
                                            <FieldContent>
                                                <FieldTitle>Unavailable</FieldTitle>
                                                <FieldDescription>
                                                    The Accommodation is unavailable upon creation.
                                                </FieldDescription>
                                            </FieldContent>
                                            <RadioGroupItem value="Unavailable" id="unavailable-status" />
                                        </Field>
                                    </FieldLabel>
                                    <FieldLabel htmlFor="maintenance-status">
                                        <Field data-invalid={fieldState.invalid} orientation="horizontal">
                                            <FieldContent>
                                                <FieldTitle>Maintenance</FieldTitle>
                                                <FieldDescription>
                                                    The Accommodation is under maintenance upon creation.
                                                </FieldDescription>
                                            </FieldContent>
                                            <RadioGroupItem value="Maintenance" id="maintenance-status" />
                                        </Field>
                                    </FieldLabel>
                                </RadioGroup>

                                {fieldState.invalid && (
                                    <FieldError errors={getErrorMessages(fieldState.error)} />
                                )}
                            </FieldSet>
                        )}
                        />
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