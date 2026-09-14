import type {
  AdminVirtualTourHotspot,
  AdminVirtualTourScene,
} from "@/features/admin/virtual-tour/types/virtual-tour.type";
import { create } from "zustand";

type PanoramaUploadTarget = Pick<AdminVirtualTourScene, "id" | "name">;
type DeleteSceneTarget = Pick<AdminVirtualTourScene, "id" | "name">;
type DeleteHotspotTarget = Pick<AdminVirtualTourHotspot, "id" | "label">;

type VirtualTourAdminStore = {
  selectedHotspotId: string | null;
  setSelectedHotspotId: (id: string | null) => void;
  panoramaUploadTarget: PanoramaUploadTarget | null;
  setPanoramaUploadTarget: (target: PanoramaUploadTarget | null) => void;
  deleteSceneTarget: DeleteSceneTarget | null;
  setDeleteSceneTarget: (target: DeleteSceneTarget | null) => void;
  deleteHotspotTarget: DeleteHotspotTarget | null;
  setDeleteHotspotTarget: (target: DeleteHotspotTarget | null) => void;
};

export const useVirtualTourAdminStore = create<VirtualTourAdminStore>(
  (set) => ({
    selectedHotspotId: null,
    setSelectedHotspotId: (selectedHotspotId) => set({ selectedHotspotId }),
    panoramaUploadTarget: null,
    setPanoramaUploadTarget: (panoramaUploadTarget) =>
      set({ panoramaUploadTarget }),
    deleteSceneTarget: null,
    setDeleteSceneTarget: (deleteSceneTarget) => set({ deleteSceneTarget }),
    deleteHotspotTarget: null,
    setDeleteHotspotTarget: (deleteHotspotTarget) =>
      set({ deleteHotspotTarget }),
  }),
);
