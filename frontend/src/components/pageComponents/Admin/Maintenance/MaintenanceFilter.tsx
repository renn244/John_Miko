import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMaintenanceSearch } from "@/hooks/admin/maintenance.search";
import useDebounce from "@/lib/useDebounce";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

const MaintenanceFilter = () => {
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border-2">
            <div className="flex flex-col md:flex-row gap-4">

                <SearchMaintenanceFilter />
            
                <SelectMaintenanceStatus />

                <SelectMaintenancePriority />

            </div>
        </div>
    )
}

const SearchMaintenanceFilter = () => {
    const { search, updateSearch } = useMaintenanceSearch();
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
            placeholder="Search by maintenance ticket name or ID..."
            />
        </div>
    )
}

const SelectMaintenanceStatus = () => {
    const { status, updateStatus } = useMaintenanceSearch();

    return (
        <Select value={status} onValueChange={(value) => updateStatus(value)}>
            <SelectTrigger>
                <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Status Type</SelectLabel>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="InProgress">InProgress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

const SelectMaintenancePriority = () => {
    const { priority, updatePriority } = useMaintenanceSearch();

    return (
        <Select value={priority} onValueChange={(value) => updatePriority(value)}>
            <SelectTrigger>
                <SelectValue placeholder="Priority Type" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Priority Type</SelectLabel>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

export default MaintenanceFilter