import AdminPageHeader from "@/features/admin/layout/components/AdminPageHeader";
import AccommodationFilter from "@/features/admin/accommodations/components/AccommodationFilter";
import AccommodationStatistics from "@/features/admin/accommodations/components/AccommodationStatistics";
import AccommodationTable from "@/features/admin/accommodations/components/AccommodationTable";
import { Button } from "@/components/ui/button";
import { ArchiveRestore, Plus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

const Accommodation = () => {
  const [showRetired, setShowRetired] = useState(false);
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Accommodation Management"
        description="Manage rooms, cottages, and event halls"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowRetired((current) => !current)}>
              <ArchiveRestore className="size-4" />
              {showRetired ? "Active accommodations" : "Retired accommodations"}
            </Button>
            <Button asChild><Link to="/admin/accommodation/add">Add Accommodation<Plus className="size-4" /></Link></Button>
          </div>
        }
      />

      {!showRetired && <AccommodationStatistics />}

      <AccommodationFilter />

      <AccommodationTable retired={showRetired} />
    </div>
  );
};

export default Accommodation;
