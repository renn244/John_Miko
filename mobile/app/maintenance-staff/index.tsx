import AssignedMaintenanceListScreen from "@/components/pageComponents/MaintenanceStaff/AssignedMaintenanceListScreen";

export default function MaintenanceStaffActiveScreen() {
  return (
    <AssignedMaintenanceListScreen
      scope="active"
      title="Assigned Maintenance"
      description="Track the maintenance work currently assigned to you."
      emptyTitle="No active maintenance"
      emptyDescription="Pull to refresh after new assignments come in."
    />
  );
}
