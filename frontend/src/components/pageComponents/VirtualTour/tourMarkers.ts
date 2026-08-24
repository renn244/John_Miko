import type { MarkerConfig } from "@photo-sphere-viewer/markers-plugin";

import { VIRTUAL_TOUR_CONFIG } from "@/lib/constant/VIRTUAL_TOUR.constant";
import type {
    InfoDisplayMode,
    InfoTourMarker,
    TourMarker,
    TourScene,
} from "@/types/virtual-tour.type";

const escapeHtml = (value: string) =>
    value.replace(/[&<>'"]/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#039;",
        '"': "&quot;",
    })[character] || character);

const getQuickInfoContent = (marker: InfoTourMarker) => `
    <div class="virtual-tour-quick-info">
        <p class="virtual-tour-quick-info__title">${escapeHtml(marker.detail.title)}</p>
        <p class="virtual-tour-quick-info__description">${escapeHtml(marker.detail.description)}</p>
    </div>
`;

const getMarkerConfig = (
    marker: TourMarker,
    infoDisplayMode: InfoDisplayMode,
    isCompactMarker: boolean,
): MarkerConfig => {
    const label = escapeHtml(marker.label);

    if (marker.kind === "navigation") {
        return {
            id: marker.id,
            position: marker.position,
            html: `
                <button class="virtual-tour-navigation-marker" type="button" aria-label="${label}">
                    <span class="virtual-tour-navigation-marker__icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                    </span>
                    <span class="virtual-tour-navigation-marker__label">${label}</span>
                </button>
            `,
            size: isCompactMarker
                ? VIRTUAL_TOUR_CONFIG.markerSize.compact
                : VIRTUAL_TOUR_CONFIG.markerSize.navigation,
            anchor: "center bottom",
            className: "virtual-tour-navigation-marker-shell",
            hoverScale: false,
            tooltip: {
                content: label,
                trigger: "hover",
            },
        };
    }

    return {
        id: marker.id,
        position: marker.position,
        html: `
            <button class="virtual-tour-marker" type="button" aria-label="View ${label}">
                <span class="virtual-tour-marker__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 10.75v5.5M12 7.75h.01" />
                    </svg>
                </span>
                <span class="virtual-tour-marker__label">${label}</span>
            </button>
        `,
        size: isCompactMarker
            ? VIRTUAL_TOUR_CONFIG.markerSize.compact
            : VIRTUAL_TOUR_CONFIG.markerSize.info,
        anchor: "center bottom",
        className: "virtual-tour-marker-shell",
        hoverScale: false,
        tooltip:
            infoDisplayMode === "quick"
                ? {
                      content: getQuickInfoContent(marker),
                      className: "virtual-tour-marker-tooltip",
                      position: "top center",
                      trigger: "click",
                  }
                : {
                      content: label,
                      trigger: "hover",
                  },
    };
};

export const getVirtualTourMarkerConfigs = (
    scene: TourScene,
    infoDisplayMode: InfoDisplayMode,
    isCompactMarker = false,
) => scene.markers.map((marker) => getMarkerConfig(marker, infoDisplayMode, isCompactMarker));
