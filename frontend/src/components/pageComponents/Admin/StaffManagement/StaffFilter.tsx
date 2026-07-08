import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStaffManagementSearch } from "@/hooks/admin/staff-management.search";
import useDebounce from "@/lib/useDebounce";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

const StaffFilter = () => {
    const { search, role, status, clearFilters } = useStaffManagementSearch();
    const hasFilters = Boolean(search || role || status);

    return (
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="w-full xl:max-w-xl xl:flex-1">
                <SearchStaffFilter />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center xl:ml-4 xl:flex-nowrap xl:justify-end xl:gap-2 xl:self-start">
                <SelectStaffRole />
                <SelectStaffStatus />

                <Button
                type="button"
                variant="ghost"
                onClick={clearFilters}
                disabled={!hasFilters}
                className="justify-start whitespace-nowrap px-0 text-primary hover:bg-transparent hover:text-primary disabled:pointer-events-none disabled:opacity-40"
                >
                    <X className="size-4" />
                    Clear Filters
                </Button>
            </div>
        </div>
    );
};

const SearchStaffFilter = () => {
    const { search, updateSearch } = useStaffManagementSearch();
    const [searchInput, setSearchInput] = useState(search || "");
    const debounceValue = useDebounce(searchInput, 500);

    useEffect(() => {
        if(debounceValue !== search) {
            updateSearch(debounceValue);
        }
    }, [debounceValue]);

    return (
        <div className="relative w-full xl:max-w-xl xl:flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
            placeholder="Search by staff name or ID..."
            />
        </div>
    );
};

const SelectStaffRole = () => {
    const { role, updateRole } = useStaffManagementSearch();

    return (
        <Select
        value={role || "all"}
        onValueChange={(value) => updateRole(value)}
        >
            <SelectTrigger className="w-full sm:w-auto">
                <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Role</SelectLabel>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="KITCHEN_STAFF">Kitchen Staff</SelectItem>
                    <SelectItem value="RESORT_STAFF">Resort Staff</SelectItem>
                    <SelectItem value="MAINTENANCE_STAFF">Maintenance Staff</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};

const SelectStaffStatus = () => {
    const { status, updateStatus } = useStaffManagementSearch();

    return (
        <Select
        value={status || "all"}
        onValueChange={(value) => updateStatus(value)}
        >
            <SelectTrigger className="w-full sm:w-auto">
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
    );
};

export default StaffFilter;
