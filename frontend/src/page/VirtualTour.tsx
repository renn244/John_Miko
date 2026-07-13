import Footer from "@/components/common/Footer";
import NavBar from "@/components/common/NavBar";
import TourControls from "@/components/pageComponents/VirtualTour/TourControls";
import TourInfoPanel from "@/components/pageComponents/VirtualTour/TourInfoPanel";
import { getVirtualTourMarkerConfigs } from "@/components/pageComponents/VirtualTour/tourMarkers";
import { GuestCard, GuestContainer, GuestPageShell, GuestSection } from "@/components/guest";
import { Button } from "@/components/ui/button";
import {
    getVirtualTourMarker,
    VIRTUAL_TOUR_CONFIG,
    VIRTUAL_TOUR_GUIDE_CARDS,
    VIRTUAL_TOUR_SCENES,
} from "@/lib/constant/VIRTUAL_TOUR.constant";
import type { Viewer } from "@photo-sphere-viewer/core";
import "@photo-sphere-viewer/core/index.css";
import { EquirectangularTilesAdapter } from "@photo-sphere-viewer/equirectangular-tiles-adapter";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import "@photo-sphere-viewer/markers-plugin/index.css";
import { CalendarDays, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ReactPhotoSphereViewer, type PluginConfig } from "react-photo-sphere-viewer";
import { Link } from "react-router";

import type {
    InfoDisplayMode,
    MarkerDetail,
    SceneId,
    SceneTransitionMode,
    TourPosition,
} from "@/types/virtual-tour.type";

import "./VirtualTour.css";

const plugins: PluginConfig[] = [
    [MarkersPlugin, { markers: getVirtualTourMarkerConfigs(VIRTUAL_TOUR_SCENES.outside, "panel") }],
];

const VirtualTour = () => {
    const viewerRef = useRef<Viewer | null>(null);
    const tourFrameRef = useRef<HTMLDivElement | null>(null);
    const [currentSceneId, setCurrentSceneId] = useState<SceneId>("outside");
    const [isViewerReady, setIsViewerReady] = useState(false);
    const [isCompactMarkers, setIsCompactMarkers] = useState(() =>
        window.matchMedia(VIRTUAL_TOUR_CONFIG.mobileMarkerMediaQuery).matches,
    );
    const [selectedMarker, setSelectedMarker] = useState<MarkerDetail | null>(null);
    const [infoDisplayMode, setInfoDisplayMode] = useState<InfoDisplayMode>("panel");
    const [sceneTransitionMode, setSceneTransitionMode] = useState<SceneTransitionMode>("zoom-fade");
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [zoomLevel, setZoomLevel] = useState<number>(VIRTUAL_TOUR_CONFIG.defaultZoomLevel);

    useEffect(() => {
        const handleFullscreenChange = () => {
            const frameIsFullscreen = document.fullscreenElement === tourFrameRef.current;

            setIsFullscreen(frameIsFullscreen);
            requestAnimationFrame(() =>
                viewerRef.current?.resize({
                    width: "100%",
                    height: frameIsFullscreen
                        ? VIRTUAL_TOUR_CONFIG.fullscreenViewerHeight
                        : VIRTUAL_TOUR_CONFIG.viewerHeight,
                }),
            );
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);

        return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
    }, []);

    useEffect(() => {
        const mediaQuery = window.matchMedia(VIRTUAL_TOUR_CONFIG.mobileMarkerMediaQuery);
        const handleMarkerSizeChange = () => setIsCompactMarkers(mediaQuery.matches);

        mediaQuery.addEventListener("change", handleMarkerSizeChange);

        return () => mediaQuery.removeEventListener("change", handleMarkerSizeChange);
    }, []);

    useEffect(() => {
        if (!isViewerReady) {
            return;
        }

        viewerRef.current
            ?.getPlugin<MarkersPlugin>(MarkersPlugin)
            ?.setMarkers(
                getVirtualTourMarkerConfigs(
                    VIRTUAL_TOUR_SCENES[currentSceneId],
                    infoDisplayMode,
                    isCompactMarkers,
                ),
            );
    }, [currentSceneId, infoDisplayMode, isCompactMarkers, isViewerReady]);

    const handleZoomIn = useCallback(
        () => viewerRef.current?.zoomIn(VIRTUAL_TOUR_CONFIG.zoomControlStep),
        [],
    );

    const handleZoomOut = useCallback(
        () => viewerRef.current?.zoomOut(VIRTUAL_TOUR_CONFIG.zoomControlStep),
        [],
    );

    const handleZoomLevelChange = useCallback((nextZoomLevel: number) => {
        setZoomLevel(nextZoomLevel);
        viewerRef.current?.zoom(nextZoomLevel);
    }, []);

    const handleViewerZoomChange = useCallback((event: { zoomLevel: number }) => {
        setZoomLevel(Math.round(event.zoomLevel));
    }, []);

    const handleInfoDisplayModeChange = useCallback((nextInfoDisplayMode: InfoDisplayMode) => {
        setInfoDisplayMode(nextInfoDisplayMode);
        setSelectedMarker(null);
    }, []);

    const handleFullscreenToggle = useCallback(async () => {
        const frame = tourFrameRef.current;

        if (!frame) {
            return;
        }

        try {
            if (document.fullscreenElement === frame) {
                await document.exitFullscreen();
            } else {
                await frame.requestFullscreen();
            }
        } catch {
            // Fullscreen can be denied by the browser or embedded contexts.
        }
    }, []);

    const loadScene = useCallback(async (
        sceneId: SceneId,
        markerPosition: TourPosition,
        transitionMode: SceneTransitionMode,
    ) => {
        const viewer = viewerRef.current;
        const scene = VIRTUAL_TOUR_SCENES[sceneId];
        const markersPlugin = viewer?.getPlugin<MarkersPlugin>(MarkersPlugin);

        if (!viewer || !markersPlugin) {
            return;
        }

        const initialZoom = viewer.getZoomLevel();
        const tooZoomedIn =
            transitionMode === "zoom-fade" && initialZoom > VIRTUAL_TOUR_CONFIG.forwardZoomLevel;
        const targetZoom = tooZoomedIn ? VIRTUAL_TOUR_CONFIG.defaultZoomLevel : initialZoom;

        setSelectedMarker(null);
        markersPlugin.setMarkers(null);

        if (tooZoomedIn) {
            await viewer.animate({
                zoom: VIRTUAL_TOUR_CONFIG.defaultZoomLevel,
                speed: VIRTUAL_TOUR_CONFIG.resetZoomSpeed,
            });
        }

        await viewer.animate({
            yaw: markerPosition.yaw,
            pitch: markerPosition.pitch,
            speed: VIRTUAL_TOUR_CONFIG.rotationSpeed,
            easing: "inOutSine",
        });

        const didLoad = transitionMode === "zoom-fade"
            ? (await Promise.all([
                viewer.animate({
                    zoom: VIRTUAL_TOUR_CONFIG.forwardZoomLevel,
                    speed: VIRTUAL_TOUR_CONFIG.forwardZoomSpeed,
                }),
                viewer.setPanorama(scene.panorama, {
                    transition: VIRTUAL_TOUR_CONFIG.sceneTransition,
                    showLoader: false,
                }),
            ]))[1]
            : await viewer.setPanorama(scene.panorama, {
                transition: VIRTUAL_TOUR_CONFIG.sceneTransition,
                showLoader: false,
            });

        if (transitionMode === "zoom-fade") {
            await viewer.animate({ zoom: targetZoom, speed: VIRTUAL_TOUR_CONFIG.resetZoomSpeed });
        }

        if (didLoad) {
            setCurrentSceneId(sceneId);
        }
    }, []);

    useEffect(() => {
        if (!isViewerReady) {
            return;
        }

        const markersPlugin = viewerRef.current?.getPlugin<MarkersPlugin>(MarkersPlugin);

        if (!markersPlugin) {
            return;
        }

        const handleMarkerSelect = (event: { type: string; marker?: { id: string } }) => {
            if (event.type !== "select-marker" || !event.marker) {
                return;
            }

            const marker = getVirtualTourMarker(event.marker.id);

            if (marker?.kind === "info" && infoDisplayMode === "panel") {
                setSelectedMarker(marker.detail);
            }

            if (marker?.kind === "navigation") {
                void loadScene(marker.targetSceneId, marker.position, sceneTransitionMode);
            }
        };

        markersPlugin.addEventListener("select-marker", handleMarkerSelect);

        return () => markersPlugin.removeEventListener("select-marker", handleMarkerSelect);
    }, [infoDisplayMode, isViewerReady, loadScene, sceneTransitionMode]);

    const handleReady = useCallback((instance: Viewer) => {
        viewerRef.current = instance;
        setZoomLevel(Math.round(instance.getZoomLevel()));
        setIsViewerReady(true);
    }, []);

    return (
        <GuestPageShell className="bg-background">
            <NavBar />

            <GuestContainer className="py-5 md:py-6">
                <div className="mx-auto max-w-6xl">
                    <div ref={tourFrameRef} className="virtual-tour-frame relative overflow-hidden rounded-xl border bg-card shadow-sm">
                        <ReactPhotoSphereViewer
                            adapter={EquirectangularTilesAdapter.withConfig({ baseBlur: false })}
                            containerClass="virtual-tour-viewer"
                            defaultYaw={VIRTUAL_TOUR_SCENES.outside.initialPosition.yaw}
                            defaultPitch={VIRTUAL_TOUR_SCENES.outside.initialPosition.pitch}
                            src={VIRTUAL_TOUR_SCENES.outside.panorama}
                            plugins={plugins}
                            navbar={false}
                            width="100%"
                            height={VIRTUAL_TOUR_CONFIG.viewerHeight}
                            onReady={handleReady}
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

                    <GuestSection
                        compact
                        eyebrow="John Miko's Portal"
                        title="Explore the resort before you arrive"
                        description="Take the guided 360 degree route, discover each area, and get a feel for the resort before planning your stay."
                        actions={
                            <Button asChild size="sm">
                                <Link to="/accommodation">
                                    Browse accommodations
                                    <ChevronRight className="size-4" />
                                </Link>
                            </Button>
                        }
                    >
                        <div className="grid gap-4 md:grid-cols-3">
                            {VIRTUAL_TOUR_GUIDE_CARDS.map(({ title, description, icon: Icon }) => (
                                <GuestCard key={title} className="p-4">
                                    <div className="inline-flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <Icon className="size-4" />
                                    </div>
                                    <h3 className="mt-3 text-sm font-semibold text-foreground">{title}</h3>
                                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
                                </GuestCard>
                            ))}
                        </div>
                        <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                            <CalendarDays className="size-3.5 text-primary" />
                            This is a sample guided route. Resort-specific scenes and details will be added with the final photography.
                        </p>
                    </GuestSection>
                </div>
            </GuestContainer>

            <Footer />
        </GuestPageShell>
    );
};

export default VirtualTour;
