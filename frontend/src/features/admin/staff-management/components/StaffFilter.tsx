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
import { useStaffManagementSearch } from "@/features/admin/staff-management/hooks/useStaffManagementSearch";
import useDebounce from "@/lib/useDebounce";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

const StaffFilter = () => {
  const { search, role, status, clearFilters } = useStaffManagementSearch();
  const hasFilters = Boolean(search || role || status);

  return (
    <AdminFilterLayout search={<SearchStaffFilter />}>
      <SelectStaffRole />
      <SelectStaffStatus />
      <AdminClearFiltersButton onClick={clearFilters} disabled={!hasFilters} />
    </AdminFilterLayout>
  );
};

const SearchStaffFilter = () => {
  const { search, updateSearch } = useStaffManagementSearch();
  const [searchInput, setSearchInput] = useState(search || "");
  const debounceValue = useDebounce(searchInput, 500);

  useEffect(() => {
    if (debounceValue !== search) {
      updateSearch(debounceValue);
    }
  }, [debounceValue]);

  return (
    <div className="relative w-full xl:max-w-xl xl:flex-1">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="pl-9"
        placeholder="Search by staff name or ID..."
      />
    </div>
  );
};

const SelectStaffRole = () => {
  const { role, updateRole } = useStaffManagementSearch();

  return (
    <Select value={role || "all"} onValueChange={(value) => updateRole(value)}>
      <SelectTrigger className="w-full sm:w-auto">
        <SelectValue placeholder="Role" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Role</SelectLabel>
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value="KITCHEN_STAFF">Kitchen Staff</SelectItem>
          <SelectItem value="RESORT_STAFF">Resort Staff</SelectItem>
          <SelectItem value="MAINTENANCE_STAFF">Maintenance Staff</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

const SelectStaffStatus = () => {
  const { status, updateStatus } = useStaffManagementSearch();

  return (
    <Select
      value={status || "all"}
      onValueChange={(value) => updateStatus(value)}
    >
      <SelectTrigger className="w-full sm:w-auto">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Status</SelectLabel>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="ACTIVE">Active</SelectItem>
          <SelectItem value="INACTIVE">Inactive</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default StaffFilter;
