import AssignedMaintenanceListScreen from "@/components/pageComponents/MaintenanceStaff/AssignedMaintenanceListScreen/AssignedMaintenanceListScreen";

export default function MaintenanceStaffActiveScreen() {
  return (
    <AssignedMaintenanceListScreen
      scope="active"
      title="Maintenance"
      description="maintenance work currently assigned to you."
      emptyTitle="No active maintenance"
      emptyDescription="Pull to refresh after new assignments come in."
    />
  );
}
