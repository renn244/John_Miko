import AccommodationFilter from "@/components/pageComponents/Admin/Accommodation/AccommodationFilter"
import AccommodationStatistics from "@/components/pageComponents/Admin/Accommodation/AccommodationStatistics"
import AccommodationTable from "@/components/pageComponents/Admin/Accommodation/AccommodationTable"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Link } from "react-router"

const Accommodation = () => {

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
        <Button asChild>
          <Link to="/admin/accommodation/add">
            Add Accommodation
            <Plus className="w-5 h-5 text-white" />
          </Link>
        </Button>
      </div>

      <AccommodationStatistics />

      <AccommodationFilter />

      <AccommodationTable />
    </div>
  )
}

export default Accommodation
