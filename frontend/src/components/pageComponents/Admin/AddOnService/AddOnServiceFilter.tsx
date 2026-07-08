import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAddOnServiceSearch } from "@/hooks/admin/add-on-service.search";
import useDebounce from "@/lib/useDebounce";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

const AddOnServiceFilter = () => {
    const { search, clearFilters } = useAddOnServiceSearch();

    return (
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="w-full xl:max-w-md">
                <SearchAddOnServiceFilter />
            </div>

            <div className="flex items-center justify-end">
                <Button
                type="button"
                variant="ghost"
                onClick={clearFilters}
                disabled={!search}
                className="h-auto px-0 text-sm font-medium text-primary hover:bg-transparent hover:text-primary/80 disabled:pointer-events-none disabled:opacity-40"
                >
                    <X className="h-4 w-4" />
                    Clear Filters
                </Button>
            </div>
        </div>
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
