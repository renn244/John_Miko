import {
  AdminClearFiltersButton,
  AdminFilterLayout,
} from "@/features/admin/layout/components/AdminFilterLayout";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePaymentMethodSearch } from "@/features/admin/payment-methods/hooks/usePaymentMethodSearch";
import useDebounce from "@/lib/useDebounce";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

const PaymentMethodFilter = () => {
  const { search, isActive, clearFilters } = usePaymentMethodSearch();
  const hasFilters = Boolean(search || typeof isActive === "boolean");

  return (
    <AdminFilterLayout search={<SearchPaymentMethodFilter />}>
      <SelectPaymentMethodStatus />
      <AdminClearFiltersButton onClick={clearFilters} disabled={!hasFilters} />
    </AdminFilterLayout>
  );
};

const SearchPaymentMethodFilter = () => {
  const { search, updateSearch } = usePaymentMethodSearch();
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
        placeholder="Search payment methods..."
      />
    </div>
  );
};

const SelectPaymentMethodStatus = () => {
  const { isActive, updateIsActive } = usePaymentMethodSearch();

  return (
    <div className="w-full sm:w-auto">
      <Select
        value={typeof isActive === "boolean" ? String(isActive) : "all"}
        onValueChange={updateIsActive}
      >
        <SelectTrigger className="w-full sm:w-[148px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Status</SelectLabel>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="true">Active</SelectItem>
            <SelectItem value="false">Inactive</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default PaymentMethodFilter;
