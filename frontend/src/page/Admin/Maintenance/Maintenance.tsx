import MaintenanceFilter from "@/components/pageComponents/Admin/Maintenance/MaintenanceFilter"
import MaintenanceKanbanBoard from "@/components/pageComponents/Admin/Maintenance/MaintenanceKanbanBoard"
import MaintenanceStatistics from "@/components/pageComponents/Admin/Maintenance/MaintenanceStatistics"
import MaintenanceTable from "@/components/pageComponents/Admin/Maintenance/MaintenanceTable"
import MarkCompleteDialog from "@/components/pageComponents/Admin/Maintenance/MarkCompleteDialog"
import ViewMaintenanceDialog from "@/components/pageComponents/Admin/Maintenance/ViewMaintenanceDialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import { Link } from "react-router"

const Maintenance = () => {
  return (
    <div className="space-y-6">
    
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

      <Tabs defaultValue="table">
        <TabsList>
          <TabsTrigger value="table">Table</TabsTrigger>
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="space-y-6">
          <div className="flex items-center justify-end">
            <Link to="/admin/maintenance/add">
              <Button>
                Add Maintenance Ticket
                <Plus className="w-5 h-5 text-white" />
              </Button>
            </Link>
          </div>

          <MaintenanceStatistics />
          <MaintenanceFilter />
          <MaintenanceTable />
        </TabsContent>

        <TabsContent value="kanban" className="space-y-4">
          <div className="flex items-center justify-end">
            <Link to="/admin/maintenance/add">
              <Button>
                Add Maintenance Ticket
                <Plus className="w-5 h-5 text-white" />
              </Button>
            </Link>
          </div>

          <MaintenanceKanbanBoard />
        </TabsContent>
      </Tabs>

      <ViewMaintenanceDialog />
      <MarkCompleteDialog />
    </div>
  )
}

export default Maintenance