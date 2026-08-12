import { VIRTUAL_TOUR_CONFIG, VIRTUAL_TOUR_SCENES } from "@/lib/constant/VIRTUAL_TOUR.constant";
import { useVirtualTourViewer } from "@/hooks/useVirtualTourViewer";
import type { PluginConfig } from "react-photo-sphere-viewer";
import { ReactPhotoSphereViewer } from "react-photo-sphere-viewer";
import { EquirectangularTilesAdapter } from "@photo-sphere-viewer/equirectangular-tiles-adapter";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";

import TourControls from "./TourControls";
import TourInfoPanel from "./TourInfoPanel";
import { getVirtualTourMarkerConfigs } from "./tourMarkers";

import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";
import "@/page/VirtualTour.css";

const tiledPanoramaAdapter = EquirectangularTilesAdapter.withConfig({ baseBlur: false });
const plugins: PluginConfig[] = [
    [MarkersPlugin, { markers: getVirtualTourMarkerConfigs(VIRTUAL_TOUR_SCENES.outside, "panel") }],
];

const VirtualTourViewer = () => {
    const {
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
    } = useVirtualTourViewer();

    return (
        <div ref={tourFrameRef} className="virtual-tour-frame relative overflow-hidden rounded-xl border bg-card shadow-sm">
            <ReactPhotoSphereViewer
                adapter={tiledPanoramaAdapter}
                containerClass="virtual-tour-viewer"
                defaultYaw={VIRTUAL_TOUR_SCENES.outside.initialPosition.yaw}
                defaultPitch={VIRTUAL_TOUR_SCENES.outside.initialPosition.pitch}
                src={VIRTUAL_TOUR_SCENES.outside.panorama}
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

export default VirtualTourViewer;
