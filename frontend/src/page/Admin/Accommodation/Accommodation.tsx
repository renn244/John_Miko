import AccommodationCard from "@/components/pageComponents/Admin/Accommodation/AccommodationCard"
import AccommodationFilter from "@/components/pageComponents/Admin/Accommodation/AccommodationFilter"
import { Button } from "@/components/ui/button"
import StatisticCards from "@/components/ui/StatisticCards"
import { useGetAccommodationsQuery, useGetAccommodationStatsQuery } from "@/hooks/admin/accommodation.hook"
import { useAccommodationSearchParams } from "@/hooks/admin/accommodation.search"
import { CheckCircle, Home, Info, Plus, XCircle } from "lucide-react"
import { Link } from "react-router"

const Accommodation = () => {
  const { search, type, status } = useAccommodationSearchParams();

  const { data: stats, isLoading: statLoading } = useGetAccommodationStatsQuery();
  const { data: accommodations, isLoading } = useGetAccommodationsQuery({ search, type, availability: status });

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Accommodation Management
          </h1>
          <p className="text-sm mt-1 text-muted-foreground">
            Manage rooms, cottages, and event halls
          </p>
        </div>
        <Link to="/admin/accommodation/add">
          <Button>
            Add Accommodation
            <Plus className="w-5 h-5 text-white" />
          </Button>
        </Link>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <StatisticCards 
        title="Total"
        stat={stats?.total || 0}
        Icon={<Home className="w-5 h-5 text-blue-600" />}
        isLoading={statLoading}
        />
        
        <StatisticCards 
        title="Available"
        stat={stats?.available || 0}
        Icon={<CheckCircle className="w-5 h-5 text-green-600" />}
        isLoading={statLoading}
        />
        
        <StatisticCards 
        title="Unavailable"
        stat={stats?.unavailable || 0}
        Icon={<XCircle className="w-5 h-5 text-red-600" />}
        isLoading={statLoading}
        />

        <StatisticCards 
        title="Maintenance"
        stat={stats?.maintenance || 0}
        Icon={<Info className="w-5 h-5 text-yellow-600" />}
        isLoading={statLoading}
        />
      
      </div>

      {/* Filter Section */}
      <AccommodationFilter />

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
    </div>
  )
}

export default Accommodation