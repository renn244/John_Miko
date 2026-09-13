import {
  AdminClearFiltersButton,
  AdminFilterLayout,
} from "@/features/admin/layout/components/AdminFilterLayout";
import { Input } from "@/components/ui/input";
import { useFeedbackSearch } from "@/features/admin/feedback/hooks/useFeedbackSearch";
import useDebounce from "@/lib/useDebounce";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

const FeedbackFilter = () => {
  const { search, clearFilters } = useFeedbackSearch();
  const hasActiveFilters = Boolean(search);

  return (
    <AdminFilterLayout search={<FeedbackSearchFilter />}>
      <AdminClearFiltersButton
        onClick={clearFilters}
        disabled={!hasActiveFilters}
      />
    </AdminFilterLayout>
  );
};

const FeedbackSearchFilter = () => {
  const { search, updateSearch } = useFeedbackSearch();
  const [searchInput, setSearchInput] = useState(search || "");
  const debounceValue = useDebounce(searchInput, 500);

  useEffect(() => {
    if (debounceValue !== search) {
      updateSearch(debounceValue);
    }
  }, [debounceValue]);

  return (
    <div className="relative flex-1 md:max-w-md">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={searchInput}
        onChange={(event) => setSearchInput(event.target.value)}
        className="pl-9"
        placeholder="Search by guest, comment, or feedback ID..."
      />
    </div>
  );
};

export default FeedbackFilter;
