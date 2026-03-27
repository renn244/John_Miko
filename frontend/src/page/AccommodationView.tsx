import AccommodationBookingModal from "@/components/pageComponents/Accommodation/AccommodationBookingModal";
import AccommodationSideBooking from "@/components/pageComponents/Accommodation/AccommodationSideBooking";
import { useGetAccommodationByIdQuery } from "@/hooks/admin/accommodation.hook";
import {
    Car,
    Dumbbell,
    House,
    Info,
    Users,
    UtensilsCrossed,
    Waves
} from 'lucide-react';
import { useState } from "react";
import { useParams } from "react-router";

const AccommodationView = () => {
    const [isOpen, setIsOpen] = useState(false);

    const { id } = useParams<{ id: string }>();
    const { data: accommodation, isLoading, error } = useGetAccommodationByIdQuery(id)

    const resortFacilities = [
        { icon: UtensilsCrossed, label: 'Restaurant', description: 'Filipino and international cuisine' },
        { icon: Waves, label: 'Swimming Pool', description: 'Infinity pool with ocean view' },
        { icon: Car, label: 'Parking', description: 'Free parking for guests' },
        { icon: Dumbbell, label: 'Fitness Center', description: 'Modern gym equipment' },
    ]
    
    if(isLoading) return null;

    if(!accommodation) return null; // return 404 page

    if(error) return "Error Page"; // return error page


    return (
        <div style={{ backgroundColor: '#F1F5F9' }}>

            <div className="relative bg-black">
                <div className="relative">
                    <div className="h-100 md:h-125 lg:h-150">
                        <img
                        src={accommodation.imageUrl}
                        alt={`${accommodation.name}`}
                        className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
                <div className="grid lg:grid-cols-3 gap-8">

                    <div className="lg:col-span-2 space-y-6">

                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border-2">

                            <h1 className="text-3xl md:text-4xl font-bold mb-4">
                                {accommodation.name}
                            </h1>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-primary/20">
                                        <House className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Type
                                        </p>
                                        <p className="font-bold">
                                            {accommodation.type}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-primary/20">
                                        <Users className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Capacity
                                        </p>
                                        <p className="font-bold">
                                            {accommodation.capacity} Guests
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border-2">
                            <h2 className="text-2xl font-bold mb-4">
                                About This Accommodation
                            </h2>
                            <p className="text-base leading-relaxed text-muted-foreground">
                                {accommodation.description}
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border-2">
                            <h2 className="text-2xl font-bold mb-6">
                                Amenities & Features
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {accommodation.amenities.map((amenity, index) => {

                                    return (
                                        <div key={index} className="flex items-start gap-4 p-4 rounded-xl border-2 hover:shadow-md transition-all">
                                            <div>
                                                <h3 className="font-bold mb-1">
                                                    {amenity}
                                                </h3>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border-2">
                            <h2 className="text-2xl font-bold mb-6">
                                Resort Facilities
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {resortFacilities.map((facility, index) => {
                                    const Icon = facility.icon;
                                    
                                    return (
                                        <div key={index} className="flex items-start gap-4 p-4 rounded-xl border-2 hover:shadow-md transition-all">
                                            <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0 bg-primary/20">
                                                <Icon className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold mb-1">
                                                    {facility.label}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {facility.description}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border-2">
                            <h2 className="text-2xl font-bold mb-6">
                                Virtual Tour
                            </h2>
                            <div className="relative h-64 md:h-96 rounded-xl overflow-hidden flex items-center justify-center bg-muted">
                                <div className="text-center">
                                    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 bg-primary/20">
                                        <Info className="w-10 h-10 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">
                                        360° Virtual Tour
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Interactive virtual tour coming soon
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="lg:col-span-1">
                        <div className="sticky top-24">

                            <AccommodationSideBooking 
                            setIsOpen={setIsOpen}
                            accommodation={{
                                id: accommodation.id,
                                price: accommodation.price
                            }}
                            />

                        </div>
                    </div>
                </div>
            </div>

            <AccommodationBookingModal 
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            accommodation={accommodation as any}
            />
        </div>
    )
}

export default AccommodationView