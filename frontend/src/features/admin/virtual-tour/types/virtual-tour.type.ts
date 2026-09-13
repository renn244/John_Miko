export type VirtualTourSceneStatus = "DRAFT" | "PUBLISHED" | "HIDDEN";
export type VirtualTourHotspotType = "NAVIGATION" | "INFORMATION";

export type PanoramaPosition = {
  yaw: number;
  pitch: number;
};

export type NewVirtualTourHotspot = {
  type: VirtualTourHotspotType;
  position: PanoramaPosition;
};

export type AdminVirtualTourHotspot = {
  id: string;
  sourceSceneId: string;
  type: VirtualTourHotspotType;
  label: string;
  icon: string | null;
  yaw: number;
  pitch: number;
  targetSceneId: string | null;
  targetYaw: number | null;
  targetPitch: number | null;
  infoTitle: string | null;
  infoDescription: string | null;
  infoImageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  targetScene: {
    id: string;
    name: string;
    status: VirtualTourSceneStatus;
  } | null;
};

export type IncomingVirtualTourHotspot = {
  id: string;
  label: string;
  sourceScene: { id: string; name: string };
};

export type AdminVirtualTourScene = {
  id: string;
  tourId: string;
  name: string;
  slug: string;
  status: VirtualTourSceneStatus;
  originalUrl: string | null;
  previewUrl: string | null;
  tilesBaseUrl: string | null;
  tileCols: number;
  tileRows: number;
  panoramaWidth: number | null;
  initialYaw: number;
  initialPitch: number;
  outgoingHotspots: AdminVirtualTourHotspot[];
  incomingHotspots: IncomingVirtualTourHotspot[];
  createdAt: string;
  updatedAt: string;
};

type PanoramaReadyScene = AdminVirtualTourScene & {
  originalUrl: string;
  previewUrl: string;
  tilesBaseUrl: string;
  panoramaWidth: number;
};

export const isPanoramaReady = (
  scene: AdminVirtualTourScene | null | undefined,
): scene is PanoramaReadyScene =>
  Boolean(
    scene?.originalUrl &&
    scene.previewUrl &&
    scene.tilesBaseUrl &&
    scene.panoramaWidth,
  );

export type AdminVirtualTour = {
  id: string;
  name: string;
  startingSceneId: string | null;
  startingScene: { id: string; name: string } | null;
  scenes: AdminVirtualTourScene[];
  createdAt: string;
  updatedAt: string;
};

export type CreateVirtualTourSceneDto = {
  name: string;
  initialYaw?: number;
  initialPitch?: number;
};

export type UpdateVirtualTourSceneDto = {
  name: string;
  initialYaw: number;
  initialPitch: number;
};

export type NavigationHotspotDto = PanoramaPosition & {
  label: string;
  icon?: string | null;
  targetSceneId: string;
  targetYaw?: number | null;
  targetPitch?: number | null;
  isActive: boolean;
};

export type InformationHotspotDto = PanoramaPosition & {
  label: string;
  icon?: string | null;
  infoTitle: string;
  infoDescription: string;
  infoImageUrl?: string | null;
  isActive: boolean;
};

export const getNavigationHotspotUpdate = (
  hotspot: AdminVirtualTourHotspot,
  targetYaw: number | null,
  targetPitch: number | null,
): NavigationHotspotDto => {
  if (hotspot.type !== "NAVIGATION" || !hotspot.targetSceneId) {
    throw new Error("The hotspot is not connected to a destination scene.");
  }

  return {
    label: hotspot.label,
    icon: hotspot.icon,
    yaw: hotspot.yaw,
    pitch: hotspot.pitch,
    targetSceneId: hotspot.targetSceneId,
    targetYaw,
    targetPitch,
    isActive: hotspot.isActive,
  };
};

export type CreateConnectedSceneDto = {
  hotspot: PanoramaPosition & { label: string; isActive: boolean };
  scene: CreateVirtualTourSceneDto;
};

export type CreateConnectedSceneResponse = {
  scene: AdminVirtualTourScene;
  hotspot: AdminVirtualTourHotspot;
};
