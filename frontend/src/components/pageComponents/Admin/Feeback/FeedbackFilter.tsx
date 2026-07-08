import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFeedbackSearch } from "@/hooks/admin/feedback.search";
import useDebounce from "@/lib/useDebounce";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

const FeedbackFilter = () => {
    const { search, clearFilters } = useFeedbackSearch();
    const hasActiveFilters = Boolean(search);

    return (
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <FeedbackSearchFilter />
            <Button
            type="button"
            variant="ghost"
            onClick={clearFilters}
            disabled={!hasActiveFilters}
            className="h-auto justify-start px-0 text-sm text-primary hover:bg-transparent hover:text-primary/80 disabled:pointer-events-none disabled:text-muted-foreground md:justify-end"
            >
                Clear Filters
            </Button>
        </div>
    )
}

const FeedbackSearchFilter = () => {
    const { search, updateSearch } = useFeedbackSearch();
    const [searchInput, setSearchInput] = useState(search || "");
    const debounceValue = useDebounce(searchInput, 500);

    useEffect(() => {
        if(debounceValue !== search) {
            updateSearch(debounceValue);
        }    
    }, [debounceValue])

    return (
        <div className="relative flex-1 md:max-w-md">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
            placeholder="Search by guest, comment, or feedback ID..."
            />
        </div>
    )
}
export default FeedbackFilter
