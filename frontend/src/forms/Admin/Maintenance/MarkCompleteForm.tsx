import { CloudinaryPreview } from "@/components/common/CloudinaryPreview"
import { CloudinaryUpload } from "@/components/common/CloudinaryUpload"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import LoadingSpinner from "@/components/ui/loadingSpinner"
import { Textarea } from "@/components/ui/textarea"
import { getErrorMessages } from "@/lib/getErrorMessages"
import { handleNestError, ValidationError } from "@/lib/handleNestError"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState, type ComponentProps } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

const MarkCompleteSchema = z.object({
    resolutionNotes: z.string().trim().min(1, "Resolution notes are required"),
    resolutionProofImages: z.array(z.url("Invalid URL format"))
      .min(1, "At least one proof image is required")
      .max(3, "A maximum of three proof images is allowed"),
})

export type markCompleteSchema = z.infer<typeof MarkCompleteSchema>

type MarkCompleteFormProps = {
  onsubmit: (data: markCompleteSchema) => Promise<void | any>
  oncancel: () => void
  className?: string
} & ComponentProps<"form">

const MarkCompleteForm = ({
  onsubmit, oncancel, className, ...props
}: MarkCompleteFormProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const {
    control,
    handleSubmit,
    setError
  } = useForm<markCompleteSchema>({
    resolver: zodResolver(MarkCompleteSchema),
    defaultValues: {
      resolutionNotes: "",
      resolutionProofImages: [],
    },
    criteriaMode: "all"
  })

  const onSubmit = async (data: markCompleteSchema) => {
    setIsLoading(true)
    try { 
      await onsubmit(data)
    } catch (error: any) {
      if(error instanceof ValidationError) {
        handleNestError(error.response, setError)
        return
      }

      return toast.error(error.message || "An error occurred while marking maintenance as complete")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form 
    onSubmit={handleSubmit(onSubmit)}
    className={cn("bg-white overflow-hidden", className)}
    {...props}
    >

      <Controller 
      name="resolutionNotes"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>
            Resolution Notes <span className="text-red-700">*</span>
          </FieldLabel>

          <Textarea 
          {...field}
          id={field.name}
          aria-invalid={fieldState.invalid}
          placeholder="Describe what was done to resolve the issue..."
          className="max-h-40"
          />

          <FieldDescription>
            Please provide details about the resolution for future reference
          </FieldDescription>

          {fieldState.invalid && (
            <FieldError errors={getErrorMessages(fieldState.error)} />
          )}
        </Field>
      )}
      />

      <Controller
      name="resolutionProofImages"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>
            Resolution Proof Images <span className="text-red-700">*</span>
          </FieldLabel>

          <FieldDescription>
            Upload 1 to 3 photos showing the completed work.
          </FieldDescription>

          {field.value.length < 3 ? (
            <CloudinaryUpload
            purpose="MAINTENANCE_RESOLUTION"
            onSuccess={(url) => field.onChange([...field.value, url])}
            onError={(err) => toast.error(err.message || "Image upload failed. Please try again.")}
            />
          ) : null}

          {field.value.length > 0 ? (
            <CloudinaryPreview
            images={field.value.map((url) => ({ url }))}
            onRemove={(index) => field.onChange(field.value.filter((_, currentIndex) => currentIndex !== index))}
            />
          ) : null}

          {fieldState.invalid && (
            <FieldError errors={getErrorMessages(fieldState.error)} />
          )}
        </Field>
      )}
      />

      <div className="flex justify-end gap-3">
        <Button variant="outline" disabled={isLoading} onClick={oncancel}>
          Cancel
        </Button>
        <Button disabled={isLoading} type="submit">
          {isLoading ? <LoadingSpinner /> : "Mark as Completed"}
        </Button>
      </div>
    </form>
  )
}

export default MarkCompleteForm
