import type {
  ReportSeverity,
  ReportStatus,
  ReportType,
} from "@/types/staffReport.type";
import { create } from "zustand";

type StaffReportsFilterState = {
  status?: ReportStatus;
  type?: ReportType;
  severity?: ReportSeverity;
  setFilters: (filters: Pick<StaffReportsFilterState, "status" | "type" | "severity">) => void;
  setStatus: (status?: ReportStatus) => void;
  setType: (type?: ReportType) => void;
  setSeverity: (severity?: ReportSeverity) => void;
  reset: () => void;
};

export const useStaffReportsFilterStore = create<StaffReportsFilterState>((set) => ({
  status: undefined,
  type: undefined,
  severity: undefined,
  setFilters: (filters) =>
    set({
      status: filters.status,
      type: filters.type,
      severity: filters.severity,
    }),
  setStatus: (status) => set({ status }),
  setType: (type) => set({ type }),
  setSeverity: (severity) => set({ severity }),
  reset: () => set({ status: undefined, type: undefined, severity: undefined }),
}));
