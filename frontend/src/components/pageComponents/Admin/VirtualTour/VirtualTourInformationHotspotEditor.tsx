import { Button } from "@/components/ui/button";
import VirtualTourInformationHotspotForm from "@/forms/Admin/VirtualTour/VirtualTourInformationHotspotForm";
import type { InformationHotspotFormValues } from "@/forms/Admin/VirtualTour/VirtualTourInformationHotspotForm";
import {
  useCreateInformationHotspotMutation,
  useUpdateInformationHotspotMutation,
} from "@/hooks/admin/virtual-tour.hook";
import { useVirtualTourAdminStore } from "@/store/admin/virtualTourAdmin.store";
import type {
  AdminVirtualTourHotspot,
  AdminVirtualTourScene,
  InformationHotspotDto,
  PanoramaPosition,
} from "@/types/admin/virtual-tour.type";
import { LocateFixed, Trash2 } from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";

type VirtualTourInformationHotspotEditorProps = {
  sourceScene: AdminVirtualTourScene;
  hotspot: AdminVirtualTourHotspot | null;
  position: PanoramaPosition;
  positionChanged: boolean;
  onDirtyChange: (dirty: boolean) => void;
  onSaved: (hotspotId: string) => void;
  onMove: () => void;
};

const VirtualTourInformationHotspotEditor = ({
  sourceScene,
  hotspot,
  position,
  positionChanged,
  onDirtyChange,
  onSaved,
  onMove,
}: VirtualTourInformationHotspotEditorProps) => {
  const createHotspot = useCreateInformationHotspotMutation();
  const updateHotspot = useUpdateInformationHotspotMutation();
  const setDeleteHotspotTarget = useVirtualTourAdminStore(
    (state) => state.setDeleteHotspotTarget,
  );
  const isUpdate = Boolean(hotspot);
  const isBusy = createHotspot.isPending || updateHotspot.isPending;

  const handleDirtyChange = useCallback(
    (dirty: boolean) => onDirtyChange(dirty || positionChanged),
    [onDirtyChange, positionChanged],
  );

  const saveHotspot = async (values: InformationHotspotFormValues) => {
    const data: InformationHotspotDto = {
      ...values,
      ...position,
      icon: hotspot?.icon ?? null,
    };
    const saved = hotspot
      ? await updateHotspot.mutateAsync({ hotspotId: hotspot.id, data })
      : await createHotspot.mutateAsync({ sceneId: sourceScene.id, data });

    onSaved(saved.id);
    toast.success(isUpdate ? "Hotspot saved" : "Hotspot created");
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

      <VirtualTourInformationHotspotForm
        hotspot={hotspot}
        disabled={isBusy}
        onDirtyChange={handleDirtyChange}
        onsubmit={saveHotspot}
      />

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

export default VirtualTourInformationHotspotEditor;
