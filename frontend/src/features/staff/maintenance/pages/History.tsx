import AssignedMaintenanceList from "@/features/staff/maintenance/components/AssignedMaintenanceList";

const History = () => (
  <AssignedMaintenanceList
    scope="history"
    title="Maintenance History"
    description="View completed and closed maintenance work."
    emptyTitle="No maintenance history yet"
    emptyDescription="Completed tickets will appear here for documentation."
  />
);

export default History;
