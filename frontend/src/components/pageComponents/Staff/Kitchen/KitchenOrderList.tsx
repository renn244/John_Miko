import {
  AdminClearFiltersButton,
  AdminFilterLayout,
} from "@/components/pageComponents/Admin/AdminFilterLayout";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StatisticCards from "@/components/ui/StatisticCards";
import { useKitchenOrders } from "@/hooks/staff/kitchen-order.hook";
import useDebounce from "@/lib/useDebounce";
import type { KitchenOrderStatus } from "@/types/staff/kitchen-order.type";
import { format } from "date-fns";
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";
import KitchenOrderCard from "./KitchenOrderCard";
import KitchenOrderFilters from "./KitchenOrderFilters";
import { KitchenQueueSkeleton } from "./KitchenLoadingSkeleton";

const KitchenOrderList = () => {
  const [searchInput, setSearchInput] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState<KitchenOrderStatus | "all">("all");
  const search = useDebounce(searchInput.trim(), 350);
  const query = useKitchenOrders({
    search: search || undefined,
    date: date || undefined,
    status: status === "all" ? undefined : status,
  });
  const orders = useMemo(() => query.data ?? [], [query.data]);
  const pendingOrders = orders.filter(
    (order) => order.kitchenStatus === "Pending",
  );
  const completedOrders = orders.filter(
    (order) => order.kitchenStatus === "Completed",
  );
  const selectedDate = date ? new Date(`${date}T12:00:00`) : undefined;
  const hasFilters = Boolean(searchInput.trim() || date || status !== "all");
  const clearFilters = () => {
    setSearchInput("");
    setDate("");
    setStatus("all");
  };

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Kitchen queue
        </h1>
        <p className="text-base text-muted-foreground">
          Guest meal pre-orders ready for preparation.
        </p>
      </header>
      <div className="lg:hidden">
        <KitchenOrderFilters
          search={searchInput}
          date={date}
          onSearchChange={setSearchInput}
          onDateChange={setDate}
        />
      </div>
      <div className="hidden space-y-5 lg:block">
        <div className="grid grid-cols-3 gap-4">
          <StatisticCards
            title="All orders"
            stat={orders.length}
            Icon={<ClipboardList />}
            isLoading={query.isLoading}
            accentClassName="border-l-primary"
            iconContainerClassName="bg-primary"
          />
          <StatisticCards
            title="Pending"
            stat={pendingOrders.length}
            Icon={<Clock3 />}
            isLoading={query.isLoading}
            accentClassName="border-l-amber-500"
            iconContainerClassName="bg-amber-500"
          />
          <StatisticCards
            title="Completed"
            stat={completedOrders.length}
            Icon={<CheckCircle2 />}
            isLoading={query.isLoading}
            accentClassName="border-l-emerald-500"
            iconContainerClassName="bg-emerald-500"
          />
        </div>
        <AdminFilterLayout
          search={
            <label className="relative block">
              <span className="sr-only">Search kitchen orders</span>
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                className="pl-9"
                placeholder="Search guest or reference"
                type="search"
              />
            </label>
          }
        >
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start font-normal sm:w-44"
              >
                {selectedDate
                  ? format(selectedDate, "MMM d, yyyy")
                  : "Filter by date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(selected) =>
                  setDate(selected ? format(selected, "yyyy-MM-dd") : "")
                }
              />
            </PopoverContent>
          </Popover>
          <Select
            value={status}
            onValueChange={(value) =>
              setStatus(value as KitchenOrderStatus | "all")
            }
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <AdminClearFiltersButton
            disabled={!hasFilters}
            onClick={clearFilters}
          />
        </AdminFilterLayout>
      </div>
      {query.isLoading ? <KitchenQueueSkeleton /> : null}
      {!query.isLoading && query.isError ? (
        <section className="space-y-4 py-14 text-center">
          <AlertTriangle className="mx-auto size-7 text-destructive" />
          <div>
            <h2 className="font-bold">Could not load pre-orders</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              There was a problem connecting to the kitchen display system.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => query.refetch()}
          >
            Retry
          </Button>
        </section>
      ) : null}
      {!query.isLoading && !query.isError && orders.length === 0 ? (
        <section className="py-14 text-center">
          <ClipboardList className="mx-auto size-7 text-primary" />
          <h2 className="mt-3 font-bold">No pre-orders found</h2>
          <p className="mx-auto mt-1 max-w-xs text-sm leading-6 text-muted-foreground">
            {hasFilters
              ? "Try changing the search, date, or status filter."
              : "New guest pre-orders will appear here."}
          </p>
          {hasFilters ? (
            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={clearFilters}
            >
              Clear filters
            </Button>
          ) : null}
        </section>
      ) : null}
      {!query.isLoading && !query.isError && orders.length > 0 ? (
        <>
          <div className="space-y-3 lg:hidden">
            {orders.map((order) => (
              <KitchenOrderCard key={order.bookingId} order={order} />
            ))}
          </div>
          <div className="hidden space-y-7 lg:block">
            {(
              [
                { label: "Pending preparation", orders: pendingOrders },
                { label: "Completed", orders: completedOrders },
              ] as const
            ).map((group) =>
              group.orders.length ? (
                <section
                  key={group.label}
                  className="space-y-3"
                  aria-labelledby={`kitchen-${group.label.toLowerCase().replaceAll(" ", "-")}`}
                >
                  <div className="flex items-center gap-2">
                    <h2
                      id={`kitchen-${group.label.toLowerCase().replaceAll(" ", "-")}`}
                      className="text-lg font-bold text-foreground"
                    >
                      {group.label}
                    </h2>
                    <span className="text-sm font-medium text-muted-foreground">
                      {group.orders.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-3 lg:grid-cols-3 2xl:grid-cols-4">
                    {group.orders.map((order) => (
                      <KitchenOrderCard
                        key={order.bookingId}
                        order={order}
                        variant="board"
                      />
                    ))}
                  </div>
                </section>
              ) : null,
            )}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default KitchenOrderList;
