import ReportsList from "@/components/pageComponents/Resort Staff/ReportsList/ReportsList";
import ReportsListFilter from "@/components/pageComponents/Resort Staff/ReportsList/ReportsListFilter";
import ReportListFilterSheet from "@/components/pageComponents/Resort Staff/ReportsList/ReportsListFilterSheet";
import CustomSafeAreaView from "@/components/ui/CustomSafeAreaView";
import { useState } from "react";

export default function MyStaffReportsScreen() {
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <CustomSafeAreaView className="flex-1 bg-neutral-soft-grey-3">
      <ReportsListFilter 
        setFilterOpen={setFilterOpen}
      />

      <ReportsList />

      <ReportListFilterSheet
        visible={filterOpen}
        onClose={() => setFilterOpen(false)}
      />
    </CustomSafeAreaView>
  );
}
