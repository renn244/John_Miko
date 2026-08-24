import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import VirtualTourSceneForm from "@/forms/Admin/VirtualTour/VirtualTourSceneForm";
import {
  useDraftVirtualTourSceneMutation,
  useHideVirtualTourSceneMutation,
  usePublishVirtualTourSceneMutation,
  useUpdateVirtualTourSceneMutation,
} from "@/hooks/admin/virtual-tour.hook";
import { cn } from "@/lib/utils";
import { useVirtualTourAdminStore } from "@/store/admin/virtualTourAdmin.store";
import { isPanoramaReady } from "@/types/admin/virtual-tour.type";
import type {
  AdminVirtualTourScene,
  PanoramaPosition,
  UpdateVirtualTourSceneDto,
} from "@/types/admin/virtual-tour.type";
import { Eye, EyeOff, Send, Trash2, Upload } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { virtualTourSceneStatusStyles } from "./virtual-tour-admin";

type VirtualTourSceneInspectorProps = {
  scene: AdminVirtualTourScene;
  isStartingScene: boolean;
  getViewerPosition: () => PanoramaPosition | null;
  onDirtyChange: (dirty: boolean) => void;
};

const VirtualTourSceneInspector = ({
  scene,
  isStartingScene,
  getViewerPosition,
  onDirtyChange,
}: VirtualTourSceneInspectorProps) => {
  const [isFormDirty, setIsFormDirty] = useState(false);
  const setPanoramaUploadTarget = useVirtualTourAdminStore(
    (state) => state.setPanoramaUploadTarget,
  );
  const setDeleteSceneTarget = useVirtualTourAdminStore(
    (state) => state.setDeleteSceneTarget,
  );
  const updateScene = useUpdateVirtualTourSceneMutation();
  const publishScene = usePublishVirtualTourSceneMutation();
  const hideScene = useHideVirtualTourSceneMutation();
  const draftScene = useDraftVirtualTourSceneMutation();
  const panoramaReady = isPanoramaReady(scene);
  const isBusy = [
    updateScene,
    publishScene,
    hideScene,
    draftScene,
  ].some((mutation) => mutation.isPending);
  const deleteBlockedReason = isStartingScene
    ? "The starting scene cannot be deleted."
    : scene.incomingHotspots.length
      ? `Remove ${scene.incomingHotspots.length} incoming navigation hotspot${scene.incomingHotspots.length === 1 ? "" : "s"} first.`
      : null;

  const handleDirtyChange = useCallback(
    (dirty: boolean) => {
      setIsFormDirty(dirty);
      onDirtyChange(dirty);
    },
    [onDirtyChange],
  );

  const saveScene = async (data: UpdateVirtualTourSceneDto) => {
    await updateScene.mutateAsync({ sceneId: scene.id, data });
    toast.success("Scene saved");
  };

  const runStatusAction = async (action: "publish" | "hide" | "draft") => {
    const mutation =
      action === "publish"
        ? publishScene
        : action === "hide"
          ? hideScene
          : draftScene;
    try {
      await mutation.mutateAsync(scene.id);
      toast.success(
        action === "draft"
          ? "Scene moved to draft"
          : action === "hide"
            ? "Scene hidden"
            : "Scene published",
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : `Unable to ${action} the scene.`,
      );
    }
  };

  return (
    <Card className="min-w-0 gap-5 p-4 xl:h-full xl:min-h-0 xl:overflow-y-auto">
      <div>
        <p className="text-xs font-semibold text-muted-foreground">
          Scene settings
        </p>
        <h2 className="mt-1 text-lg font-semibold">{scene.name}</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge
            className={cn(
              "capitalize",
              virtualTourSceneStatusStyles[scene.status],
            )}
          >
            {scene.status.toLowerCase()}
          </Badge>
          <Badge
            className={cn(
              panoramaReady
                ? "bg-emerald-100 text-emerald-800"
                : "bg-slate-100 text-slate-700",
            )}
          >
            {panoramaReady ? "Panorama ready" : "No panorama"}
          </Badge>
        </div>
      </div>

      <VirtualTourSceneForm
        scene={scene}
        panoramaReady={panoramaReady}
        disabled={isBusy}
        getViewerPosition={getViewerPosition}
        onDirtyChange={handleDirtyChange}
        onsubmit={saveScene}
      />

      <Button
        variant="outline"
        onClick={() =>
          setPanoramaUploadTarget({ id: scene.id, name: scene.name })
        }
        disabled={isBusy}
      >
        <Upload className="size-4" />
        {panoramaReady ? "Replace panorama" : "Upload panorama"}
      </Button>

      <div className="border-t pt-4">
        <p className="text-sm font-medium">Visibility</p>
        <div className="mt-3 grid gap-2">
          {scene.status !== "PUBLISHED" ? (
            <Button
              onClick={() => runStatusAction("publish")}
              disabled={isBusy || !panoramaReady || isFormDirty}
            >
              <Send className="size-4" /> Publish scene
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => runStatusAction("hide")}
              disabled={isBusy || isFormDirty}
            >
              <EyeOff className="size-4" /> Hide scene
            </Button>
          )}
          {scene.status === "HIDDEN" ? (
            <Button
              variant="outline"
              onClick={() => runStatusAction("draft")}
              disabled={isBusy || isFormDirty}
            >
              <Eye className="size-4" /> Return to draft
            </Button>
          ) : null}
          {!panoramaReady ? (
            <p className="text-xs text-muted-foreground">
              Upload a complete panorama before publishing.
            </p>
          ) : null}
        </div>
      </div>

      <div className="border-t pt-4">
        <Button
          className="w-full"
          variant={deleteBlockedReason ? "outline" : "destructive"}
          disabled={isBusy || Boolean(deleteBlockedReason)}
          onClick={() =>
            setDeleteSceneTarget({ id: scene.id, name: scene.name })
          }
        >
          <Trash2 className="size-4" /> Delete scene
        </Button>
        {deleteBlockedReason ? (
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            {deleteBlockedReason}
          </p>
        ) : null}
      </div>
    </Card>
  );
};

export default VirtualTourSceneInspector;
