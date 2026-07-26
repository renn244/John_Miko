import {
  AdminClearFiltersButton,
  AdminFilterLayout,
} from "@/components/pageComponents/Admin/AdminFilterLayout";
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
import { useAccommodationSearchParams } from "@/hooks/admin/accommodation.search";
import useDebounce from "@/lib/useDebounce";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

const AccommodationFilter = () => {
  const { type, updateType, clearFilters } = useAccommodationSearchParams();

  return (
    <AdminFilterLayout search={<SearchAccommodationFilter />}>
      <div className="w-full sm:w-auto">
        <Select value={type || "all"} onValueChange={updateType}>
          <SelectTrigger className="w-full sm:w-auto">
            <SelectValue placeholder="Select Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Types</SelectLabel>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Room">Room</SelectItem>
              <SelectItem value="Cottage">Cottage</SelectItem>
              <SelectItem value="EventHall">Event Hall</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <AdminClearFiltersButton onClick={clearFilters} />
    </AdminFilterLayout>
  );
};

const SearchAccommodationFilter = () => {
  const { search, updateSearch } = useAccommodationSearchParams();
  const [searchInput, setSearchInput] = useState(search || "");
  const debouncedSearch = useDebounce(searchInput, 500);

  useEffect(() => {
    updateSearch(debouncedSearch);
  }, [debouncedSearch]);

  return (
    <div className="relative w-full xl:max-w-xl xl:flex-1">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="pl-9"
        placeholder="Search Accommodations..."
      />
    </div>
  );
};

export default AccommodationFilter;
