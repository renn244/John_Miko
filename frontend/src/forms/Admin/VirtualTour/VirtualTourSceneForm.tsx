import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { getErrorMessages } from "@/lib/getErrorMessages";
import { handleNestError, ValidationError } from "@/lib/handleNestError";
import type {
  AdminVirtualTourScene,
  PanoramaPosition,
  UpdateVirtualTourSceneDto,
} from "@/types/admin/virtual-tour.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { LocateFixed, Save } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const SceneSchema = z.object({
  name: z.string().min(1, "Scene name is required").max(120),
  initialYaw: z.number(),
  initialPitch: z.number(),
});

type SceneFormValues = z.infer<typeof SceneSchema>;

type VirtualTourSceneFormProps = {
  scene: AdminVirtualTourScene;
  panoramaReady: boolean;
  disabled: boolean;
  getViewerPosition: () => PanoramaPosition | null;
  onDirtyChange: (dirty: boolean) => void;
  onsubmit: (data: UpdateVirtualTourSceneDto) => Promise<void>;
};

const VirtualTourSceneForm = ({
  scene,
  panoramaReady,
  disabled,
  getViewerPosition,
  onDirtyChange,
  onsubmit,
}: VirtualTourSceneFormProps) => {
  const {
    control,
    handleSubmit,
    reset,
    setError,
    setValue,
    formState: { dirtyFields, isDirty, isSubmitting },
  } = useForm<SceneFormValues>({
    resolver: zodResolver(SceneSchema),
    defaultValues: {
      name: scene.name,
      initialYaw: scene.initialYaw,
      initialPitch: scene.initialPitch,
    },
    criteriaMode: "all",
  });

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  const onSubmit = async (data: SceneFormValues) => {
    try {
      await onsubmit(data);
      reset(data);
    } catch (error) {
      if (error instanceof ValidationError) {
        handleNestError(error.response, setError);
        return;
      }
      toast.error(
        error instanceof Error ? error.message : "Unable to save the scene.",
      );
    }
  };

  const captureDefaultView = () => {
    const position = getViewerPosition();
    if (!position) return;
    setValue("initialYaw", position.yaw, { shouldDirty: true });
    setValue("initialPitch", position.pitch, { shouldDirty: true });
    toast.success("Current view captured", {
      description: "Save the scene to keep it.",
    });
  };

  const defaultViewChanged =
    Boolean(dirtyFields.initialYaw) || Boolean(dirtyFields.initialPitch);

  return (
    <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)}>
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
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid ? (
              <FieldError errors={getErrorMessages(fieldState.error)} />
            ) : null}
          </Field>
        )}
      />

      <div className="rounded-lg border p-3">
        <p className="text-sm font-medium">Default arrival view</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Rotate the panorama to the direction guests should face when entering
          this scene.
        </p>
        <Button
          className="mt-3 w-full"
          type="button"
          variant="outline"
          disabled={!panoramaReady || disabled}
          onClick={captureDefaultView}
        >
          <LocateFixed className="size-4" /> Set current view as default
        </Button>
        {defaultViewChanged ? (
          <p className="mt-2 text-xs font-medium text-emerald-700">
            New default view ready to save.
          </p>
        ) : null}
      </div>

      <Button type="submit" disabled={!isDirty || disabled || isSubmitting}>
        {isSubmitting ? <LoadingSpinner /> : <Save className="size-4" />}
        Save scene
      </Button>
    </form>
  );
};

export default VirtualTourSceneForm;
