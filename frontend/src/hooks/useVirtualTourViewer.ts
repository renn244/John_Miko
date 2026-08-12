import { getVirtualTourMarkerConfigs } from "@/components/pageComponents/VirtualTour/tourMarkers";
import { getConnectedSceneIds } from "@/components/pageComponents/VirtualTour/tourNavigation";
import {
    getVirtualTourMarker,
    VIRTUAL_TOUR_CONFIG,
    VIRTUAL_TOUR_SCENES,
} from "@/lib/constant/VIRTUAL_TOUR.constant";
import type { Viewer } from "@photo-sphere-viewer/core";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import { useCallback, useEffect, useRef, useState } from "react";

import type {
    InfoDisplayMode,
    MarkerDetail,
    SceneId,
    SceneTransitionMode,
    TourPosition,
} from "@/types/virtual-tour.type";

export const useVirtualTourViewer = () => {
    const viewerRef = useRef<Viewer | null>(null);
    const tourFrameRef = useRef<HTMLDivElement | null>(null);
    const preloadedSceneIdsRef = useRef(new Set<SceneId>());
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

    useEffect(() => {
        if (!isViewerReady) {
            return;
        }

        let isCancelled = false;
        const preloadConnectedScenePreviews = () => {
            if (isCancelled || !viewerRef.current) {
                return;
            }

            for (const sceneId of getConnectedSceneIds(VIRTUAL_TOUR_SCENES[currentSceneId])) {
                if (preloadedSceneIdsRef.current.has(sceneId)) {
                    continue;
                }

                preloadedSceneIdsRef.current.add(sceneId);
                void viewerRef.current.textureLoader
                    .preloadPanorama(VIRTUAL_TOUR_SCENES[sceneId].panorama)
                    .catch(() => {
                        // Preview preloading is optional; normal scene loading remains available.
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
    }, [currentSceneId, isViewerReady]);

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

    const handleViewerReady = useCallback((instance: Viewer) => {
        viewerRef.current = instance;
        setZoomLevel(Math.round(instance.getZoomLevel()));
        setIsViewerReady(true);
    }, []);

    return {
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
