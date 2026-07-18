import { useTourTargets } from "./useTourTargets";

export const kitchenSettingsTourTargetIds = [
  "kitchen.settings-replay-guide",
] as const;

export function useKitchenRoleTourTargets() {
  const { targetProps } = useTourTargets();

  return {
    dashboardHeaderTargetProps: targetProps("kitchen.dashboard-header"),
    preOrderSearchTargetProps: targetProps("kitchen.pre-order-search"),
    dateFilterTargetProps: targetProps("kitchen.date-filter"),
    settingsReplayGuideTargetProps: targetProps(
      "kitchen.settings-replay-guide",
    ),
  };
}
