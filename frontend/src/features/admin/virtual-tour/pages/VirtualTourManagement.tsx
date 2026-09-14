import AdminPageHeader from "@/features/admin/layout/components/AdminPageHeader";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import {
  VirtualTourArrivalInspector,
  VirtualTourArrivalToolbar,
} from "@/features/admin/virtual-tour/components/VirtualTourArrivalView";
import VirtualTourHotspotInspector from "@/features/admin/virtual-tour/components/VirtualTourHotspotInspector";
import VirtualTourHotspotDeleteDialog from "@/features/admin/virtual-tour/components/VirtualTourHotspotDeleteDialog";
import VirtualTourLoadError from "@/features/admin/virtual-tour/components/VirtualTourLoadError";
import VirtualTourPanoramaCanvas from "@/features/admin/virtual-tour/components/VirtualTourPanoramaCanvas";
import VirtualTourPanoramaUploadDialog from "@/features/admin/virtual-tour/components/VirtualTourPanoramaUploadDialog";
import VirtualTourSceneInspector from "@/features/admin/virtual-tour/components/VirtualTourSceneInspector";
import VirtualTourSceneDeleteDialog from "@/features/admin/virtual-tour/components/VirtualTourSceneDeleteDialog";
import VirtualTourSceneRail from "@/features/admin/virtual-tour/components/VirtualTourSceneRail";
import VirtualTourStartingState from "@/features/admin/virtual-tour/components/VirtualTourStartingState";
import VirtualTourUnsavedChangesDialog from "@/features/admin/virtual-tour/components/VirtualTourUnsavedChangesDialog";
import { useVirtualTourEditor } from "@/features/admin/virtual-tour/hooks/useVirtualTourEditor";
import {
  useCreateStartingSceneMutation,
  useGetVirtualTourQuery,
} from "@/features/admin/virtual-tour/hooks/useVirtualTourAdmin";
import { useVirtualTourAdminStore } from "@/features/admin/virtual-tour/store/virtualTourAdmin.store";
import { isPanoramaReady } from "@/features/admin/virtual-tour/types/virtual-tour.type";
import type {
  CreateVirtualTourSceneDto,
  PanoramaPosition,
} from "@/features/admin/virtual-tour/types/virtual-tour.type";
import type { Viewer } from "@photo-sphere-viewer/core";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { toast } from "sonner";

const VirtualTourManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isPreview, setIsPreview] = useState(false);
  const viewerRef = useRef<Viewer | null>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const tourQuery = useGetVirtualTourQuery();
  const createStartingScene = useCreateStartingSceneMutation();
  const setPanoramaUploadTarget = useVirtualTourAdminStore(
    (state) => state.setPanoramaUploadTarget,
  );
  const tour = tourQuery.data;
  const requestedSceneId = searchParams.get("scene");
  const selectedScene =
    tour?.scenes.find((scene) => scene.id === requestedSceneId) ||
    tour?.scenes.find((scene) => scene.id === tour.startingSceneId) ||
    tour?.scenes[0] ||
    null;

  const setSceneQuery = useCallback(
    (sceneId: string) => {
      setSearchParams((current) => {
        const next = new URLSearchParams(current);
        next.set("scene", sceneId);
        return next;
      });
    },
    [setSearchParams],
  );

  const editor = useVirtualTourEditor({
    tour,
    selectedScene,
    setSceneQuery,
  });
  const clearPreviewArrival = editor.clearPreviewArrival;

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isEditorFullscreen =
        document.fullscreenElement === previewContainerRef.current;
      setIsPreview(isEditorFullscreen);
      if (!isEditorFullscreen) clearPreviewArrival();
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [clearPreviewArrival]);

  const getViewerPosition = (): PanoramaPosition | null => {
    const position = viewerRef.current?.getPosition();
    return position ? { yaw: position.yaw, pitch: position.pitch } : null;
  };

  const createFirstScene = async (data: CreateVirtualTourSceneDto) => {
    const scene = await createStartingScene.mutateAsync(data);
    setSceneQuery(scene.id);
    setPanoramaUploadTarget(scene);
    toast.success("Starting scene created");
  };

  const openPreview = async () => {
    if (!previewContainerRef.current) return;
    try {
      await previewContainerRef.current.requestFullscreen();
    } catch {
      toast.error("Fullscreen preview is not available in this browser.");
    }
  };

  const closePreview = async () => {
    if (document.fullscreenElement) await document.exitFullscreen();
  };

  if (tourQuery.isLoading) {
    return (
      <div className="flex min-h-96 items-center justify-center" role="status">
        <LoadingSpinner className="size-6 text-primary" />
        <span className="sr-only">Loading virtual tour editor</span>
      </div>
    );
  }

  if (tourQuery.isError || !tour) {
    return (
      <VirtualTourLoadError
        message={tourQuery.error?.message}
        onRetry={() => void tourQuery.refetch()}
      />
    );
  }

  if (!selectedScene) {
    return (
      <div className="flex min-h-0 flex-1 flex-col gap-5">
        <AdminPageHeader
          title="Virtual Tour"
          description="Build connected resort scenes and guide guests through each panorama."
        />
        <VirtualTourStartingState onCreate={createFirstScene} />
        <VirtualTourPanoramaUploadDialog />
      </div>
    );
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-5 xl:h-[calc(100vh-108px)] xl:flex-none xl:overflow-hidden">
      <AdminPageHeader
        className="shrink-0"
        title="Virtual Tour"
        description="Edit the same connected panorama experience guests will see."
      />

      <div className="grid min-h-0 min-w-0 w-full flex-1 gap-3 xl:grid-cols-[240px_minmax(0,1fr)_320px] xl:overflow-hidden">
        <VirtualTourSceneRail
          scenes={tour.scenes}
          selectedSceneId={selectedScene.id}
          startingSceneId={tour.startingSceneId}
          onSelect={(sceneId) =>
            editor.requestEditorAction({ type: "scene", sceneId })
          }
        />

        <div
          ref={previewContainerRef}
          className="admin-tour-preview relative flex min-h-120 min-w-0 flex-col bg-background fullscreen:bg-black"
        >
          {editor.arrivalCapture ? (
            <VirtualTourArrivalToolbar
              hotspotLabel={editor.arrivalCapture.hotspotLabel}
              isPending={editor.isSavingArrivalView}
              onCancel={editor.returnFromArrivalCapture}
              onSave={() => void editor.saveArrivalView(getViewerPosition)}
            />
          ) : null}

          <VirtualTourPanoramaCanvas
            key={`${selectedScene.id}:${isPreview ? "preview" : "editor"}`}
            scene={selectedScene}
            selectedHotspotId={editor.selectedHotspotId}
            placementMode={editor.placementMode}
            isPreview={isPreview}
            initialPosition={editor.previewArrival}
            onSelectHotspot={(hotspot) =>
              editor.selectHotspot(hotspot, isPreview)
            }
            onPosition={editor.capturePanoramaPosition}
            onViewerReady={(viewer) => {
              viewerRef.current = viewer;
            }}
            onOpenUpload={() =>
              setPanoramaUploadTarget({
                id: selectedScene.id,
                name: selectedScene.name,
              })
            }
            onOpenPreview={() => void openPreview()}
            onClosePreview={() => void closePreview()}
            onStartPlacement={editor.startPlacement}
            onCancelPlacement={() => editor.setPlacementMode(null)}
            placementDisabled={
              !isPanoramaReady(selectedScene) ||
              Boolean(editor.arrivalCapture) ||
              isPreview
            }
          />
        </div>

        {editor.arrivalCapture ? (
          <VirtualTourArrivalInspector />
        ) : editor.selectedHotspot || editor.newHotspot ? (
          <VirtualTourHotspotInspector
            key={
              editor.selectedHotspot
                ? `${editor.selectedHotspot.id}:${editor.selectedHotspot.updatedAt}`
                : `new:${editor.newHotspot?.type}:${editor.newHotspot?.position.yaw}`
            }
            sourceScene={selectedScene}
            scenes={tour.scenes}
            hotspot={editor.selectedHotspot}
            newHotspot={editor.newHotspot}
            positionOverride={editor.positionOverride}
            onDirtyChange={editor.setIsInspectorDirty}
            onCancel={() => editor.requestEditorAction({ type: "close" })}
            onSaved={editor.finishHotspotSave}
            onMove={() => editor.setPlacementMode("MOVE")}
            onConnectedSceneCreated={editor.finishConnectedSceneCreation}
            onBeginArrivalCapture={editor.beginArrivalCapture}
          />
        ) : (
          <VirtualTourSceneInspector
            key={`${selectedScene.id}:${selectedScene.updatedAt}`}
            scene={selectedScene}
            isStartingScene={selectedScene.id === tour.startingSceneId}
            getViewerPosition={getViewerPosition}
            onDirtyChange={editor.setIsInspectorDirty}
          />
        )}
      </div>

      <VirtualTourPanoramaUploadDialog />
      <VirtualTourHotspotDeleteDialog onDeleted={editor.clearInspector} />
      <VirtualTourSceneDeleteDialog onDeleted={editor.handleSceneDeleted} />

      <VirtualTourUnsavedChangesDialog
        open={Boolean(editor.pendingAction)}
        onKeepEditing={() => editor.setPendingAction(null)}
        onDiscard={editor.discardPendingAction}
      />
    </div>
  );
};

export default VirtualTourManagement;
