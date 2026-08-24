import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { VIRTUAL_TOUR_CONFIG } from "@/lib/constant/VIRTUAL_TOUR.constant";
import { cn } from "@/lib/utils";
import { isPanoramaReady } from "@/types/admin/virtual-tour.type";
import type {
  AdminVirtualTourHotspot,
  AdminVirtualTourScene,
  PanoramaPosition,
} from "@/types/admin/virtual-tour.type";
import type { Viewer } from "@photo-sphere-viewer/core";
import { EquirectangularTilesAdapter } from "@photo-sphere-viewer/equirectangular-tiles-adapter";
import {
  events,
  MarkersPlugin,
  type MarkerConfig,
} from "@photo-sphere-viewer/markers-plugin";
import {
  ArrowRight,
  ChevronDown,
  Info,
  Maximize2,
  Minus,
  MousePointer2,
  Navigation,
  Plus,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ReactPhotoSphereViewer,
  type PluginConfig,
} from "react-photo-sphere-viewer";

import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";
import "@/page/VirtualTour.css";
import "./virtual-tour-admin.css";

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>'"]/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#039;",
        '"': "&quot;",
      })[character] || character,
  );

const markerConfig = (
  hotspot: AdminVirtualTourHotspot,
  selected: boolean,
): MarkerConfig => {
  const label = escapeHtml(hotspot.label);
  const width = Math.min(220, Math.max(108, hotspot.label.length * 7 + 58));
  const isNavigation = hotspot.type === "NAVIGATION";

  return {
    id: hotspot.id,
    position: { yaw: hotspot.yaw, pitch: hotspot.pitch },
    html: isNavigation
      ? `<button class="virtual-tour-navigation-marker${selected ? " admin-tour-marker--selected" : ""}" type="button" aria-label="${label}">
          <span class="virtual-tour-navigation-marker__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </span>
          <span class="virtual-tour-navigation-marker__label">${label}</span>
        </button>`
      : `<button class="virtual-tour-marker${selected ? " admin-tour-marker--selected" : ""}" type="button" aria-label="View ${label}">
          <span class="virtual-tour-marker__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" /><path d="M12 10.75v5.5M12 7.75h.01" /></svg>
          </span>
          <span class="virtual-tour-marker__label">${label}</span>
        </button>`,
    size: { width, height: 44 },
    anchor: "center bottom",
    className: isNavigation
      ? "virtual-tour-navigation-marker-shell"
      : "virtual-tour-marker-shell",
    hoverScale: false,
    tooltip: { content: label, trigger: "hover" },
  };
};

type PlacementMode = "INFORMATION" | "NAVIGATION" | "MOVE" | null;

type VirtualTourPanoramaCanvasProps = {
  scene: AdminVirtualTourScene;
  selectedHotspotId: string | null;
  placementMode: PlacementMode;
  isPreview: boolean;
  initialPosition: PanoramaPosition | null;
  onSelectHotspot: (hotspot: AdminVirtualTourHotspot) => void;
  onPosition: (position: PanoramaPosition) => void;
  onViewerReady: (viewer: Viewer) => void;
  onOpenUpload: () => void;
  onOpenPreview: () => void;
  onClosePreview: () => void;
  onStartPlacement: (type: Exclude<PlacementMode, "MOVE" | null>) => void;
  onCancelPlacement: () => void;
  placementDisabled: boolean;
};

const VirtualTourPanoramaCanvas = ({
  scene,
  selectedHotspotId,
  placementMode,
  isPreview,
  initialPosition,
  onSelectHotspot,
  onPosition,
  onViewerReady,
  onOpenUpload,
  onOpenPreview,
  onClosePreview,
  onStartPlacement,
  onCancelPlacement,
  placementDisabled,
}: VirtualTourPanoramaCanvasProps) => {
  const panoramaReady = isPanoramaReady(scene);
  const [viewer, setViewer] = useState<Viewer | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(
    VIRTUAL_TOUR_CONFIG.defaultZoomLevel,
  );
  const [previewInfo, setPreviewInfo] =
    useState<AdminVirtualTourHotspot | null>(null);
  const placementModeRef = useRef(placementMode);
  const onPositionRef = useRef(onPosition);
  const markers = useMemo(
    () =>
      scene.outgoingHotspots
        .filter((hotspot) => !isPreview || hotspot.isActive)
        .map((hotspot) =>
          markerConfig(hotspot, hotspot.id === selectedHotspotId),
        ),
    [isPreview, scene.outgoingHotspots, selectedHotspotId],
  );
  const plugins = useMemo<PluginConfig[]>(
    () => [[MarkersPlugin, { markers }]],
    [markers],
  );
  const panorama = useMemo(() => {
    if (!scene.previewUrl || !scene.tilesBaseUrl || !scene.panoramaWidth)
      return null;

    const version = encodeURIComponent(scene.updatedAt);
    const withVersion = (url: string) =>
      `${url}${url.includes("?") ? "&" : "?"}v=${version}`;

    return {
      baseUrl: withVersion(scene.previewUrl),
      width: scene.panoramaWidth,
      cols: scene.tileCols,
      rows: scene.tileRows,
      tileUrl: (column: number, row: number) =>
        withVersion(`${scene.tilesBaseUrl}/${row}_${column}.jpg`),
    };
  }, [
    scene.panoramaWidth,
    scene.previewUrl,
    scene.tileCols,
    scene.tileRows,
    scene.tilesBaseUrl,
    scene.updatedAt,
  ]);

  useEffect(() => {
    placementModeRef.current = placementMode;
    onPositionRef.current = onPosition;
  }, [onPosition, placementMode]);

  useEffect(() => {
    if (!viewer) return;
    viewer.getPlugin<MarkersPlugin>(MarkersPlugin)?.setMarkers(markers);
  }, [markers, viewer]);

  useEffect(() => {
    if (!viewer) return;
    const plugin = viewer.getPlugin<MarkersPlugin>(MarkersPlugin);
    if (!plugin) return;

    const handleSelect = (
      event: InstanceType<typeof events.SelectMarkerEvent>,
    ) => {
      const hotspot = scene.outgoingHotspots.find(
        (item) => item.id === event.marker.id,
      );
      if (!hotspot) return;
      if (isPreview && hotspot.type === "INFORMATION") setPreviewInfo(hotspot);
      onSelectHotspot(hotspot);
    };

    plugin.addEventListener(events.SelectMarkerEvent.type, handleSelect);
    return () =>
      plugin.removeEventListener(events.SelectMarkerEvent.type, handleSelect);
  }, [isPreview, onSelectHotspot, scene.outgoingHotspots, viewer]);

  if (!panoramaReady || !panorama) {
    return (
      <div className="flex min-h-120 flex-1 flex-col items-center justify-center rounded-xl border bg-card p-6 text-center">
        <span className="flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Upload className="size-6" />
        </span>
        <h2 className="mt-4 text-lg font-semibold">
          Add this scene’s panorama
        </h2>
        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          Upload one equirectangular panorama before placing hotspots. The
          detailed viewer tiles are created automatically.
        </p>
        <Button className="mt-5" onClick={onOpenUpload}>
          <Upload className="size-4" /> Upload panorama
        </Button>
      </div>
    );
  }

  return (
    <div className="admin-tour-frame relative min-h-120 flex-1 overflow-hidden rounded-xl bg-card shadow-lg">
      <ReactPhotoSphereViewer
        key={`${scene.id}:${scene.updatedAt}`}
        src={panorama}
        adapter={EquirectangularTilesAdapter}
        plugins={plugins}
        navbar={false}
        defaultYaw={initialPosition?.yaw ?? scene.initialYaw}
        defaultPitch={initialPosition?.pitch ?? scene.initialPitch}
        width="100%"
        height="100%"
        containerClass={cn(
          "admin-tour-viewer",
          placementMode && "admin-tour-viewer--placing",
        )}
        onReady={(instance) => {
          setViewer(instance);
          setZoomLevel(Math.round(instance.getZoomLevel()));
          onViewerReady(instance);
        }}
        onZoomChange={(event) => setZoomLevel(Math.round(event.zoomLevel))}
        onClick={(event) => {
          if (!placementModeRef.current || event.data.rightclick) return;
          onPositionRef.current({
            yaw: event.data.yaw,
            pitch: event.data.pitch,
          });
        }}
      />

      <div
        aria-label="Panorama controls"
        className="absolute left-3 top-3 z-20"
        onPointerDown={(event) => event.stopPropagation()}
      >
        <div className="flex overflow-hidden rounded-xl border border-white/55 bg-card/72 shadow-lg backdrop-blur-xl">
          <button
            type="button"
            aria-label="Zoom out"
            className="inline-flex size-11 items-center justify-center border-r border-border/60 text-foreground transition-colors hover:bg-background/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45"
            onClick={() => viewer?.zoomOut(VIRTUAL_TOUR_CONFIG.zoomControlStep)}
          >
            <Minus className="size-4" />
          </button>
          <label className="hidden h-11 items-center gap-2 border-r border-border/60 px-2.5 text-xs font-semibold tabular-nums text-foreground 2xl:flex">
            <input
              aria-label="Zoom level"
              className="virtual-tour-zoom-range"
              max={VIRTUAL_TOUR_CONFIG.zoomRange.max}
              min={VIRTUAL_TOUR_CONFIG.zoomRange.min}
              step={VIRTUAL_TOUR_CONFIG.zoomRange.step}
              type="range"
              value={zoomLevel}
              onChange={(event) => {
                const nextZoom = Number(event.currentTarget.value);
                setZoomLevel(nextZoom);
                viewer?.zoom(nextZoom);
              }}
            />
            <output aria-live="polite">{zoomLevel}%</output>
          </label>
          <button
            type="button"
            aria-label="Zoom in"
            className="inline-flex size-11 items-center justify-center text-foreground transition-colors hover:bg-background/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45"
            onClick={() => viewer?.zoomIn(VIRTUAL_TOUR_CONFIG.zoomControlStep)}
          >
            <Plus className="size-4" />
          </button>
        </div>
      </div>

      {!isPreview ? (
        <>
          <div
            className="absolute right-3 top-3 z-20 flex items-center gap-2"
            onPointerDown={(event) => event.stopPropagation()}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  aria-label="Add hotspot"
                  disabled={placementDisabled}
                >
                  <Plus className="size-4" />
                  <span className="hidden 2xl:inline">Add hotspot</span>
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem
                  onSelect={() => onStartPlacement("NAVIGATION")}
                >
                  <ArrowRight className="size-4" />
                  <span>
                    <span className="block font-medium">Navigation</span>
                    <span className="text-xs text-muted-foreground">
                      Connect another scene
                    </span>
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => onStartPlacement("INFORMATION")}
                >
                  <Info className="size-4" />
                  <span>
                    <span className="block font-medium">Information</span>
                    <span className="text-xs text-muted-foreground">
                      Explain something in view
                    </span>
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="secondary"
              size="sm"
              aria-label="Preview tour"
              onClick={onOpenPreview}
            >
              <Maximize2 className="size-4" />
              <span className="hidden 2xl:inline">Preview tour</span>
            </Button>
          </div>
          <div className="pointer-events-none absolute bottom-3 left-3 rounded-lg border border-white/45 bg-card/72 px-3 py-2 shadow-lg backdrop-blur-xl">
            <p className="text-sm font-semibold text-foreground">
              {scene.name}
            </p>
            <p className="text-xs text-muted-foreground">Drag to look around</p>
          </div>
        </>
      ) : null}

      {placementMode && !isPreview ? (
        <div className="absolute inset-x-3 bottom-3 z-20 flex items-center justify-center">
          <div className="flex items-center gap-3 rounded-xl bg-foreground px-3 py-2 text-sm font-medium text-background shadow-lg">
            <MousePointer2 className="size-4" />
            Click where the{" "}
            {placementMode === "MOVE"
              ? "hotspot should move"
              : "hotspot should appear"}
            <button
              type="button"
              className="rounded-md px-2 py-1 text-xs text-background/80 transition-colors hover:bg-background/10 hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background/60"
              onClick={onCancelPlacement}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}

      {isPreview && previewInfo ? (
        <aside
          aria-label={`${previewInfo.infoTitle || previewInfo.label} information`}
          aria-live="polite"
          className="absolute inset-x-3 bottom-3 z-20 max-h-[calc(100%-5rem)] overflow-y-auto rounded-xl border border-white/55 bg-card/72 p-4 shadow-xl backdrop-blur-xl motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 lg:inset-x-auto lg:bottom-auto lg:right-4 lg:top-16 lg:w-[19rem] lg:p-5 lg:motion-safe:slide-in-from-right-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                <Info className="size-3.5" /> Information
              </p>
              <h3 className="mt-2 text-xl font-bold tracking-tight text-foreground">
                {previewInfo.infoTitle || previewInfo.label}
              </h3>
            </div>
            <button
              type="button"
              aria-label="Close information"
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border bg-background text-muted-foreground transition-colors hover:border-primary/25 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
              onClick={() => setPreviewInfo(null)}
            >
              <X className="size-4" />
            </button>
          </div>
          {previewInfo.infoImageUrl ? (
            <img
              src={previewInfo.infoImageUrl}
              alt=""
              className="mt-4 h-36 w-full rounded-lg object-cover"
            />
          ) : null}
          <p className="mt-4 border-t pt-4 text-sm leading-6 text-muted-foreground">
            {previewInfo.infoDescription}
          </p>
        </aside>
      ) : null}

      {isPreview ? (
        <div className="absolute right-3 top-3 z-20 flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-lg border border-white/45 bg-card/72 px-3 py-2 text-sm font-semibold text-foreground shadow-lg backdrop-blur-xl sm:flex">
            <Navigation className="size-4 text-primary" /> Draft preview
          </div>
          <Button
            className="border border-white/55 bg-card/72 shadow-lg backdrop-blur-xl hover:bg-card/90"
            variant="secondary"
            size="sm"
            onClick={onClosePreview}
          >
            <X className="size-4" /> Exit preview
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default VirtualTourPanoramaCanvas;
