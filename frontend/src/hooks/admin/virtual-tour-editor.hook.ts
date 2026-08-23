import { useUpdateNavigationHotspotMutation } from "@/hooks/admin/virtual-tour.hook";
import { useVirtualTourAdminStore } from "@/store/admin/virtualTourAdmin.store";
import {
  getNavigationHotspotUpdate,
  isPanoramaReady,
} from "@/types/admin/virtual-tour.type";
import type {
  AdminVirtualTour,
  AdminVirtualTourHotspot,
  AdminVirtualTourScene,
  NewVirtualTourHotspot,
  PanoramaPosition,
  VirtualTourHotspotType,
} from "@/types/admin/virtual-tour.type";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export type VirtualTourPlacementMode =
  | "INFORMATION"
  | "NAVIGATION"
  | "MOVE"
  | null;

type ArrivalCapture = {
  sourceSceneId: string;
  hotspotId: string;
  hotspotLabel: string;
  hotspot: AdminVirtualTourHotspot;
};

type PendingEditorAction =
  | { type: "scene"; sceneId: string }
  | { type: "hotspot"; hotspotId: string }
  | { type: "close" }
  | {
      type: "place";
      placement: Exclude<VirtualTourPlacementMode, "MOVE" | null>;
    };

type UseVirtualTourEditorOptions = {
  tour: AdminVirtualTour | undefined;
  selectedScene: AdminVirtualTourScene | null;
  setSceneQuery: (sceneId: string) => void;
};

export const useVirtualTourEditor = ({
  tour,
  selectedScene,
  setSceneQuery,
}: UseVirtualTourEditorOptions) => {
  const selectedHotspotId = useVirtualTourAdminStore(
    (state) => state.selectedHotspotId,
  );
  const setSelectedHotspotId = useVirtualTourAdminStore(
    (state) => state.setSelectedHotspotId,
  );
  const setPanoramaUploadTarget = useVirtualTourAdminStore(
    (state) => state.setPanoramaUploadTarget,
  );
  const updateNavigationHotspot = useUpdateNavigationHotspotMutation();
  const [newHotspot, setNewHotspot] =
    useState<NewVirtualTourHotspot | null>(null);
  const [positionOverride, setPositionOverride] =
    useState<PanoramaPosition | null>(null);
  const [placementMode, setPlacementMode] =
    useState<VirtualTourPlacementMode>(null);
  const [isInspectorDirty, setIsInspectorDirty] = useState(false);
  const [pendingAction, setPendingAction] =
    useState<PendingEditorAction | null>(null);
  const [arrivalCapture, setArrivalCapture] =
    useState<ArrivalCapture | null>(null);
  const [previewArrival, setPreviewArrival] =
    useState<PanoramaPosition | null>(null);

  const selectedHotspot =
    selectedScene?.outgoingHotspots.find(
      (hotspot) => hotspot.id === selectedHotspotId,
    ) || null;

  const clearInspector = useCallback(() => {
    setSelectedHotspotId(null);
    setNewHotspot(null);
    setPositionOverride(null);
    setPlacementMode(null);
    setIsInspectorDirty(false);
  }, [setSelectedHotspotId]);

  const applyEditorAction = useCallback(
    (action: PendingEditorAction) => {
      clearInspector();
      if (action.type === "scene") {
        setPreviewArrival(null);
        setSceneQuery(action.sceneId);
        return;
      }
      if (action.type === "hotspot") {
        setSelectedHotspotId(action.hotspotId);
        return;
      }
      if (action.type === "place") setPlacementMode(action.placement);
    },
    [clearInspector, setSceneQuery, setSelectedHotspotId],
  );

  const requestEditorAction = useCallback(
    (action: PendingEditorAction) => {
      if (arrivalCapture) {
        toast.info("Finish or cancel the arrival-view capture first.");
        return;
      }
      if (isInspectorDirty) {
        setPendingAction(action);
        return;
      }
      applyEditorAction(action);
    },
    [applyEditorAction, arrivalCapture, isInspectorDirty],
  );

  const selectHotspot = (
    hotspot: AdminVirtualTourHotspot,
    isPreview: boolean,
  ) => {
    if (!isPreview) {
      requestEditorAction({ type: "hotspot", hotspotId: hotspot.id });
      return;
    }
    if (hotspot.type !== "NAVIGATION") return;
    const destination = tour?.scenes.find(
      (scene) => scene.id === hotspot.targetSceneId,
    );
    if (!isPanoramaReady(destination)) {
      toast.error("This destination does not have a ready panorama.");
      return;
    }
    setPreviewArrival(
      hotspot.targetYaw != null && hotspot.targetPitch != null
        ? { yaw: hotspot.targetYaw, pitch: hotspot.targetPitch }
        : null,
    );
    setSceneQuery(destination.id);
  };

  const capturePanoramaPosition = (position: PanoramaPosition) => {
    if (placementMode === "MOVE") {
      setPositionOverride(position);
      setPlacementMode(null);
      setIsInspectorDirty(true);
      return;
    }
    if (placementMode === "INFORMATION" || placementMode === "NAVIGATION") {
      setNewHotspot({ type: placementMode, position });
      setPlacementMode(null);
      setIsInspectorDirty(true);
    }
  };

  const startPlacement = (type: VirtualTourHotspotType) => {
    requestEditorAction({ type: "place", placement: type });
  };

  const beginArrivalCapture = (hotspot: AdminVirtualTourHotspot) => {
    if (isInspectorDirty) {
      toast.error("Save the hotspot before setting its arrival view.");
      return;
    }
    const destination = tour?.scenes.find(
      (scene) => scene.id === hotspot.targetSceneId,
    );
    if (!isPanoramaReady(destination)) {
      toast.error("Upload the destination panorama first.");
      return;
    }
    setArrivalCapture({
      sourceSceneId: hotspot.sourceSceneId,
      hotspotId: hotspot.id,
      hotspotLabel: hotspot.label,
      hotspot,
    });
    clearInspector();
    setSceneQuery(destination.id);
  };

  const returnFromArrivalCapture = (capture = arrivalCapture) => {
    if (!capture) return;
    setArrivalCapture(null);
    setSceneQuery(capture.sourceSceneId);
    setSelectedHotspotId(capture.hotspotId);
  };

  const saveArrivalView = async (
    getViewerPosition: () => PanoramaPosition | null,
  ) => {
    if (!arrivalCapture) return;
    const position = getViewerPosition();
    if (!position) {
      toast.error("The panorama is not ready yet.");
      return;
    }
    try {
      await updateNavigationHotspot.mutateAsync({
        hotspotId: arrivalCapture.hotspotId,
        data: getNavigationHotspotUpdate(
          arrivalCapture.hotspot,
          position.yaw,
          position.pitch,
        ),
      });
      returnFromArrivalCapture(arrivalCapture);
      toast.success("Arrival view saved");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to save the arrival view.",
      );
    }
  };

  const finishHotspotSave = (hotspotId: string) => {
    setSelectedHotspotId(hotspotId);
    setNewHotspot(null);
    setPositionOverride(null);
    setIsInspectorDirty(false);
  };

  const finishConnectedSceneCreation = (scene: {
    id: string;
    name: string;
  }) => {
    clearInspector();
    setSceneQuery(scene.id);
    setPanoramaUploadTarget(scene);
  };

  const handleSceneDeleted = (deletedSceneId: string) => {
    const nextScene =
      tour?.scenes.find(
        (scene) =>
          scene.id !== deletedSceneId && scene.id === tour.startingSceneId,
      ) || tour?.scenes.find((scene) => scene.id !== deletedSceneId);
    clearInspector();
    if (nextScene) setSceneQuery(nextScene.id);
  };

  const discardPendingAction = () => {
    if (pendingAction) applyEditorAction(pendingAction);
    setPendingAction(null);
  };

  const clearPreviewArrival = useCallback(() => {
    setPreviewArrival(null);
  }, []);

  return {
    selectedHotspotId,
    selectedHotspot,
    newHotspot,
    positionOverride,
    placementMode,
    pendingAction,
    arrivalCapture,
    previewArrival,
    isSavingArrivalView: updateNavigationHotspot.isPending,
    setIsInspectorDirty,
    setPlacementMode,
    setPendingAction,
    clearInspector,
    requestEditorAction,
    selectHotspot,
    capturePanoramaPosition,
    startPlacement,
    beginArrivalCapture,
    returnFromArrivalCapture,
    saveArrivalView,
    finishHotspotSave,
    finishConnectedSceneCreation,
    handleSceneDeleted,
    discardPendingAction,
    clearPreviewArrival,
  };
};
