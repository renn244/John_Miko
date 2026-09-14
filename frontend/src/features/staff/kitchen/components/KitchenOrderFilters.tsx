import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CalendarDays, Search } from "lucide-react";
import { useState } from "react";

const toDateId = (date: Date) =>
  [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");

type KitchenOrderFiltersProps = {
  search: string;
  date: string;
  onSearchChange: (value: string) => void;
  onDateChange: (value: string) => void;
};

const KitchenOrderFilters = ({
  search,
  date,
  onSearchChange,
  onDateChange,
}: KitchenOrderFiltersProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [draftDate, setDraftDate] = useState<Date | undefined>(
    date ? new Date(`${date}T12:00:00`) : undefined,
  );
  const openDateSheet = () => {
    setDraftDate(date ? new Date(`${date}T12:00:00`) : undefined);
    setIsSheetOpen(true);
  };
  return (
    <>
      <div className="flex items-center gap-2">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            className="h-11 pl-9"
            placeholder="Search guest or ref."
            type="search"
          />
        </div>
        <Button
          type="button"
          variant={date ? "default" : "outline"}
          size="icon-lg"
          onClick={openDateSheet}
          aria-label="Filter pre-orders by date"
        >
          <CalendarDays className="size-5" />
        </Button>
      </div>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          side="bottom"
          className="mx-auto max-w-2xl rounded-t-2xl px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]"
        >
          <SheetHeader className="px-0">
            <SheetTitle>Filter by date</SheetTitle>
          </SheetHeader>
          <Calendar
            mode="single"
            selected={draftDate}
            onSelect={setDraftDate}
            className="w-full p-0"
            classNames={{
              root: "w-full",
              months: "relative flex w-full flex-col gap-4",
              month: "flex w-full flex-col gap-4",
            }}
          />
          <SheetFooter className="flex-row gap-3 border-t px-0 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => {
                onDateChange("");
                setIsSheetOpen(false);
              }}
            >
              Clear date
            </Button>
            <Button
              type="button"
              className="flex-1"
              disabled={!draftDate}
              onClick={() => {
                if (!draftDate) return;
                onDateChange(toDateId(draftDate));
                setIsSheetOpen(false);
              }}
            >
              Apply
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default KitchenOrderFilters;
