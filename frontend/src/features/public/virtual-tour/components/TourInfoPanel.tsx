import { Compass, MapPinned, Sparkles, X } from "lucide-react";

import type { MarkerDetail } from "@/features/public/virtual-tour/types/virtual-tour.type";

type TourInfoPanelProps = {
    marker: MarkerDetail;
    onClose: () => void;
};

const TourInfoPanel = ({ marker, onClose }: TourInfoPanelProps) => (
    <aside
        aria-label={`${marker.title} information`}
        aria-live="polite"
        className="absolute inset-x-3 bottom-3 z-20 max-h-[calc(100%-1.5rem)] overflow-y-auto rounded-xl border border-white/55 bg-card/72 p-4 shadow-xl backdrop-blur-xl motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 lg:top-4 lg:right-4 lg:bottom-auto lg:left-auto lg:w-[19rem] lg:max-h-[calc(100%-2rem)] lg:p-5 lg:motion-safe:slide-in-from-right-4"
    >
        <div className="flex items-start justify-between gap-4">
            <div>
                <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    <MapPinned className="size-3.5" />
                    {marker.eyebrow}
                </p>
                <h1 className="mt-2 text-xl font-bold tracking-tight text-foreground">{marker.title}</h1>
            </div>
            <button
                type="button"
                aria-label={`Close ${marker.title} information`}
                className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border bg-background text-muted-foreground transition-colors hover:border-primary/25 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
                onClick={onClose}
            >
                <X className="size-4" />
            </button>
        </div>

        {marker.imageUrl ? (
            <img
                src={marker.imageUrl}
                alt={marker.title}
                className="mt-4 h-40 w-full rounded-lg object-cover"
            />
        ) : null}

        <p className="mt-4 border-t pt-4 text-sm leading-6 text-muted-foreground">{marker.description}</p>

        {marker.facts.length ? (
            <div className="mt-4 grid gap-2">
                {marker.facts.map(({ label, value }, index) => {
                    const Icon = index === 0 ? Sparkles : index === 1 ? Compass : MapPinned;

                    return (
                        <div key={label} className="flex items-start gap-2.5 rounded-lg border border-white/45 bg-background/45 p-2.5">
                            <div className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/8 text-primary">
                                <Icon className="size-3.5" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-foreground">{value}</p>
                                <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{label}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        ) : null}
    </aside>
);

export default TourInfoPanel;
