import NavBar from "@/components/common/NavBar";
import AccommodationSideBooking from "@/components/pageComponents/Accommodation/AccommodationSideBooking";
import { useGetAccommodationByIdQuery } from "@/hooks/admin/accommodation.hook";
import { useParams } from "react-router";

const AccommodationView = () => {
    const { id } = useParams<{ id: string }>();
    const { data: accommodation, isLoading, error } = useGetAccommodationByIdQuery(id)

    const resortFacilities = [
        { emoji: "🍽️", label: 'Restaurant', description: 'Filipino and international cuisine' },
        { emoji: "🏊", label: 'Swimming Pool', description: 'Infinity pool with ocean view' },
        { emoji: "🚗", label: 'Parking', description: 'Free parking for guests' },
    ]
    
    if(isLoading) return null;

    if(!accommodation) return null; // return 404 page

    if(error) return "Error Page"; // return error page


    return (
        <div className="bg-muted/30">
            <NavBar />

            <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">

                <div className="grid lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2">
                        <div className="bg-background rounded-2xl shadow-sm overflow-hidden">
                            <div className="relative w-full aspect-[16/9] overflow-hidden rounded-xl rounded-b-none">
                                <img
                                src={accommodation.imageUrl}
                                alt={accommodation.name}
                                className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="px-4 md:px-6 pt-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h1 className="text-2xl font-semibold tracking-tight">{accommodation.name}</h1>
                                        <div className="mt-2 flex items-center gap-2 flex-wrap">
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/50 border border-border/50 px-3 py-1 text-xs text-muted-foreground">
                                                🏠 {accommodation.type}
                                            </span>
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/50 border border-border/50 px-3 py-1 text-xs text-muted-foreground">
                                                👥 {accommodation.capacity} Guests
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <section className="p-4 md:p-6">
                                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-4">
                                    About This Accommodation
                                </p>
                                <div className="rounded-xl bg-background">
                                    <p className="text-sm leading-relaxed text-muted-foreground">
                                    {accommodation.description}
                                    </p>
                                </div>
                            </section>

                            <div className="h-px bg-border" />

                            <section className="p-4 md:p-6">
                                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-4">
                                    Amenities & Features
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {accommodation.amenities.map((amenity, index) => (
                                        <span
                                        key={index}
                                        className="inline-flex items-center gap-1.5 rounded-full bg-muted/40 border border-border/50 px-4 py-1.5 text-sm font-normal transition-colors hover:bg-muted/60"
                                        >
                                            {amenity}
                                        </span>
                                    ))}
                                </div>
                            </section>

                            <div className="h-px bg-border" />

                            <section className="p-4 md:p-6">
                                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-4">
                                    Resort Facilities
                                </p>
                                <div className="grid sm:grid-cols-2 gap-3">
                                    {resortFacilities.map((facility, index) => (
                                        <div
                                        key={index}
                                        className="flex items-start gap-3.5 rounded-xl border border-border/50 bg-background p-4 transition-colors hover:bg-muted/30"
                                        >
                                            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-muted/50 border border-border/40 text-lg leading-none">
                                                {facility.emoji}
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium leading-tight">{facility.label}</h3>
                                                <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                                                    {facility.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>

                    <aside className="lg:col-span-1">
                        <div className="sticky top-24">
                            <AccommodationSideBooking
                            accommodation={{
                                id: accommodation.id,
                                price: accommodation.price,
                                stayOptions: accommodation.stayOptions
                            }}
                            />
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    )
}

export default AccommodationView
