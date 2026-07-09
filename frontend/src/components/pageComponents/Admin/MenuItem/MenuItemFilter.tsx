import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetMenuItemCategoriesQuery } from "@/hooks/admin/menu-item.hook";
import { useMenuItemSearch } from "@/hooks/admin/menu-item.search";
import useDebounce from "@/lib/useDebounce";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

const MenuItemFilter = () => {
    const { search, category, availability, clearFilters } = useMenuItemSearch();
    const hasFilters = Boolean(search || category || availability);

    return (
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="w-full xl:max-w-md">
                <SearchMenuItemFilter />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center xl:ml-4 xl:flex-nowrap xl:justify-end xl:gap-2">
                <SelectMenuItemCategories />
                <SelectMenuItemAvailability />

                <Button
                type="button"
                variant="ghost"
                onClick={clearFilters}
                disabled={!hasFilters}
                className="h-auto px-0 text-sm font-medium text-primary hover:bg-transparent hover:text-primary/80 disabled:pointer-events-none disabled:opacity-40"
                >
                    <X className="h-4 w-4" />
                    Clear Filters
                </Button>
            </div>
        </div>
    );
};

const SearchMenuItemFilter = () => {
    const { search, updateSearch } = useMenuItemSearch();
    const [searchInput, setSearchInput] = useState(search || "");
    const debounceValue = useDebounce(searchInput, 500);

    useEffect(() => {
        if (debounceValue !== search) {
            updateSearch(debounceValue);
        }
    }, [debounceValue]);

    return (
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9"
                placeholder="Search by menu item name or ID..."
            />
        </div>
    );
};

const SelectMenuItemCategories = () => {
    const { data: categories, isLoading } = useGetMenuItemCategoriesQuery();
    const { category, updateCategory } = useMenuItemSearch();

    return (
        <div className="w-full sm:w-auto">
            <Select value={category || "all"} onValueChange={updateCategory}>
                <SelectTrigger className="w-full sm:w-auto">
                    <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Category</SelectLabel>
                        <SelectItem value="all">All Categories</SelectItem>
                        {isLoading ? (
                            <SelectItem value="loading" disabled>
                                <LoadingSpinner />
                            </SelectItem>
                        ) : (
                            categories?.map((itemCategory) => (
                                <SelectItem key={itemCategory} value={itemCategory}>
                                    {itemCategory}
                                </SelectItem>
                            ))
                        )}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
};

const SelectMenuItemAvailability = () => {
    const { availability, updateAvailability } = useMenuItemSearch();

    return (
        <div className="w-full sm:w-auto">
            <Select value={availability || "all"} onValueChange={updateAvailability}>
                <SelectTrigger className="w-full sm:w-auto">
                    <SelectValue placeholder="Availability" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Availability</SelectLabel>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="Unavailable">Unavailable</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
};

export default MenuItemFilter;
