import { useTourTargets } from "./useTourTargets";

export const maintenanceSettingsTourTargetIds = [
  "maintenance.settings-replay-guide",
] as const;

export function useMaintenanceRoleTourTargets() {
  const { targetProps } = useTourTargets();

  return {
    dashboardHeaderTargetProps: targetProps("maintenance.dashboard-header"),
    ticketSearchTargetProps: targetProps("maintenance.ticket-search"),
    historyHeaderTargetProps: targetProps("maintenance.history-header"),
    historyTicketSearchTargetProps: targetProps(
      "maintenance.history-ticket-search",
    ),
    settingsReplayGuideTargetProps: targetProps(
      "maintenance.settings-replay-guide",
    ),
  };
}
