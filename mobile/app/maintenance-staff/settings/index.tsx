import StaffSettingsScreen from "@/components/settings/StaffSettingsScreen";
import {
  maintenanceSettingsTourTargetIds,
  useMaintenanceRoleTourTargets,
} from "@/hooks/roleTours/useMaintenanceRoleTourTargets";
import { useTourScrollContainer } from "@/hooks/roleTours/useTourScrollContainer";

export default function MaintenanceStaffSettingsScreen() {
  const { settingsReplayGuideTargetProps } = useMaintenanceRoleTourTargets();
  const { scrollViewProps } = useTourScrollContainer(
    maintenanceSettingsTourTargetIds,
  );

  return (
    <StaffSettingsScreen
      key="maintenance-staff"
      replayGuideTargetProps={settingsReplayGuideTargetProps}
      tourScrollViewProps={scrollViewProps}
    />
  );
}
