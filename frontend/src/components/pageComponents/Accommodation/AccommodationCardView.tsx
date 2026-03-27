import { Button } from "@/components/ui/button";
import { ArrowRight, Bed, Users } from "lucide-react";

type AccommodationCardViewProps = {
    name: string;
    imageUrl: string;
    type: string;
    price: number;
    description: string;
    capacity: number;
    viewDetailsClick: () => void;
}

const AccommodationCardView = ({
    name, imageUrl, type, price, description, capacity, viewDetailsClick
}: AccommodationCardViewProps) => {

    return (
        <div className="bg-white rounded-xl  overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group">

            <div className="relative h-64 overflow-hidden">
                <img
                src={imageUrl}
                alt={name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                <div className="absolute top-4 left-4">
                    <span
                    className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide backdrop-blur-sm"
                    style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        color: '#1E73BE',
                    }}
                    >
                        {type}
                    </span>
                </div>

                <div className="absolute top-4 right-4">
                    <div
                    className="px-3 py-1.5 rounded-full backdrop-blur-sm"
                    style={{
                        backgroundColor: 'rgba(249, 115, 22, 0.95)',
                    }}
                    >
                        <span className="text-white font-bold text-sm">
                            ₱{price.toLocaleString()}
                        </span>
                        <span className="text-white/90 text-xs ml-1">/ night</span>
                    </div>
                </div>
            </div>

            <div className="p-6">

                <h3 className="text-xl font-bold mb-2">
                    {name}
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed mb-2 line-clamp-2 min-h-12">
                    {description}
                </p>

                <div className="flex items-center gap-4 mb-4 pb-3 border-b">
                    <div className="flex items-center gap-2">
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                        >
                            <Users className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium">
                            {capacity} Guests
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                            <Bed className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium">
                            1 Room
                        </span>
                    </div>
                </div>

                <Button className="w-full" onClick={viewDetailsClick}>
                    View Details
                    <ArrowRight className="w-5 h-5" />
                </Button>
                
            </div>
        </div>
    )
}

export default AccommodationCardView