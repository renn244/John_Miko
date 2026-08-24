import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { getErrorMessages } from "@/lib/getErrorMessages";
import { handleNestError, ValidationError } from "@/lib/handleNestError";
import type { CreateVirtualTourSceneDto } from "@/types/admin/virtual-tour.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const StartingSceneSchema = z.object({
  name: z.string().min(1, "Scene name is required").max(120),
});

type StartingSceneFormValues = z.infer<typeof StartingSceneSchema>;

type VirtualTourStartingSceneFormProps = {
  onsubmit: (data: CreateVirtualTourSceneDto) => Promise<void>;
};

const VirtualTourStartingSceneForm = ({
  onsubmit,
}: VirtualTourStartingSceneFormProps) => {
  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = useForm<StartingSceneFormValues>({
    resolver: zodResolver(StartingSceneSchema),
    defaultValues: { name: "" },
    criteriaMode: "all",
  });

  const onSubmit = async (data: StartingSceneFormValues) => {
    try {
      await onsubmit(data);
    } catch (error) {
      if (error instanceof ValidationError) {
        handleNestError(error.response, setError);
        return;
      }
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to create the starting scene.",
      );
    }
  };

  return (
    <form
      className="mt-6 w-full max-w-sm space-y-4 text-left"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="grid gap-2">
            <FieldLabel htmlFor={field.name}>Scene name</FieldLabel>
            <Input
              {...field}
              id={field.name}
              maxLength={120}
              placeholder="e.g. Resort entrance"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid ? (
              <FieldError errors={getErrorMessages(fieldState.error)} />
            ) : null}
          </Field>
        )}
      />

      <Button className="w-full" type="submit" disabled={isSubmitting}>
        {isSubmitting ? <LoadingSpinner /> : <Plus className="size-4" />}
        Create starting scene
      </Button>
    </form>
  );
};

export default VirtualTourStartingSceneForm;
