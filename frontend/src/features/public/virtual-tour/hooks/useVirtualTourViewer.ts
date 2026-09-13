import { getVirtualTourMarkerConfigs } from "@/features/public/virtual-tour/components/tourMarkers";
import { getConnectedSceneIds } from "@/features/public/virtual-tour/components/tourNavigation";
import { VIRTUAL_TOUR_CONFIG } from "@/lib/constant/VIRTUAL_TOUR.constant";
import type { Viewer } from "@photo-sphere-viewer/core";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import { useCallback, useEffect, useRef, useState } from "react";

import type {
    InfoDisplayMode,
    MarkerDetail,
    SceneId,
    SceneTransitionMode,
    TourPosition,
    VirtualTour,
} from "@/features/public/virtual-tour/types/virtual-tour.type";

export const useVirtualTourViewer = (tour: VirtualTour) => {
    const viewerRef = useRef<Viewer | null>(null);
    const tourFrameRef = useRef<HTMLDivElement | null>(null);
    const preloadedSceneIdsRef = useRef(new Set<SceneId>());
    const [currentSceneId, setCurrentSceneId] = useState<SceneId>(tour.startingSceneId);
    const [isViewerReady, setIsViewerReady] = useState(false);
    const [isCompactMarkers, setIsCompactMarkers] = useState(() =>
        window.matchMedia(VIRTUAL_TOUR_CONFIG.mobileMarkerMediaQuery).matches,
    );
    const [selectedMarker, setSelectedMarker] = useState<MarkerDetail | null>(null);
    const [infoDisplayMode, setInfoDisplayMode] = useState<InfoDisplayMode>("panel");
    const [sceneTransitionMode, setSceneTransitionMode] = useState<SceneTransitionMode>("zoom-fade");
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [zoomLevel, setZoomLevel] = useState<number>(VIRTUAL_TOUR_CONFIG.defaultZoomLevel);

    const currentScene = tour.scenes[currentSceneId] || tour.scenes[tour.startingSceneId];

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
        if (!isViewerReady || !currentScene) return;

        viewerRef.current
            ?.getPlugin<MarkersPlugin>(MarkersPlugin)
            ?.setMarkers(
                getVirtualTourMarkerConfigs(
                    currentScene,
                    infoDisplayMode,
                    isCompactMarkers,
                ),
            );
    }, [currentScene, infoDisplayMode, isCompactMarkers, isViewerReady]);

    useEffect(() => {
        if (!isViewerReady || !currentScene) return;

        let isCancelled = false;
        const preloadConnectedScenePreviews = () => {
            if (isCancelled || !viewerRef.current) return;

            for (const sceneId of getConnectedSceneIds(currentScene)) {
                const connectedScene = tour.scenes[sceneId];
                if (!connectedScene || preloadedSceneIdsRef.current.has(sceneId)) continue;

                preloadedSceneIdsRef.current.add(sceneId);
                void viewerRef.current.textureLoader
                    .preloadPanorama(connectedScene.panorama)
                    .catch(() => {
                        // Preloading is optional; normal scene loading remains available.
                    });
            }
        };

        if ("requestIdleCallback" in window) {
            const idleCallbackId = window.requestIdleCallback(preloadConnectedScenePreviews);

            return () => {
                isCancelled = true;
                window.cancelIdleCallback(idleCallbackId);
            };
        }

        const timeoutId = setTimeout(preloadConnectedScenePreviews, 200);

        return () => {
            isCancelled = true;
            clearTimeout(timeoutId);
        };
    }, [currentScene, isViewerReady, tour.scenes]);

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

        if (!frame) return;

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
        targetPosition: TourPosition | null,
        transitionMode: SceneTransitionMode,
    ) => {
        const viewer = viewerRef.current;
        const scene = tour.scenes[sceneId];
        const markersPlugin = viewer?.getPlugin<MarkersPlugin>(MarkersPlugin);

        if (!viewer || !markersPlugin || !scene) return;

        const initialZoom = viewer.getZoomLevel();
        const tooZoomedIn =
            transitionMode === "zoom-fade" && initialZoom > VIRTUAL_TOUR_CONFIG.forwardZoomLevel;
        const targetZoom = tooZoomedIn ? VIRTUAL_TOUR_CONFIG.defaultZoomLevel : initialZoom;

        setSelectedMarker(null);
        markersPlugin.setMarkers(null);

        if (tooZoomedIn) {
            await viewer.animate({
                zoom: VIRTUAL_TOUR_CONFIG.defaultZoomLevel,
                speed: VIRTUAL_TOUR_CONFIG.resetZoomDuration,
            });
        }

        await viewer.animate({
            yaw: markerPosition.yaw,
            pitch: markerPosition.pitch,
            speed: VIRTUAL_TOUR_CONFIG.rotationSpeed,
            easing: "inOutSine",
        });

        if (transitionMode === "zoom-fade") {
            await viewer.animate({
                zoom: VIRTUAL_TOUR_CONFIG.forwardZoomLevel,
                speed: VIRTUAL_TOUR_CONFIG.forwardZoomDuration,
            });
        }

        const didLoad = await viewer.setPanorama(scene.panorama, {
            transition: VIRTUAL_TOUR_CONFIG.sceneTransition,
            showLoader: false,
            position: targetPosition || scene.initialPosition,
        });

        if (didLoad && transitionMode === "zoom-fade") {
            await viewer.animate({
                zoom: targetZoom,
                speed: VIRTUAL_TOUR_CONFIG.resetZoomDuration,
            });
        }

        if (didLoad) setCurrentSceneId(sceneId);
    }, [tour.scenes]);

    useEffect(() => {
        if (!isViewerReady || !currentScene) return;

        const markersPlugin = viewerRef.current?.getPlugin<MarkersPlugin>(MarkersPlugin);
        if (!markersPlugin) return;

        const handleMarkerSelect = (event: { type: string; marker?: { id: string } }) => {
            if (event.type !== "select-marker" || !event.marker) return;

            const marker = currentScene.markers.find((item) => item.id === event.marker?.id);

            if (marker?.kind === "info" && infoDisplayMode === "panel") {
                setSelectedMarker(marker.detail);
            }

            if (marker?.kind === "navigation") {
                void loadScene(
                    marker.targetSceneId,
                    marker.position,
                    marker.targetPosition,
                    sceneTransitionMode,
                );
            }
        };

        markersPlugin.addEventListener("select-marker", handleMarkerSelect);

        return () => markersPlugin.removeEventListener("select-marker", handleMarkerSelect);
    }, [currentScene, infoDisplayMode, isViewerReady, loadScene, sceneTransitionMode]);

    const handleViewerReady = useCallback((instance: Viewer) => {
        viewerRef.current = instance;
        setZoomLevel(Math.round(instance.getZoomLevel()));
        setIsViewerReady(true);
    }, []);

    return {
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
    };
};
