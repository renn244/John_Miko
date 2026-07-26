import AdminPageHeader from "@/components/pageComponents/Admin/AdminPageHeader";
import AccommodationFilter from "@/components/pageComponents/Admin/Accommodation/AccommodationFilter";
import AccommodationStatistics from "@/components/pageComponents/Admin/Accommodation/AccommodationStatistics";
import AccommodationTable from "@/components/pageComponents/Admin/Accommodation/AccommodationTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router";

const Accommodation = () => {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Accommodation Management"
        description="Manage rooms, cottages, and event halls"
        actions={
          <Button asChild>
            <Link to="/admin/accommodation/add">
              Add Accommodation
              <Plus className="size-4" />
            </Link>
          </Button>
        }
      />

      <AccommodationStatistics />

      <AccommodationFilter />

      <AccommodationTable />
    </div>
  );
};

export default Accommodation;
