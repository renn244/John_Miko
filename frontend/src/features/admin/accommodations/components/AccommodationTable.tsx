import DataPagination from "@/components/common/DataPagination";
import AccommodationCard from "@/features/admin/accommodations/components/AccommodationCard";
import { useGetAccommodationsQuery } from "@/features/shared/accommodations/hooks/useAccommodationQueries";
import { useGetRetiredAccommodationsQuery } from "@/features/admin/accommodations/hooks/useAccommodationAdmin";
import { useAccommodationSearchParams } from "@/features/admin/accommodations/hooks/useAccommodationSearch";

const AccommodationTable = ({ retired = false }: { retired?: boolean }) => {
    const { search, type, page, limit, updatePage } = useAccommodationSearchParams();

    const query = {
        search, 
        type, 
        page,
        limit,
    };
    const activeResult = useGetAccommodationsQuery(query, !retired);
    const retiredResult = useGetRetiredAccommodationsQuery(query, retired);
    const { data, isLoading } = retired ? retiredResult : activeResult;

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
                        capacity={acc.capacity}
                        price={acc.price}
                        amenities={acc.amenities}
                        retiredAt={acc.retiredAt}
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
