import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Accommodation } from "@/types/admin/accommodation.type";
import { ArrowRight, Home, Users } from "lucide-react";

type AccommodationCardViewProps = {
    name: string;
    imageUrl: string;
    type: Accommodation["type"];
    price: number;
    description: string;
    capacity: number;
    viewDetailsClick: () => void;
}

const AccommodationCardView = ({
    name, imageUrl, type, price, description, capacity, viewDetailsClick
}: AccommodationCardViewProps) => {

    const typeLabel = type === "EventHall" ? "Event Hall" : type
    const priceSuffix = type === "EventHall" ? "/ day" : "/ night"

    return (
        <Card className="group overflow-hidden py-0 gap-0 shadow-sm transition-shadow hover:shadow-md">
            <div className="relative overflow-hidden aspect-16/10">
                <img
                src={imageUrl}
                alt={name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/0 to-black/0" />

                <div className="absolute top-4 right-4">
                    <Badge className="bg-primary/95">
                        ₱{price.toLocaleString()}
                        <span className="ml-1 text-xs font-normal text-primary-foreground/90">
                            {priceSuffix}
                        </span>
                    </Badge>
                </div>
            </div>

            <div className="p-6">
                <h3 className="text-lg md:text-xl font-semibold tracking-tight leading-snug">
                    {name}
                </h3>

                <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2 min-h-10">
                    {description}
                </p>

                <div className="mt-4 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border/50 bg-muted/40">
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </span>
                        <span className="text-sm font-medium">
                            {capacity} Guests
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border/50 bg-muted/40">
                            <Home className="h-4 w-4 text-muted-foreground" />
                        </span>
                        <span className="text-sm font-medium">
                            {typeLabel}
                        </span>
                    </div>
                </div>

                <Button className="w-full mt-5" onClick={viewDetailsClick}>
                    View Details
                    <ArrowRight className="w-5 h-5" />
                </Button>
            </div>
        </Card>
    )
}

export default AccommodationCardView