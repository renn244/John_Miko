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
    resolutionNotes: z.string()
      .nonempty("Resolution notes are required")
      .min(20, "Resolution notes must be at least 20 characters")
      .max(400, "Resolution notes must be less than 500 characters")
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
      resolutionNotes: ""
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