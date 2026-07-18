import StaffSettingsScreen from "@/components/settings/StaffSettingsScreen";
import {
  resortSettingsTourTargetIds,
  useResortRoleTourTargets,
} from "@/hooks/roleTours/useResortRoleTourTargets";
import { useTourScrollContainer } from "@/hooks/roleTours/useTourScrollContainer";

export default function ResortStaffSettingsRoute() {
    const { settingsReplayGuideTargetProps } = useResortRoleTourTargets();
    const { scrollViewProps } = useTourScrollContainer(resortSettingsTourTargetIds);

    return (
      <StaffSettingsScreen
        key="resort-staff"
        replayGuideTargetProps={settingsReplayGuideTargetProps}
        tourScrollViewProps={scrollViewProps}
      />
    );
}
