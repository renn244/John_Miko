import type { SceneId, TourScene } from "@/types/virtual-tour.type";

export const getConnectedSceneIds = (scene: TourScene): SceneId[] => {
    const connectedSceneIds = new Set<SceneId>();

    for (const marker of scene.markers) {
        if (marker.kind === "navigation") {
            connectedSceneIds.add(marker.targetSceneId);
        }
    }

    return [...connectedSceneIds];
};
