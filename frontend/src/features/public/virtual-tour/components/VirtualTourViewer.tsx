import { createVirtualTour } from "@/features/public/virtual-tour/components/tourNavigation";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useGetPublicVirtualTourQuery } from "@/features/public/virtual-tour/hooks/usePublicVirtualTour";
import { useVirtualTourViewer } from "@/features/public/virtual-tour/hooks/useVirtualTourViewer";
import { VIRTUAL_TOUR_CONFIG } from "@/lib/constant/VIRTUAL_TOUR.constant";
import type { VirtualTour } from "@/features/public/virtual-tour/types/virtual-tour.type";
import { EquirectangularTilesAdapter } from "@photo-sphere-viewer/equirectangular-tiles-adapter";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import { MapPinned, RotateCcw } from "lucide-react";
import { useMemo } from "react";
import type { PluginConfig } from "react-photo-sphere-viewer";
import { ReactPhotoSphereViewer } from "react-photo-sphere-viewer";

import TourControls from "./TourControls";
import TourInfoPanel from "./TourInfoPanel";
import { getVirtualTourMarkerConfigs } from "./tourMarkers";

import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";
import "@/page/VirtualTour.css";

const tiledPanoramaAdapter = EquirectangularTilesAdapter.withConfig({ baseBlur: false });

type ViewerStateProps = {
    message: string;
    title: string;
    loading?: boolean;
    onRetry?: () => void;
};

const ViewerState = ({ message, title, loading = false, onRetry }: ViewerStateProps) => (
    <div className="virtual-tour-frame flex h-[80vh] min-h-120 flex-col items-center justify-center rounded-xl border bg-card p-6 text-center shadow-sm">
        <span className="flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {loading ? <LoadingSpinner className="size-6" /> : <MapPinned className="size-6" />}
        </span>
        <h2 className="mt-4 text-xl font-semibold text-foreground">{title}</h2>
        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">{message}</p>
        {onRetry ? (
            <Button className="mt-5" variant="outline" onClick={onRetry}>
                <RotateCcw className="size-4" /> Try again
            </Button>
        ) : null}
    </div>
);

const ReadyVirtualTourViewer = ({ tour }: { tour: VirtualTour }) => {
    const startingScene = tour.scenes[tour.startingSceneId];
    const plugins = useMemo<PluginConfig[]>(
        () => [[MarkersPlugin, { markers: getVirtualTourMarkerConfigs(startingScene, "panel") }]],
        [startingScene],
    );
    const {
        currentScene,
        handleFullscreenToggle,
        handleInfoDisplayModeChange,
        handleViewerReady,
        handleViewerZoomChange,
        handleZoomIn,
        handleZoomLevelChange,
        handleZoomOut,
        infoDisplayMode,
        isFullscreen,
        sceneTransitionMode,
        selectedMarker,
        setSceneTransitionMode,
        setSelectedMarker,
        tourFrameRef,
        zoomLevel,
    } = useVirtualTourViewer(tour);

    return (
        <div
            ref={tourFrameRef}
            aria-label={`${currentScene.name} virtual tour`}
            className="virtual-tour-frame relative overflow-hidden rounded-xl border bg-card shadow-sm"
        >
            <ReactPhotoSphereViewer
                adapter={tiledPanoramaAdapter}
                containerClass="virtual-tour-viewer"
                defaultYaw={startingScene.initialPosition.yaw}
                defaultPitch={startingScene.initialPosition.pitch}
                src={startingScene.panorama}
                plugins={plugins}
                navbar={false}
                width="100%"
                height={VIRTUAL_TOUR_CONFIG.viewerHeight}
                onReady={handleViewerReady}
                onZoomChange={handleViewerZoomChange}
            />
            <TourControls
                infoDisplayMode={infoDisplayMode}
                isFullscreen={isFullscreen}
                onFullscreenToggle={handleFullscreenToggle}
                onInfoDisplayModeChange={handleInfoDisplayModeChange}
                onSceneTransitionModeChange={setSceneTransitionMode}
                onZoomIn={handleZoomIn}
                onZoomLevelChange={handleZoomLevelChange}
                onZoomOut={handleZoomOut}
                sceneTransitionMode={sceneTransitionMode}
                zoomLevel={zoomLevel}
            />
            {selectedMarker ? (
                <TourInfoPanel marker={selectedMarker} onClose={() => setSelectedMarker(null)} />
            ) : null}
        </div>
    );
};

const VirtualTourViewer = () => {
    const tourQuery = useGetPublicVirtualTourQuery();
    const tour = useMemo(
        () => (tourQuery.data ? createVirtualTour(tourQuery.data) : null),
        [tourQuery.data],
    );

    if (tourQuery.isLoading) {
        return (
            <ViewerState
                loading
                title="Preparing the virtual tour"
                message="Loading the resort’s published panoramas and guest information."
            />
        );
    }

    if (tourQuery.isError) {
        return (
            <ViewerState
                title="Unable to load the virtual tour"
                message={tourQuery.error.message}
                onRetry={() => tourQuery.refetch()}
            />
        );
    }

    if (!tour) {
        return (
            <ViewerState
                title="Virtual tour coming soon"
                message="The resort does not currently have a published virtual tour. Please check back later."
            />
        );
    }

    return <ReadyVirtualTourViewer tour={tour} />;
};

export default VirtualTourViewer;
