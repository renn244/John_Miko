import { virtualTourApi } from "@/api/admin/virtual-tour.api";
import type {
  CreateConnectedSceneDto,
  CreateVirtualTourSceneDto,
  InformationHotspotDto,
  NavigationHotspotDto,
  UpdateVirtualTourSceneDto,
} from "@/types/admin/virtual-tour.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetVirtualTourQuery = () => {
  return useQuery({
    queryKey: ["virtual-tour", "admin"],
    queryFn: virtualTourApi.getVirtualTour,
    refetchOnWindowFocus: false,
  });
};

export const useCreateStartingSceneMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["virtual-tour", "admin", "starting-scene", "create"],
    mutationFn: (data: CreateVirtualTourSceneDto) =>
      virtualTourApi.createStartingScene(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["virtual-tour", "admin"] });
    },
  });
};

export const useUpdateVirtualTourSceneMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["virtual-tour", "admin", "scene", "update"],
    mutationFn: ({
      sceneId,
      data,
    }: {
      sceneId: string;
      data: UpdateVirtualTourSceneDto;
    }) => virtualTourApi.updateScene(sceneId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["virtual-tour", "admin"] });
    },
  });
};

export const useUploadVirtualTourPanoramaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["virtual-tour", "admin", "panorama", "upload"],
    mutationFn: ({
      sceneId,
      panorama,
      onUploadProgress,
    }: {
      sceneId: string;
      panorama: File;
      onUploadProgress?: (percentage: number) => void;
    }) => virtualTourApi.uploadPanorama(sceneId, panorama, onUploadProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["virtual-tour", "admin"] });
    },
  });
};

export const useCreateNavigationHotspotMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["virtual-tour", "admin", "navigation-hotspot", "create"],
    mutationFn: ({
      sceneId,
      data,
    }: {
      sceneId: string;
      data: NavigationHotspotDto;
    }) => virtualTourApi.createNavigationHotspot(sceneId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["virtual-tour", "admin"] });
    },
  });
};

export const useCreateInformationHotspotMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["virtual-tour", "admin", "information-hotspot", "create"],
    mutationFn: ({
      sceneId,
      data,
    }: {
      sceneId: string;
      data: InformationHotspotDto;
    }) => virtualTourApi.createInformationHotspot(sceneId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["virtual-tour", "admin"] });
    },
  });
};

export const useUpdateNavigationHotspotMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["virtual-tour", "admin", "navigation-hotspot", "update"],
    mutationFn: ({
      hotspotId,
      data,
    }: {
      hotspotId: string;
      data: NavigationHotspotDto;
    }) => virtualTourApi.updateNavigationHotspot(hotspotId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["virtual-tour", "admin"] });
    },
  });
};

export const useUpdateInformationHotspotMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["virtual-tour", "admin", "information-hotspot", "update"],
    mutationFn: ({
      hotspotId,
      data,
    }: {
      hotspotId: string;
      data: InformationHotspotDto;
    }) => virtualTourApi.updateInformationHotspot(hotspotId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["virtual-tour", "admin"] });
    },
  });
};

export const useDeleteVirtualTourHotspotMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["virtual-tour", "admin", "hotspot", "delete"],
    mutationFn: virtualTourApi.deleteHotspot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["virtual-tour", "admin"] });
    },
  });
};

export const useCreateConnectedSceneMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["virtual-tour", "admin", "connected-scene", "create"],
    mutationFn: ({
      sceneId,
      data,
    }: {
      sceneId: string;
      data: CreateConnectedSceneDto;
    }) => virtualTourApi.createConnectedScene(sceneId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["virtual-tour", "admin"] });
    },
  });
};

export const usePublishVirtualTourSceneMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["virtual-tour", "admin", "scene", "publish"],
    mutationFn: virtualTourApi.publishScene,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["virtual-tour", "admin"] });
    },
  });
};

export const useHideVirtualTourSceneMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["virtual-tour", "admin", "scene", "hide"],
    mutationFn: virtualTourApi.hideScene,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["virtual-tour", "admin"] });
    },
  });
};

export const useDraftVirtualTourSceneMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["virtual-tour", "admin", "scene", "draft"],
    mutationFn: virtualTourApi.moveSceneToDraft,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["virtual-tour", "admin"] });
    },
  });
};

export const useDeleteVirtualTourSceneMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["virtual-tour", "admin", "scene", "delete"],
    mutationFn: virtualTourApi.deleteScene,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["virtual-tour", "admin"] });
    },
  });
};
