import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAccommodationSearchParams } from "@/hooks/admin/accommodation.search";
import useDebounce from "@/lib/useDebounce";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

const AccommodationFilter = () => {
    const { type, updateType, clearFilters } = useAccommodationSearchParams();

    return (
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                <SearchAccommodationFilter />

                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center xl:ml-4 xl:flex-nowrap xl:justify-end xl:gap-2 xl:self-start">
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

                    <Button
                    onClick={clearFilters}
                    variant="ghost"
                    className="justify-start whitespace-nowrap px-0 text-primary hover:text-primary sm:px-3"
                    >
                        <X className="size-4" />
                        Clear Filters
                    </Button>
                </div>
        </div>
    )
}

const SearchAccommodationFilter = () => {
    const { search, updateSearch } = useAccommodationSearchParams();
    const [searchInput, setSearchInput] = useState(search || "");
    const debouncedSearch = useDebounce(searchInput, 500);

    useEffect(() => {
        updateSearch(debouncedSearch);
    }, [debouncedSearch])

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
    )
}
 
export default AccommodationFilter
