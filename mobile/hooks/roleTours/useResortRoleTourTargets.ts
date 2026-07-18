import { useTourTargets } from "./useTourTargets";

export const resortNewReportTourTargetIds = [
  "resort.new-report-header",
  "resort.report-details",
  "resort.report-severity",
  "resort.report-proof-photos",
] as const;

export const resortSettingsTourTargetIds = ["resort.settings-replay-guide"] as const;

export function useResortRoleTourTargets() {
  const { targetProps } = useTourTargets();

  return {
    dashboardHeaderTargetProps: targetProps("resort.dashboard-header"),
    bookingSearchTargetProps: targetProps("resort.booking-search"),
    newReportHeaderTargetProps: targetProps("resort.new-report-header"),
    reportDetailsTargetProps: targetProps("resort.report-details"),
    reportSeverityTargetProps: targetProps("resort.report-severity"),
    reportProofPhotosTargetProps: targetProps("resort.report-proof-photos"),
    reportsHeaderTargetProps: targetProps("resort.reports-header"),
    reportsFilterTargetProps: targetProps("resort.reports-filter"),
    settingsReplayGuideTargetProps: targetProps("resort.settings-replay-guide"),
  };
}
