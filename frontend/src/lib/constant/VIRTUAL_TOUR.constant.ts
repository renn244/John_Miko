import { Compass, Info, MousePointer2 } from "lucide-react";

export const VIRTUAL_TOUR_CONFIG = {
    defaultZoomLevel: 50,
    forwardZoomLevel: 70,
    forwardZoomDuration: 400,
    resetZoomDuration: 300,
    rotationSpeed: 100,
    zoomControlStep: 10,
    zoomRange: { min: 0, max: 100, step: 1 },
    mobileMarkerMediaQuery: "(max-width: 640px)",
    viewerHeight: "80vh",
    fullscreenViewerHeight: "100vh",
    sceneTransition: {
        effect: "fade" as const,
        rotation: false,
        speed: 500,
    },
    markerSize: {
        compact: { width: 44, height: 44 },
        info: { width: 164, height: 44 },
        navigation: { width: 176, height: 44 },
    },
} as const;

export const VIRTUAL_TOUR_GUIDE_CARDS = [
    {
        title: "Look around freely",
        description: "Drag or swipe the panorama to explore each viewpoint at your own pace.",
        icon: MousePointer2,
    },
    {
        title: "Follow the guided path",
        description: "Use the blue arrow markers to move naturally from one area to the next.",
        icon: Compass,
    },
    {
        title: "Discover each space",
        description: "Select an information marker to see helpful details about the current area.",
        icon: Info,
    },
] as const;
