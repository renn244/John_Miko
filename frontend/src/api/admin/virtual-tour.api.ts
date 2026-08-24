import apiClient from "@/lib/apiClient";
import { ValidationError } from "@/lib/handleNestError";
import type {
  AdminVirtualTour,
  AdminVirtualTourHotspot,
  AdminVirtualTourScene,
  CreateConnectedSceneDto,
  CreateConnectedSceneResponse,
  CreateVirtualTourSceneDto,
  InformationHotspotDto,
  NavigationHotspotDto,
  UpdateVirtualTourSceneDto,
} from "@/types/admin/virtual-tour.type";

export const virtualTourApi = {
  getVirtualTour: async () => {
    const response = await apiClient.get("/admin/virtual-tour");

    if (response.status >= 400) {
      throw new Error(
        response.data.message || "Unable to load the virtual tour.",
      );
    }

    return response.data as AdminVirtualTour;
  },
  createStartingScene: async (data: CreateVirtualTourSceneDto) => {
    const response = await apiClient.post(
      "/admin/virtual-tour/starting-scene",
      data,
    );

    if (response.status === 400) {
      throw new ValidationError(response.data);
    }
    if (response.status >= 400) {
      throw new Error(
        response.data.message || "Unable to create the starting scene.",
      );
    }

    return response.data as AdminVirtualTourScene;
  },
  updateScene: async (sceneId: string, data: UpdateVirtualTourSceneDto) => {
    const response = await apiClient.patch(
      `/admin/virtual-tour/scenes/${sceneId}`,
      data,
    );

    if (response.status === 400) {
      throw new ValidationError(response.data);
    }
    if (response.status >= 400) {
      throw new Error(response.data.message || "Unable to save the scene.");
    }

    return response.data as AdminVirtualTourScene;
  },
  uploadPanorama: async (
    sceneId: string,
    panorama: File,
    onUploadProgress?: (percentage: number) => void,
  ) => {
    const formData = new FormData();
    formData.append("panorama", panorama);

    const response = await apiClient.post(
      `/admin/virtual-tour/scenes/${sceneId}/panorama`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event) => {
          if (event.total) {
            onUploadProgress?.(Math.round((event.loaded / event.total) * 100));
          }
        },
      },
    );

    if (response.status >= 400) {
      throw new Error(
        response.data.message || "Unable to upload the panorama.",
      );
    }

    return response.data as AdminVirtualTourScene;
  },
  createNavigationHotspot: async (
    sceneId: string,
    data: NavigationHotspotDto,
  ) => {
    const response = await apiClient.post(
      `/admin/virtual-tour/scenes/${sceneId}/navigation-hotspots`,
      data,
    );

    if (response.status === 400) {
      throw new ValidationError(response.data);
    }
    if (response.status >= 400) {
      throw new Error(
        response.data.message || "Unable to create the Navigation hotspot.",
      );
    }

    return response.data as AdminVirtualTourHotspot;
  },
  createInformationHotspot: async (
    sceneId: string,
    data: InformationHotspotDto,
  ) => {
    const response = await apiClient.post(
      `/admin/virtual-tour/scenes/${sceneId}/information-hotspots`,
      data,
    );

    if (response.status === 400) {
      throw new ValidationError(response.data);
    }
    if (response.status >= 400) {
      throw new Error(
        response.data.message || "Unable to create the Information hotspot.",
      );
    }

    return response.data as AdminVirtualTourHotspot;
  },
  updateNavigationHotspot: async (
    hotspotId: string,
    data: NavigationHotspotDto,
  ) => {
    const response = await apiClient.patch(
      `/admin/virtual-tour/navigation-hotspots/${hotspotId}`,
      data,
    );

    if (response.status === 400) {
      throw new ValidationError(response.data);
    }
    if (response.status >= 400) {
      throw new Error(
        response.data.message || "Unable to save the Navigation hotspot.",
      );
    }

    return response.data as AdminVirtualTourHotspot;
  },
  updateInformationHotspot: async (
    hotspotId: string,
    data: InformationHotspotDto,
  ) => {
    const response = await apiClient.patch(
      `/admin/virtual-tour/information-hotspots/${hotspotId}`,
      data,
    );

    if (response.status === 400) {
      throw new ValidationError(response.data);
    }
    if (response.status >= 400) {
      throw new Error(
        response.data.message || "Unable to save the Information hotspot.",
      );
    }

    return response.data as AdminVirtualTourHotspot;
  },
  deleteHotspot: async (hotspotId: string) => {
    const response = await apiClient.delete(
      `/admin/virtual-tour/hotspots/${hotspotId}`,
    );

    if (response.status >= 400) {
      throw new Error(response.data.message || "Unable to delete the hotspot.");
    }

    return response.data as { id: string };
  },
  createConnectedScene: async (
    sceneId: string,
    data: CreateConnectedSceneDto,
  ) => {
    const response = await apiClient.post(
      `/admin/virtual-tour/scenes/${sceneId}/connected-scene`,
      data,
    );

    if (response.status === 400) {
      throw new ValidationError(response.data);
    }
    if (response.status >= 400) {
      throw new Error(
        response.data.message || "Unable to create the connected scene.",
      );
    }

    return response.data as CreateConnectedSceneResponse;
  },
  publishScene: async (sceneId: string) => {
    const response = await apiClient.post(
      `/admin/virtual-tour/scenes/${sceneId}/publish`,
    );

    if (response.status >= 400) {
      throw new Error(response.data.message || "Unable to publish the scene.");
    }

    return response.data as AdminVirtualTourScene;
  },
  hideScene: async (sceneId: string) => {
    const response = await apiClient.post(
      `/admin/virtual-tour/scenes/${sceneId}/hide`,
    );

    if (response.status >= 400) {
      throw new Error(response.data.message || "Unable to hide the scene.");
    }

    return response.data as AdminVirtualTourScene;
  },
  moveSceneToDraft: async (sceneId: string) => {
    const response = await apiClient.post(
      `/admin/virtual-tour/scenes/${sceneId}/draft`,
    );

    if (response.status >= 400) {
      throw new Error(
        response.data.message || "Unable to move the scene to draft.",
      );
    }

    return response.data as AdminVirtualTourScene;
  },
  deleteScene: async (sceneId: string) => {
    const response = await apiClient.delete(
      `/admin/virtual-tour/scenes/${sceneId}`,
    );

    if (response.status >= 400) {
      throw new Error(response.data.message || "Unable to delete the scene.");
    }

    return response.data as { id: string };
  },
};
