import { Button } from "@/components/ui/button";
import VirtualTourNavigationHotspotForm, {
  NEW_CONNECTED_SCENE_VALUE,
} from "@/features/admin/virtual-tour/forms/VirtualTourNavigationHotspotForm";
import type { NavigationHotspotFormValues } from "@/features/admin/virtual-tour/forms/VirtualTourNavigationHotspotForm";
import {
  useCreateConnectedSceneMutation,
  useCreateNavigationHotspotMutation,
  useUpdateNavigationHotspotMutation,
} from "@/features/admin/virtual-tour/hooks/useVirtualTourAdmin";
import { useVirtualTourAdminStore } from "@/features/admin/virtual-tour/store/virtualTourAdmin.store";
import {
  getNavigationHotspotUpdate,
  isPanoramaReady,
} from "@/features/admin/virtual-tour/types/virtual-tour.type";
import type {
  AdminVirtualTourHotspot,
  AdminVirtualTourScene,
  NavigationHotspotDto,
  PanoramaPosition,
} from "@/features/admin/virtual-tour/types/virtual-tour.type";
import { LocateFixed, Trash2 } from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";

type VirtualTourNavigationHotspotEditorProps = {
  sourceScene: AdminVirtualTourScene;
  scenes: AdminVirtualTourScene[];
  hotspot: AdminVirtualTourHotspot | null;
  position: PanoramaPosition;
  positionChanged: boolean;
  onDirtyChange: (dirty: boolean) => void;
  onSaved: (hotspotId: string) => void;
  onMove: () => void;
  onConnectedSceneCreated: (scene: { id: string; name: string }) => void;
  onBeginArrivalCapture: (hotspot: AdminVirtualTourHotspot) => void;
};

const VirtualTourNavigationHotspotEditor = ({
  sourceScene,
  scenes,
  hotspot,
  position,
  positionChanged,
  onDirtyChange,
  onSaved,
  onMove,
  onConnectedSceneCreated,
  onBeginArrivalCapture,
}: VirtualTourNavigationHotspotEditorProps) => {
  const createHotspot = useCreateNavigationHotspotMutation();
  const updateHotspot = useUpdateNavigationHotspotMutation();
  const createConnectedScene = useCreateConnectedSceneMutation();
  const setDeleteHotspotTarget = useVirtualTourAdminStore(
    (state) => state.setDeleteHotspotTarget,
  );
  const isUpdate = Boolean(hotspot);
  const isBusy =
    createHotspot.isPending ||
    updateHotspot.isPending ||
    createConnectedScene.isPending;
  const destinationScene = scenes.find(
    (scene) => scene.id === hotspot?.targetSceneId,
  );

  const handleDirtyChange = useCallback(
    (dirty: boolean) => onDirtyChange(dirty || positionChanged),
    [onDirtyChange, positionChanged],
  );

  const saveHotspot = async (values: NavigationHotspotFormValues) => {
    if (!hotspot && values.targetSceneId === NEW_CONNECTED_SCENE_VALUE) {
      const result = await createConnectedScene.mutateAsync({
        sceneId: sourceScene.id,
        data: {
          hotspot: {
            ...position,
            label: values.label,
            isActive: values.isActive,
          },
          scene: { name: values.connectedSceneName },
        },
      });
      onConnectedSceneCreated(result.scene);
      toast.success("Connected scene created");
      return;
    }

    const keepsDestination = hotspot?.targetSceneId === values.targetSceneId;
    const data: NavigationHotspotDto = {
      ...position,
      label: values.label,
      isActive: values.isActive,
      icon: hotspot?.icon ?? null,
      targetSceneId: values.targetSceneId,
      targetYaw: keepsDestination ? (hotspot?.targetYaw ?? null) : null,
      targetPitch: keepsDestination ? (hotspot?.targetPitch ?? null) : null,
    };
    const saved = hotspot
      ? await updateHotspot.mutateAsync({ hotspotId: hotspot.id, data })
      : await createHotspot.mutateAsync({ sceneId: sourceScene.id, data });

    onSaved(saved.id);
    toast.success(isUpdate ? "Hotspot saved" : "Hotspot created");
  };

  const removeArrivalOverride = async () => {
    if (!hotspot) return;
    try {
      await updateHotspot.mutateAsync({
        hotspotId: hotspot.id,
        data: getNavigationHotspotUpdate(hotspot, null, null),
      });
      toast.success("Arrival override removed");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update the arrival view.",
      );
    }
  };

  return (
    <div className="grid gap-5">
      {isUpdate ? (
        <div className="grid gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onMove}
            disabled={isBusy}
          >
            <LocateFixed className="size-4" /> Move hotspot
          </Button>
          {positionChanged ? (
            <p className="text-xs font-medium text-emerald-700">
              New hotspot position ready to save.
            </p>
          ) : null}
        </div>
      ) : null}

      <VirtualTourNavigationHotspotForm
        sourceScene={sourceScene}
        scenes={scenes}
        hotspot={hotspot}
        disabled={isBusy}
        onDirtyChange={handleDirtyChange}
        onsubmit={saveHotspot}
      />

      {hotspot?.targetSceneId && destinationScene ? (
        <div className="rounded-lg border p-3">
          <p className="text-sm font-medium">Arrival view</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {hotspot.targetYaw != null
              ? "This connection has its own arrival direction."
              : "Guests use the destination scene’s default view."}
          </p>
          <div className="mt-3 grid gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={!isPanoramaReady(destinationScene) || isBusy}
              onClick={() => onBeginArrivalCapture(hotspot)}
            >
              <LocateFixed className="size-4" /> Set arrival view
            </Button>
            {hotspot.targetYaw != null ? (
              <Button
                type="button"
                variant="ghost"
                onClick={() => void removeArrivalOverride()}
                disabled={isBusy}
              >
                Remove override
              </Button>
            ) : null}
          </div>
          {!isPanoramaReady(destinationScene) ? (
            <p className="mt-2 text-xs text-muted-foreground">
              Upload the destination panorama first.
            </p>
          ) : null}
        </div>
      ) : null}

      {hotspot ? (
        <Button
          type="button"
          variant="destructive"
          disabled={isBusy}
          onClick={() =>
            setDeleteHotspotTarget({ id: hotspot.id, label: hotspot.label })
          }
        >
          <Trash2 className="size-4" /> Delete hotspot
        </Button>
      ) : null}
    </div>
  );
};

export default VirtualTourNavigationHotspotEditor;
