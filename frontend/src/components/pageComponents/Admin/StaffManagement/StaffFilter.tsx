import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStaffManagementSearch } from "@/hooks/admin/staff-management.search";
import useDebounce from "@/lib/useDebounce";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

const StaffFilter = () => {
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border-2">
            <div className="flex flex-col md:flex-row gap-4">
                <SearchStaffFilter />
                <SelectStaffRole />
                <SelectStaffStatus />
            </div>
        </div>
    )
}

const SearchStaffFilter = () => {
    const { search, updateSearch } = useStaffManagementSearch();
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
            placeholder="Search by staff name or ID..."
            />
        </div>
    )
}

const SelectStaffRole = () => {
    const { role, updateRole } = useStaffManagementSearch();

    return (
        <Select
        value={role || ""}
        onValueChange={(value) => updateRole(value)}
        >
            <SelectTrigger>
                <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Role</SelectLabel>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="KITCHEN_STAFF">Kitchen Staff</SelectItem>
                    <SelectItem value="RESORT_STAFF">Resort Staff</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

const SelectStaffStatus = () => {
    const { status, updateStatus } = useStaffManagementSearch();

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

export default StaffFilter
