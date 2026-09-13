import MaintenanceKanbanBoard from "@/features/admin/maintenance/components/MaintenanceKanbanBoard";
import MaintenanceSearchDialog from "@/features/admin/maintenance/components/MaintenanceSearchDialog";
import MarkCompleteDialog from "@/features/admin/maintenance/components/MarkCompleteDialog";
import StaffReportsTab from "@/features/admin/staff-reports/components/StaffReportsTab";
import AdminPageHeader from "@/features/admin/layout/components/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { updateSearchParams } from "@/lib/updateSearchParams";
import { useMaintenanceStore } from "@/features/admin/maintenance/store/maintenanceAdmin.store";
import { Plus, Search } from "lucide-react";
import { Link, useSearchParams } from "react-router";

const Maintenance = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "board";
  const setIsSearchOpen = useMaintenanceStore((state) => state.setIsSearchOpen);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6">
      <Tabs
        value={activeTab}
        onValueChange={(value) =>
          updateSearchParams(setSearchParams, {
            tab: value === "board" ? undefined : value,
          })
        }
        className="flex min-h-0 flex-1 flex-col gap-6"
      >
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-4">
            <AdminPageHeader
              title="Maintenance"
              description="Manage resort maintenance tickets, view statistics, and filter by status or priority."
            />

            <TabsList>
              <TabsTrigger value="board">Board</TabsTrigger>
              <TabsTrigger value="staff-reports">Staff Reports</TabsTrigger>
            </TabsList>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="outline" onClick={() => setIsSearchOpen(true)}>
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

        <TabsContent
          value="staff-reports"
          className="flex min-h-0 flex-1 flex-col"
        >
          <StaffReportsTab />
        </TabsContent>
      </Tabs>

      <MaintenanceSearchDialog />
      <MarkCompleteDialog />
    </div>
  );
};

export default Maintenance;
