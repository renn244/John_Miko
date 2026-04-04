import { Input } from "@/components/ui/input"
import LoadingSpinner from "@/components/ui/loadingSpinner"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGetMenuItemCategoriesQuery } from "@/hooks/admin/menu-item.hook"
import { useMenuItemSearch } from "@/hooks/admin/menu-item.search"
import useDebounce from "@/lib/useDebounce"
import { Search } from "lucide-react"
import { useEffect, useState } from "react"

const MenuItemFilter = () => {
    
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border-2">
            <div className="flex flex-col md:flex-row gap-4">

                <SearchMenuItemFilter />

                <SelecteMenuItemCategories />

                <SelectMenuItemAvailability />

            </div>
        </div>
    )
}

const SearchMenuItemFilter = () => {
    const { search, updateSearch } = useMenuItemSearch();
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
            placeholder="Search by menu item name or ID..."
            />
        </div>
    )
}

const SelecteMenuItemCategories = () => {
    const { data: categories, isLoading } = useGetMenuItemCategoriesQuery();
    const { category, updateCategory } = useMenuItemSearch();

    return (
        <Select
        value={category || ""}
        onValueChange={(value) => updateCategory(value)}
        >
            <SelectTrigger>
                <SelectValue placeholder="Category Type" />    
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Category Type</SelectLabel>
                    <SelectItem value="all">All Categories</SelectItem>
                    {isLoading ? (
                        <SelectItem value="loading" disabled>
                            <LoadingSpinner />
                        </SelectItem>
                    ) : (
                        categories?.map((category) => (
                            <SelectItem key={category} value={category}>
                                {category}
                            </SelectItem>
                        ))
                    )}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

const SelectMenuItemAvailability = () => {
    const { availability, updateAvailability } = useMenuItemSearch();

    return (
        <Select
        value={availability || ""}
        onValueChange={(value) => updateAvailability(value)}
        >
            <SelectTrigger>
                <SelectValue placeholder="Availability Status" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Availability Status</SelectLabel>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Unavailable">Unavailable</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

export default MenuItemFilter