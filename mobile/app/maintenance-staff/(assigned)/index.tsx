import AssignedMaintenanceListScreen from "@/components/pageComponents/MaintenanceStaff/AssignedMaintenanceListScreen/AssignedMaintenanceListScreen";
import { useRoleTourAutoStart } from "@/hooks/roleTours/useRoleTourAutoStart";

export default function MaintenanceStaffActiveScreen() {
  useRoleTourAutoStart("MAINTENANCE_STAFF");

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
