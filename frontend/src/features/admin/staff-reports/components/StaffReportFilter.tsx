import {
  AdminClearFiltersButton,
  AdminFilterLayout,
} from "@/features/admin/layout/components/AdminFilterLayout";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStaffReportSearch } from "@/features/admin/staff-reports/hooks/useStaffReportSearch";
import useDebounce from "@/lib/useDebounce";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

const StaffReportFilter = () => {
  const { search, status, type, severity, clearFilters } =
    useStaffReportSearch();
  const hasActiveFilters = Boolean(search || status || type || severity);

  return (
    <AdminFilterLayout search={<SearchStaffReportsFilter />}>
      <SelectStaffReportStatus />
      <SelectStaffReportType />
      <SelectStaffReportSeverity />
      <AdminClearFiltersButton
        onClick={clearFilters}
        disabled={!hasActiveFilters}
      />
    </AdminFilterLayout>
  );
};

const SearchStaffReportsFilter = () => {
  const { search, updateSearch } = useStaffReportSearch();
  const [searchInput, setSearchInput] = useState(search || "");
  const debounceValue = useDebounce(searchInput, 500);

  useEffect(() => {
    if (debounceValue !== search) {
      updateSearch(debounceValue);
    }
  }, [debounceValue]);

  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={searchInput}
        onChange={(event) => setSearchInput(event.target.value)}
        className="pl-9"
        placeholder="Search by title, reporter, report ID, or booking reference..."
      />
    </div>
  );
};

const SelectStaffReportStatus = () => {
  const { status, updateStatus } = useStaffReportSearch();

  return (
    <Select value={status ?? "all"} onValueChange={updateStatus}>
      <SelectTrigger className="w-full sm:w-40">
        <SelectValue placeholder="All Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Status</SelectLabel>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="Pending">Pending</SelectItem>
          <SelectItem value="Approved">Approved</SelectItem>
          <SelectItem value="Rejected">Rejected</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

const SelectStaffReportType = () => {
  const { type, updateType } = useStaffReportSearch();

  return (
    <Select value={type ?? "all"} onValueChange={updateType}>
      <SelectTrigger className="w-full sm:w-40">
        <SelectValue placeholder="All Types" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Type</SelectLabel>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="maintenance">Maintenance</SelectItem>
          <SelectItem value="checkIn">Check-In</SelectItem>
          <SelectItem value="checkOut">Check-Out</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

const SelectStaffReportSeverity = () => {
  const { severity, updateSeverity } = useStaffReportSearch();

  return (
    <Select value={severity ?? "all"} onValueChange={updateSeverity}>
      <SelectTrigger className="w-full sm:w-40">
        <SelectValue placeholder="All Severity" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Severity</SelectLabel>
          <SelectItem value="all">All Severity</SelectItem>
          <SelectItem value="Low">Low</SelectItem>
          <SelectItem value="Medium">Medium</SelectItem>
          <SelectItem value="High">High</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default StaffReportFilter;
