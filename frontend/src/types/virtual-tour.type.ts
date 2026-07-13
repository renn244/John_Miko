export type SceneId = "outside" | "bar-one" | "bar-two" | "dining-room";

export type TourPosition = {
    yaw: string;
    pitch: string;
};

export type MarkerDetail = {
    eyebrow: string;
    title: string;
    description: string;
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
    panorama: TiledPanorama;
    initialPosition: TourPosition;
    markers: TourMarker[];
};

export type InfoDisplayMode = "panel" | "quick";

export type SceneTransitionMode = "zoom-fade" | "fade";
