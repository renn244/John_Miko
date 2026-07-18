import StaffSettingsScreen from "@/components/settings/StaffSettingsScreen";
import {
  kitchenSettingsTourTargetIds,
  useKitchenRoleTourTargets,
} from "@/hooks/roleTours/useKitchenRoleTourTargets";
import { useTourScrollContainer } from "@/hooks/roleTours/useTourScrollContainer";

export default function KitchenStaffSettingsRoute() {
  const { settingsReplayGuideTargetProps } = useKitchenRoleTourTargets();
  const { scrollViewProps } = useTourScrollContainer(
    kitchenSettingsTourTargetIds,
  );

  return (
    <StaffSettingsScreen
      key="kitchen-staff"
      replayGuideTargetProps={settingsReplayGuideTargetProps}
      tourScrollViewProps={scrollViewProps}
    />
  );
}
