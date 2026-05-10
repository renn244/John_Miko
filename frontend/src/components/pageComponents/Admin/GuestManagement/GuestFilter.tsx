import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGuestManagementSearch } from "@/hooks/admin/guest-management/guest-management.search";
import useDebounce from "@/lib/useDebounce";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

const GuestFilter = () => {
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border-2">
            <div className="flex flex-col md:flex-row gap-4">
                <SearchGuestFilter />
                <SelectGuestStatus />
            </div>
        </div>
    )
}

const SearchGuestFilter = () => {
    const { search, updateSearch } = useGuestManagementSearch();
    const [searchInput, setSearchInput] = useState(search || "");
    const debounceValue = useDebounce(searchInput, 500);

    useEffect(() => {
        if(debounceValue !== search) {
            updateSearch(debounceValue);
        }
    }, [debounceValue])

    return (
        <div className="flex-1 relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-8"
            placeholder="Search by guest name, email, or ID..."
            />
        </div>
    )
}

const SelectGuestStatus = () => {
    const { status, updateStatus } = useGuestManagementSearch();

    return (
        <Select
        value={status || ""}
        onValueChange={(value) => updateStatus(value)}
        >
            <SelectTrigger>
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
    )
}

export default GuestFilter
