import { GuestCard, GuestDivider, GuestInfoChip } from "@/components/guest";
import { Button } from "@/components/ui/button";
import { formatPeso } from "@/lib/utils";
import type { Accommodation } from "@/types/admin/accommodation.type";
import { ArrowRight, Users } from "lucide-react";

type AccommodationCardViewProps = {
    accommodation: Accommodation;
    viewDetailsClick: () => void;
};

const AccommodationCardView = ({
    accommodation,
    viewDetailsClick,
}: AccommodationCardViewProps) => {
    const activeStayOptions = accommodation.stayOptions?.filter((option) => option.isActive) ?? [];
    const visibleAmenities = accommodation.amenities.slice(0, 3);
    const hiddenAmenitiesCount = Math.max(accommodation.amenities.length - visibleAmenities.length, 0);

    return (
        <GuestCard padded={false} className="group flex h-full overflow-hidden rounded-lg shadow-none">
            <article className="flex h-full w-full flex-col">
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    <img
                        src={accommodation.imageUrl}
                        alt={accommodation.name}
                        loading="lazy"
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                        <GuestInfoChip className="bg-background/95 text-foreground backdrop-blur">
                            {accommodation.type === "EventHall" ? "Event Hall" : accommodation.type}
                        </GuestInfoChip>
                    </div>
                </div>

                <div className="flex flex-1 flex-col p-4 md:p-5">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="size-3.5" />
                        Up to {accommodation.capacity} guests
                    </div>

                    <h3 className="mt-3 text-xl font-bold tracking-normal">
                        {accommodation.name}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                        {accommodation.description}
                    </p>

                    {activeStayOptions.length > 0 ? (
                        <p className="mt-3 line-clamp-1 text-sm text-muted-foreground">
                            Available stays: {activeStayOptions.map((option) => option.label).join(" / ")}
                        </p>
                    ) : null}

                    <div className="mt-4 flex flex-wrap gap-2">
                        {visibleAmenities.map((amenity) => (
                            <GuestInfoChip key={amenity} className="rounded-md">
                                {amenity}
                            </GuestInfoChip>
                        ))}
                        {hiddenAmenitiesCount > 0 ? (
                            <span className="inline-flex min-h-8 items-center px-2 text-sm font-medium text-primary">
                                +{hiddenAmenitiesCount} more
                            </span>
                        ) : null}
                    </div>

                    <GuestDivider className="my-5" />

                    <div className="mt-auto flex items-end justify-between gap-4">
                        <div>
                            <p className="text-xl font-extrabold leading-none">
                                {formatPeso(accommodation.price)}
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {accommodation.type === "EventHall" ? "/day" : "/stay"}
                            </p>
                        </div>
                        <Button onClick={viewDetailsClick}>
                            View Details
                            <ArrowRight className="size-4" />
                        </Button>
                    </div>
                </div>
            </article>
        </GuestCard>
    );
};

export default AccommodationCardView;
