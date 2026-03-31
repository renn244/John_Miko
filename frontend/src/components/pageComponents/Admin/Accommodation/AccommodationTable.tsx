import AccommodationCard from "@/components/pageComponents/Admin/Accommodation/AccommodationCard";
import { useGetAccommodationsQuery } from "@/hooks/admin/accommodation.hook";
import { useAccommodationSearchParams } from "@/hooks/admin/accommodation.search";

const AccommodationTable = () => {
    const { search, type, status } = useAccommodationSearchParams();

    const { data: accommodations, isLoading } = useGetAccommodationsQuery({ search, type, availability: status });

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading ? (
                null
            ) : (
                accommodations?.map((acc) => (
                    <AccommodationCard 
                    key={acc.id}
                    id={acc.id}
                    imageUrl={acc.imageUrl}
                    name={acc.name}
                    description={acc.description}
                    type={acc.type}
                    availability={acc.availability}
                    capacity={acc.capacity}
                    price={acc.price}
                    amenities={acc.amenities}
                    />
                ))
            )}
      </div>
    )
}

export default AccommodationTable