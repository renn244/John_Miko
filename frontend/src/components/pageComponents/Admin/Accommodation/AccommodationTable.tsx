import DataPagination from "@/components/common/DataPagination";
import AccommodationCard from "@/components/pageComponents/Admin/Accommodation/AccommodationCard";
import { useGetAccommodationsQuery } from "@/hooks/admin/accommodation.hook";
import { useAccommodationSearchParams } from "@/hooks/admin/accommodation.search";

const AccommodationTable = () => {
    const { search, type, status, page, limit, updatePage } = useAccommodationSearchParams();

    const { data, isLoading } = useGetAccommodationsQuery({ 
        search, 
        type, 
        availability: status,
        page,
        limit,
    });

    const accommodations = data?.data ?? [];
    const meta = data?.meta;

    return (
        <div className="flex flex-col gap-5">
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

            {meta && (
                <DataPagination 
                meta={meta}
                page={page}
                onPageChange={updatePage}
                />
            )}
        </div>
    )
}

export default AccommodationTable