import MaintenanceKanbanBoard from "@/components/pageComponents/Admin/Maintenance/MaintenanceKanbanBoard";
import MaintenanceSearchDialog from "@/components/pageComponents/Admin/Maintenance/MaintenanceSearchDialog";
import MaintenanceStatistics from "@/components/pageComponents/Admin/Maintenance/MaintenanceStatistics";
import MarkCompleteDialog from "@/components/pageComponents/Admin/Maintenance/MarkCompleteDialog";
import StaffReportsTab from "@/components/pageComponents/Admin/Maintenance/StaffReportsTab";
import ViewMaintenanceDialog from "@/components/pageComponents/Admin/Maintenance/ViewMaintenanceDialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { updateSearchParams } from "@/lib/updateSearchParams";
import { useMaintenanceStore } from "@/store/admin/maintenance.store";
import { Plus, Search } from "lucide-react";
import { Link, useSearchParams } from "react-router";

const Maintenance = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "board";
  const setIsSearchOpen = useMaintenanceStore((state) => state.setIsSearchOpen);

  return (
    <div className="space-y-6">
      <Tabs
        value={activeTab}
        onValueChange={(value) =>
          updateSearchParams(setSearchParams, {
            tab: value === "board" ? undefined : value,
          })
        }
        className="space-y-6"
      >
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">
                    Maintenance
                  </h1>
                  <p className="text-sm mt-1 text-muted-foreground">
                    Manage resort maintenance tickets, view statistics, and filter by status or priority.
                  </p>
                </div>
            </div>


            <TabsList>
              <TabsTrigger value="board">Board</TabsTrigger>
              <TabsTrigger value="staff-reports">Staff Reports</TabsTrigger>
            </TabsList>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              variant="outline"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="size-4" />
              Find Ticket
            </Button>

            <Button asChild>
              <Link to="/admin/maintenance/add">
                <Plus className="size-4" />
                New Ticket
              </Link>
            </Button>
          </div>
        </div>

        <TabsContent value="board" className="space-y-6">
          <MaintenanceKanbanBoard />
        </TabsContent>

        <TabsContent value="staff-reports" className="space-y-6">
          <StaffReportsTab />
        </TabsContent>
      </Tabs>

      <MaintenanceSearchDialog />
      <ViewMaintenanceDialog />
      <MarkCompleteDialog />
    </div>
  );
};

export default Maintenance;
