export type SceneId = string;

export type TourPosition = {
    yaw: number;
    pitch: number;
};

export type MarkerDetail = {
    eyebrow: string;
    title: string;
    description: string;
    imageUrl: string | null;
    facts: Array<{
        label: string;
        value: string;
    }>;
};

export type InfoTourMarker = {
    id: string;
    kind: "info";
    label: string;
    position: TourPosition;
    detail: MarkerDetail;
};

export type NavigationTourMarker = {
    id: string;
    kind: "navigation";
    label: string;
    position: TourPosition;
    targetSceneId: SceneId;
    targetPosition: TourPosition | null;
};

export type TourMarker = InfoTourMarker | NavigationTourMarker;

export type TiledPanorama = {
    baseUrl: string;
    width: number;
    cols: number;
    rows: number;
    tileUrl: (col: number, row: number) => string;
};

export type TourScene = {
    id: SceneId;
    name: string;
    panorama: TiledPanorama;
    initialPosition: TourPosition;
    markers: TourMarker[];
};

export type VirtualTour = {
    startingSceneId: SceneId;
    scenes: Record<SceneId, TourScene>;
};

export type PublicVirtualTourHotspot = {
    id: string;
    type: "INFORMATION" | "NAVIGATION";
    label: string;
    yaw: number;
    pitch: number;
    targetSceneId: string | null;
    targetYaw: number | null;
    targetPitch: number | null;
    infoTitle: string | null;
    infoDescription: string | null;
    infoImageUrl: string | null;
};

export type PublicVirtualTourScene = {
    id: string;
    name: string;
    slug: string;
    panorama: {
        originalUrl: string;
        previewUrl: string;
        tilesBaseUrl: string;
        width: number;
        cols: number;
        rows: number;
    };
    initialPosition: TourPosition;
    hotspots: PublicVirtualTourHotspot[];
};

export type PublicVirtualTourResponse = {
    available: boolean;
    startingSceneId: string | null;
    scenes: PublicVirtualTourScene[];
};

export type InfoDisplayMode = "panel" | "quick";

export type SceneTransitionMode = "zoom-fade" | "fade";
