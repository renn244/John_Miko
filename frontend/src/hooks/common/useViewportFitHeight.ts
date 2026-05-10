import { useLayoutEffect, useState, type RefObject } from "react";

type UseViewportFitHeightOptions = {
    enabled?: boolean;
    /**
     * Selector for a parent container whose bottom padding should be subtracted
     * (useful for layouts that add padding around the main content).
     */
    containerSelector?: string;
    /** Additional pixels to subtract from available height. */
    extraOffset?: number;
};

export const useViewportFitHeight = (
    elementRef: RefObject<HTMLElement | null>,
    options: UseViewportFitHeightOptions = {}
) => {
    const { enabled = true, containerSelector = "main", extraOffset = 0 } = options;
    const [height, setHeight] = useState<number | undefined>(undefined);

    useLayoutEffect(() => {
        if (!enabled) {
            setHeight(undefined);
            return;
        }

        const compute = () => {
            const el = elementRef.current;
            if (!el) return;

            const rect = el.getBoundingClientRect();

            const containerEl = containerSelector ? el.closest(containerSelector) : null;
            const containerPaddingBottom = containerEl
                ? Number.parseFloat(getComputedStyle(containerEl).paddingBottom || "0")
                : 0;

            const available = window.innerHeight - rect.top - containerPaddingBottom - extraOffset;
            setHeight(available > 0 ? Math.floor(available) : undefined);
        };

        compute();
        window.addEventListener("resize", compute);
        return () => window.removeEventListener("resize", compute);
    }, [elementRef, enabled, containerSelector, extraOffset]);

    return height;
};
