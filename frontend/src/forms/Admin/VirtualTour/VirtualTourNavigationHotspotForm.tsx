import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { getErrorMessages } from "@/lib/getErrorMessages";
import { handleNestError, ValidationError } from "@/lib/handleNestError";
import type {
  AdminVirtualTourHotspot,
  AdminVirtualTourScene,
} from "@/types/admin/virtual-tour.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export const NEW_CONNECTED_SCENE_VALUE = "__new_scene__";

const NavigationHotspotSchema = z
  .object({
    label: z.string().min(1, "Hotspot label is required").max(120),
    targetSceneId: z.string().min(1, "Destination is required"),
    connectedSceneName: z.string().max(120),
    isActive: z.boolean(),
  })
  .superRefine((data, context) => {
    if (
      data.targetSceneId === NEW_CONNECTED_SCENE_VALUE &&
      !data.connectedSceneName
    ) {
      context.addIssue({
        code: "custom",
        path: ["connectedSceneName"],
        message: "Connected scene name is required",
      });
    }
  });

export type NavigationHotspotFormValues = z.infer<
  typeof NavigationHotspotSchema
>;

type VirtualTourNavigationHotspotFormProps = {
  sourceScene: AdminVirtualTourScene;
  scenes: AdminVirtualTourScene[];
  hotspot: AdminVirtualTourHotspot | null;
  disabled: boolean;
  onDirtyChange: (dirty: boolean) => void;
  onsubmit: (data: NavigationHotspotFormValues) => Promise<void>;
};

const VirtualTourNavigationHotspotForm = ({
  sourceScene,
  scenes,
  hotspot,
  disabled,
  onDirtyChange,
  onsubmit,
}: VirtualTourNavigationHotspotFormProps) => {
  const isUpdate = Boolean(hotspot);
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isDirty, isSubmitting },
  } = useForm<NavigationHotspotFormValues>({
    resolver: zodResolver(NavigationHotspotSchema),
    defaultValues: {
      label: hotspot?.label || "",
      targetSceneId:
        hotspot?.targetSceneId ||
        (isUpdate ? "" : NEW_CONNECTED_SCENE_VALUE),
      connectedSceneName: "",
      isActive: hotspot?.isActive ?? true,
    },
    criteriaMode: "all",
  });

  useEffect(() => {
    onDirtyChange(!isUpdate || isDirty);
  }, [isDirty, isUpdate, onDirtyChange]);

  const onSubmit = async (data: NavigationHotspotFormValues) => {
    try {
      await onsubmit(data);
      reset(data);
    } catch (error) {
      if (error instanceof ValidationError) {
        handleNestError(error.response, setError);
        return;
      }
      toast.error(
        error instanceof Error ? error.message : "Unable to save the hotspot.",
      );
    }
  };

  const targetSceneId = useWatch({ control, name: "targetSceneId" });

  return (
    <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="label"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="grid gap-2">
            <FieldLabel htmlFor={field.name}>Label</FieldLabel>
            <Input
              {...field}
              id={field.name}
              maxLength={120}
              placeholder="e.g. Continue to the pool"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid ? (
              <FieldError errors={getErrorMessages(fieldState.error)} />
            ) : null}
          </Field>
        )}
      />

      <Controller
        name="isActive"
        control={control}
        render={({ field }) => (
          <div className="flex items-center justify-between gap-4 rounded-lg border p-3">
            <div>
              <p className="text-sm font-medium">Active hotspot</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Inactive hotspots stay hidden from guests.
              </p>
            </div>
            <Switch
              aria-label="Active hotspot"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </div>
        )}
      />

      <Controller
        name="targetSceneId"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="grid gap-2">
            <FieldLabel>Destination</FieldLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger
                className="w-full"
                aria-invalid={fieldState.invalid}
              >
                <SelectValue placeholder="Choose a scene" />
              </SelectTrigger>
              <SelectContent>
                {!isUpdate ? (
                  <SelectItem value={NEW_CONNECTED_SCENE_VALUE}>
                    Create connected scene
                  </SelectItem>
                ) : null}
                {scenes
                  .filter((scene) => scene.id !== sourceScene.id)
                  .map((scene) => (
                    <SelectItem key={scene.id} value={scene.id}>
                      {scene.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {fieldState.invalid ? (
              <FieldError errors={getErrorMessages(fieldState.error)} />
            ) : null}
          </Field>
        )}
      />

      {targetSceneId === NEW_CONNECTED_SCENE_VALUE ? (
        <Controller
          name="connectedSceneName"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="grid gap-2">
              <FieldLabel htmlFor={field.name}>Connected scene name</FieldLabel>
              <Input
                {...field}
                id={field.name}
                maxLength={120}
                placeholder="e.g. Pool entrance"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid ? (
                <FieldError errors={getErrorMessages(fieldState.error)} />
              ) : (
                <p className="text-xs leading-5 text-muted-foreground">
                  The scene and this Navigation hotspot will be created
                  together.
                </p>
              )}
            </Field>
          )}
        />
      ) : null}

      <Button type="submit" disabled={disabled || isSubmitting}>
        {isSubmitting ? <LoadingSpinner /> : <Save className="size-4" />}
        {isUpdate ? "Save hotspot" : "Create hotspot"}
      </Button>
    </form>
  );
};

export default VirtualTourNavigationHotspotForm;
