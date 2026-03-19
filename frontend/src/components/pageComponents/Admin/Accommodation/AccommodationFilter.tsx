import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAccommodationSearchParams } from "@/hooks/admin/accommodation.search";
import useDebounce from "@/lib/useDebounce";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

const AccommodationFilter = () => {
    const { type, status, updateType, updateStatus } = useAccommodationSearchParams();

    return (
        <div className="bg-white p-4 rounded-xl border-2">
            <div className="flex flex-col md:flex-row gap-4">
            
                <SearchAccommodationFilter />

                <Select value={type || "all"} onValueChange={updateType}>
                    <SelectTrigger>
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

                <Select value={status || "all"} onValueChange={updateStatus}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Status</SelectLabel>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="Available">Available</SelectItem>
                            <SelectItem value="Unavailable">Unavailable</SelectItem>
                            <SelectItem value="Maintenance">Maintenance</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>

            </div>
        </div>
    )
}

const SearchAccommodationFilter = () => {
    const { search, updateSearch } = useAccommodationSearchParams();
    const [searchInput, setSearchInput] = useState(search || "");
    const debouncedSearch = useDebounce(searchInput, 250);

    useEffect(() => {
        if(debouncedSearch !== search) {
            updateSearch(debouncedSearch);
        }
    }, [debouncedSearch, search, updateSearch])

    return (
        <div className="flex-1 relative">
            <Search className="absolute left-5 top-1/2 -translate-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-4"
            placeholder="Search Accommodations..."
            />
        </div>
    )
}
 
export default AccommodationFilter