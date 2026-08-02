import { Maximize2, Minimize2, Minus, Plus, Settings2 } from "lucide-react";
import { useState } from "react";

import { VIRTUAL_TOUR_CONFIG } from "@/lib/constant/VIRTUAL_TOUR.constant";
import type { InfoDisplayMode, SceneTransitionMode } from "@/types/virtual-tour.type";

type TourControlsProps = {
    infoDisplayMode: InfoDisplayMode;
    isFullscreen: boolean;
    onFullscreenToggle: () => void;
    onInfoDisplayModeChange: (infoDisplayMode: InfoDisplayMode) => void;
    onSceneTransitionModeChange: (sceneTransitionMode: SceneTransitionMode) => void;
    onZoomIn: () => void;
    onZoomLevelChange: (zoomLevel: number) => void;
    onZoomOut: () => void;
    sceneTransitionMode: SceneTransitionMode;
    zoomLevel: number;
};

type SettingsOptionProps<T extends string> = {
    active: boolean;
    description: string;
    label: string;
    onSelect: (value: T) => void;
    value: T;
};

const SettingsOption = <T extends string>({
    active,
    description,
    label,
    onSelect,
    value,
}: SettingsOptionProps<T>) => (
    <button
        type="button"
        aria-pressed={active}
        className={
            active
                ? "flex w-full flex-col rounded-lg bg-primary px-3 py-2 text-left text-primary-foreground"
                : "flex w-full flex-col rounded-lg px-3 py-2 text-left text-foreground transition-colors hover:bg-muted/70"
        }
        onClick={() => onSelect(value)}
    >
        <span className="text-xs font-semibold">{label}</span>
        <span className={active ? "mt-0.5 text-[0.68rem] text-primary-foreground/80" : "mt-0.5 text-[0.68rem] text-muted-foreground"}>
            {description}
        </span>
    </button>
);

const TourControls = ({
    infoDisplayMode,
    isFullscreen,
    onFullscreenToggle,
    onInfoDisplayModeChange,
    onSceneTransitionModeChange,
    onZoomIn,
    onZoomLevelChange,
    onZoomOut,
    sceneTransitionMode,
    zoomLevel,
}: TourControlsProps) => {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const handleInfoDisplayModeChange = (nextInfoDisplayMode: InfoDisplayMode) => {
        onInfoDisplayModeChange(nextInfoDisplayMode);
        setIsSettingsOpen(false);
    };

    const handleSceneTransitionModeChange = (nextSceneTransitionMode: SceneTransitionMode) => {
        onSceneTransitionModeChange(nextSceneTransitionMode);
        setIsSettingsOpen(false);
    };

    return (
        <div
            aria-label="Tour controls"
            className="absolute left-3 top-3 z-10"
            onPointerDown={(event) => event.stopPropagation()}
        >
            <div className="flex overflow-hidden rounded-xl border border-white/55 bg-card/72 shadow-lg backdrop-blur-xl">
                <button
                    type="button"
                    aria-label="Zoom out"
                    className="inline-flex size-11 items-center justify-center border-r border-border/60 text-foreground transition-colors hover:bg-background/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45"
                    onClick={onZoomOut}
                >
                    <Minus className="size-4" />
                </button>
                <label className="flex h-11 items-center gap-2 border-r border-border/60 px-2.5 text-xs font-semibold tabular-nums text-foreground">
                    <input
                        aria-label="Zoom level"
                        className="virtual-tour-zoom-range"
                        max={VIRTUAL_TOUR_CONFIG.zoomRange.max}
                        min={VIRTUAL_TOUR_CONFIG.zoomRange.min}
                        step={VIRTUAL_TOUR_CONFIG.zoomRange.step}
                        type="range"
                        value={zoomLevel}
                        onChange={(event) => onZoomLevelChange(Number(event.currentTarget.value))}
                    />
                    <output aria-live="polite">{zoomLevel}%</output>
                </label>
                <button
                    type="button"
                    aria-label="Zoom in"
                    className="inline-flex size-11 items-center justify-center border-r border-border/60 text-foreground transition-colors hover:bg-background/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45"
                    onClick={onZoomIn}
                >
                    <Plus className="size-4" />
                </button>
                <button
                    type="button"
                    aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                    className="inline-flex size-11 items-center justify-center border-r border-border/60 text-foreground transition-colors hover:bg-background/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45"
                    onClick={onFullscreenToggle}
                >
                    {isFullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
                </button>
                <button
                    type="button"
                    aria-expanded={isSettingsOpen}
                    aria-label="Tour display settings"
                    className="inline-flex size-11 items-center justify-center text-foreground transition-colors hover:bg-background/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45"
                    onClick={() => setIsSettingsOpen((isOpen) => !isOpen)}
                >
                    <Settings2 className="size-4" />
                </button>
            </div>

            {isSettingsOpen ? (
                <div className="absolute left-0 top-full mt-2 w-56 rounded-xl border border-white/55 bg-card/92 p-2 shadow-lg backdrop-blur-xl">
                    <p className="px-2 pb-1.5 pt-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        Marker information
                    </p>
                    <SettingsOption
                        active={infoDisplayMode === "panel"}
                        description="Full area details"
                        label="Details panel"
                        value="panel"
                        onSelect={handleInfoDisplayModeChange}
                    />
                    <SettingsOption
                        active={infoDisplayMode === "quick"}
                        description="Compact marker popover"
                        label="Quick info"
                        value="quick"
                        onSelect={handleInfoDisplayModeChange}
                    />
                    <div className="my-2 border-t border-border/60" />
                    <p className="px-2 pb-1.5 pt-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        Scene transition
                    </p>
                    <SettingsOption
                        active={sceneTransitionMode === "zoom-fade"}
                        description="Move forward between areas"
                        label="Zoom + fade"
                        value="zoom-fade"
                        onSelect={handleSceneTransitionModeChange}
                    />
                    <SettingsOption
                        active={sceneTransitionMode === "fade"}
                        description="Keep the current camera zoom"
                        label="Fade only"
                        value="fade"
                        onSelect={handleSceneTransitionModeChange}
                    />
                </div>
            ) : null}
        </div>
    );
};

export default TourControls;
