import AccommodationCardView from "@/components/pageComponents/Accommodation/AccommodationCardView"
import { Button } from "@/components/ui/button"
import { useGetAccommodationsQuery } from "@/hooks/admin/accommodation.hook"
import type { Accommodation } from "@/types/admin/accommodation.type"
import { useState } from "react"
import { useNavigate } from "react-router"

const AccommodationList = () => {
    const [selectedType, setSelectedType] = useState<Accommodation['type'] | "All">("All")

    const navigate = useNavigate()
    const { data: accommodations } = useGetAccommodationsQuery({
        type: selectedType === "All" ? undefined : selectedType,
        availability: "Available"
    })

    return (
        <div className="min-h-screen">

            <div className="relative pt-16 md:pt-24">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
                        Our Accommodations
                    </h1>
                    <p className="text-lg md:text-xl max-w-3xl font-medium text-muted-foreground">
                        Discover your perfect home away from home at John Miko's Place Resort
                    </p>
                </div>
            </div>


            <div className="max-w-7xl mx-auto px-4 pt-4">

                <div className="max-w-7xl mx-auto py-4">
                    <div className="bg-white rounded-2xl p-2 md:p-4 shadow-sm border">
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm md:text-base">
                                    Filter by Type:
                                </span>
                                <span className="text-sm w-18.75">
                                    {accommodations && `${accommodations.length} ${accommodations.length === 1 ? 'result' : 'results'}`}
                                </span>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 md:gap-3">
                                {['All', 'Room', 'Cottage', 'EventHall'].map((type: any) => (
                                    <Button
                                    key={type}
                                    variant={selectedType === type ? "default" : "outline"}
                                    onClick={() => setSelectedType(type)}
                                    >
                                        {type}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {accommodations?.map((accommodation) => (
                        <AccommodationCardView
                        key={accommodation.id}
                        name={accommodation.name}
                        imageUrl={accommodation.imageUrl}
                        type={accommodation.type}
                        price={accommodation.price}
                        description={accommodation.description}
                        capacity={accommodation.capacity}
                        viewDetailsClick={() => navigate(`/accommodation/${accommodation.id}`)}
                        />
                    ))}
                </div>

            </div>

        </div>
    )
}

export default AccommodationList