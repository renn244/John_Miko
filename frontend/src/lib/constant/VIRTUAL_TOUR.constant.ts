import { Compass, Info, MousePointer2 } from "lucide-react";

import type { SceneId, TiledPanorama, TourMarker, TourScene } from "@/types/virtual-tour.type";

const createTiledPanorama = (sceneId: SceneId): TiledPanorama => ({
    baseUrl: `/virtual-tour/scenes/${sceneId}/preview.jpg`,
    width: 8192,
    cols: 8,
    rows: 4,
    tileUrl: (col, row) => `/virtual-tour/scenes/${sceneId}/tiles/${col}_${row}.jpg`,
});

export const VIRTUAL_TOUR_CONFIG = {
    defaultZoomLevel: 50,
    forwardZoomLevel: 70,
    forwardZoomSpeed: 50,
    resetZoomSpeed: 0.1,
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

export const VIRTUAL_TOUR_SCENES: Record<SceneId, TourScene> = {
    outside: {
        panorama: createTiledPanorama("outside"),
        initialPosition: { yaw: "-140deg", pitch: "-4deg" },
        markers: [
            {
                id: "outside-overview",
                kind: "info",
                label: "Inn overview",
                position: { yaw: "-102deg", pitch: "-2deg" },
                detail: {
                    eyebrow: "Sample Tour",
                    title: "The Olde Bryan Inn",
                    description:
                        "This exterior begins the sample journey. The next marker enters the bar area shown in the interior panoramas.",
                    facts: [
                        { label: "Scene", value: "Exterior" },
                        { label: "Tour type", value: "Guided path" },
                        { label: "Next area", value: "Entrance bar" },
                    ],
                },
            },
            {
                id: "outside-to-bar-one",
                kind: "navigation",
                label: "Enter the bar",
                position: { yaw: "-140deg", pitch: "-4deg" },
                targetSceneId: "bar-one",
            },
        ],
    },
    "bar-one": {
        panorama: createTiledPanorama("bar-one"),
        initialPosition: { yaw: "94deg", pitch: "-2deg" },
        markers: [
            {
                id: "bar-one-overview",
                kind: "info",
                label: "Entrance bar",
                position: { yaw: "-45deg", pitch: "-4deg" },
                detail: {
                    eyebrow: "Sample Tour",
                    title: "Entrance bar",
                    description:
                        "The first interior viewpoint faces the bar counter and entrance corridor. Continue to see the main bar from the opposite side.",
                    facts: [
                        { label: "Scene", value: "Bar interior" },
                        { label: "Viewpoint", value: "Entrance side" },
                        { label: "Next area", value: "Main bar" },
                    ],
                },
            },
            {
                id: "bar-one-to-outside",
                kind: "navigation",
                label: "Return outside",
                position: { yaw: "94deg", pitch: "-2deg" },
                targetSceneId: "outside",
            },
            {
                id: "bar-one-to-bar-two",
                kind: "navigation",
                label: "Explore the main bar",
                position: { yaw: "-40deg", pitch: "-3deg" },
                targetSceneId: "bar-two",
            },
        ],
    },
    "bar-two": {
        panorama: createTiledPanorama("bar-two"),
        initialPosition: { yaw: "86deg", pitch: "-3deg" },
        markers: [
            {
                id: "bar-two-overview",
                kind: "info",
                label: "Main bar",
                position: { yaw: "-25deg", pitch: "-4deg" },
                detail: {
                    eyebrow: "Sample Tour",
                    title: "Main bar",
                    description:
                        "This viewpoint looks across the main bar and its dining tables. Continue toward the separate dining room.",
                    facts: [
                        { label: "Scene", value: "Main bar" },
                        { label: "Viewpoint", value: "Counter side" },
                        { label: "Next area", value: "Dining room" },
                    ],
                },
            },
            {
                id: "bar-two-to-bar-one",
                kind: "navigation",
                label: "Return to entrance bar",
                position: { yaw: "-150deg", pitch: "-3deg" },
                targetSceneId: "bar-one",
            },
            {
                id: "bar-two-to-dining-room",
                kind: "navigation",
                label: "Continue to dining room",
                position: { yaw: "86deg", pitch: "-3deg" },
                targetSceneId: "dining-room",
            },
        ],
    },
    "dining-room": {
        panorama: createTiledPanorama("dining-room"),
        initialPosition: { yaw: "0deg", pitch: "-3deg" },
        markers: [
            {
                id: "dining-room-overview",
                kind: "info",
                label: "Dining room",
                position: { yaw: "0deg", pitch: "-3deg" },
                detail: {
                    eyebrow: "Sample Tour",
                    title: "Dining room",
                    description:
                        "The guided sample ends in the dining room. Use the return marker to move back through the bar route.",
                    facts: [
                        { label: "Scene", value: "Dining room" },
                        { label: "Viewpoint", value: "Table seating" },
                        { label: "Return area", value: "Main bar" },
                    ],
                },
            },
            {
                id: "dining-room-to-bar-two",
                kind: "navigation",
                label: "Return to main bar",
                position: { yaw: "-74deg", pitch: "-3deg" },
                targetSceneId: "bar-two",
            },
        ],
    },
};

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

export const getVirtualTourMarker = (markerId: string): TourMarker | undefined =>
    Object.values(VIRTUAL_TOUR_SCENES)
        .flatMap((scene) => scene.markers)
        .find((marker) => marker.id === markerId);
