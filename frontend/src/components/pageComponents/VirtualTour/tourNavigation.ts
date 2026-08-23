import type {
    PublicVirtualTourResponse,
    SceneId,
    TourMarker,
    TourScene,
    VirtualTour,
} from "@/types/virtual-tour.type";

const mapHotspot = (
    hotspot: PublicVirtualTourResponse["scenes"][number]["hotspots"][number],
    sceneName: string,
): TourMarker | null => {
    const position = { yaw: hotspot.yaw, pitch: hotspot.pitch };

    if (hotspot.type === "NAVIGATION") {
        if (!hotspot.targetSceneId) return null;

        return {
            id: hotspot.id,
            kind: "navigation",
            label: hotspot.label,
            position,
            targetSceneId: hotspot.targetSceneId,
            targetPosition:
                hotspot.targetYaw != null && hotspot.targetPitch != null
                    ? { yaw: hotspot.targetYaw, pitch: hotspot.targetPitch }
                    : null,
        };
    }

    if (!hotspot.infoTitle || !hotspot.infoDescription) return null;

    return {
        id: hotspot.id,
        kind: "info",
        label: hotspot.label,
        position,
        detail: {
            eyebrow: "Resort information",
            title: hotspot.infoTitle,
            description: hotspot.infoDescription,
            imageUrl: hotspot.infoImageUrl,
            facts: [{ label: "Area", value: sceneName }],
        },
    };
};

export const createVirtualTour = (
    response: PublicVirtualTourResponse,
): VirtualTour | null => {
    if (!response.available || !response.startingSceneId) return null;

    const scenes = Object.fromEntries(
        response.scenes.map((scene) => [
            scene.id,
            {
                id: scene.id,
                name: scene.name,
                panorama: {
                    baseUrl: scene.panorama.previewUrl,
                    width: scene.panorama.width,
                    cols: scene.panorama.cols,
                    rows: scene.panorama.rows,
                    tileUrl: (column: number, row: number) =>
                        `${scene.panorama.tilesBaseUrl}/${row}_${column}.jpg`,
                },
                initialPosition: scene.initialPosition,
                markers: scene.hotspots
                    .map((hotspot) => mapHotspot(hotspot, scene.name))
                    .filter((marker): marker is TourMarker => marker !== null),
            } satisfies TourScene,
        ]),
    );

    return scenes[response.startingSceneId]
        ? { startingSceneId: response.startingSceneId, scenes }
        : null;
};

export const getConnectedSceneIds = (scene: TourScene): SceneId[] => {
    const connectedSceneIds = new Set<SceneId>();

    for (const marker of scene.markers) {
        if (marker.kind === "navigation") {
            connectedSceneIds.add(marker.targetSceneId);
        }
    }

    return [...connectedSceneIds];
};
