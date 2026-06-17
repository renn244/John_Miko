import AssignedMaintenanceListScreen from "@/components/pageComponents/MaintenanceStaff/AssignedMaintenanceListScreen";

export default function MaintenanceStaffHistoryScreen() {
  return (
    <AssignedMaintenanceListScreen
      scope="history"
      title="Maintenance History"
      description="Review your completed and closed maintenance work."
      emptyTitle="No maintenance history yet"
      emptyDescription="Completed tickets will appear here for documentation."
    />
  );
}
