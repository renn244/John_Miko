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
import { useGuestManagementSearch } from "@/features/admin/guest-management/hooks/useGuestManagementSearch";
import useDebounce from "@/lib/useDebounce";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

const GuestFilter = () => {
  const { search, status, clearFilters } = useGuestManagementSearch();
  const hasFilters = Boolean(search || status);

  return (
    <AdminFilterLayout search={<SearchGuestFilter />}>
      <SelectGuestStatus />
      <AdminClearFiltersButton onClick={clearFilters} disabled={!hasFilters} />
    </AdminFilterLayout>
  );
};

const SearchGuestFilter = () => {
  const { search, updateSearch } = useGuestManagementSearch();
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
        placeholder="Search by guest name, email, or ID..."
      />
    </div>
  );
};

const SelectGuestStatus = () => {
  const { status, updateStatus } = useGuestManagementSearch();

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

export default GuestFilter;
