import {
  AdminClearFiltersButton,
  AdminFilterLayout,
} from "@/features/admin/layout/components/AdminFilterLayout";
import { Input } from "@/components/ui/input";
import { useAddOnServiceSearch } from "@/features/admin/add-on-services/hooks/useAddOnServiceSearch";
import useDebounce from "@/lib/useDebounce";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

const AddOnServiceFilter = () => {
  const { search, clearFilters } = useAddOnServiceSearch();

  return (
    <AdminFilterLayout search={<SearchAddOnServiceFilter />}>
      <AdminClearFiltersButton onClick={clearFilters} disabled={!search} />
    </AdminFilterLayout>
  );
};

const SearchAddOnServiceFilter = () => {
  const { search, updateSearch } = useAddOnServiceSearch();
  const [searchInput, setSearchInput] = useState(search || "");
  const debounceValue = useDebounce(searchInput, 500);

  useEffect(() => {
    if (debounceValue !== search) {
      updateSearch(debounceValue);
    }
  }, [debounceValue]);

  return (
    <div className="flex-1 relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="pl-9"
        placeholder="Search by service name..."
      />
    </div>
  );
};

export default AddOnServiceFilter;
