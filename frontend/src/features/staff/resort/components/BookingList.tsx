import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useResortBookings } from "@/features/staff/resort/hooks/useStaffResort";
import useDebounce from "@/lib/useDebounce";
import type { StaffBookingSummary } from "@/features/staff/resort/types/staffResort.type";
import {
  AlertTriangle,
  CalendarDays,
  ChevronRight,
  Search,
  SearchX,
  Users,
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router";
import { formatResortDate } from "./resortDisplay";
import { ResortListSkeleton } from "./ResortLoadingSkeleton";

const dayKey = (value: string) => value.slice(0, 10);

const manilaToday = () => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  return `${parts.find((part) => part.type === "year")?.value}-${parts.find((part) => part.type === "month")?.value}-${parts.find((part) => part.type === "day")?.value}`;
};

const BookingList = () => {
  const [searchInput, setSearchInput] = useState("");
  const search = useDebounce(searchInput.trim(), 350);
  const query = useResortBookings(search);
  const bookings = useMemo(
    () => query.data?.pages.flatMap((page) => page.data) ?? [],
    [query.data],
  );
  const today = manilaToday();
  const sections = useMemo(
    () =>
      [
        {
          label: "Today",
          items: bookings.filter(
            (booking) => dayKey(booking.bookingDate) === today,
          ),
          accent: "bg-amber-400",
        },
        {
          label: "Upcoming",
          items: bookings.filter(
            (booking) => dayKey(booking.bookingDate) !== today,
          ),
          accent: "bg-primary",
        },
      ].filter((section) => section.items.length),
    [bookings, today],
  );

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Upcoming bookings
        </h1>
        <p className="text-base text-muted-foreground">
          Verify guests and prepare for confirmed reservations.
        </p>
      </header>

      <BookingSearch value={searchInput} onChange={setSearchInput} mobile />
      <BookingSearch value={searchInput} onChange={setSearchInput} />

      {query.isLoading ? <ResortListSkeleton /> : null}

      {!query.isLoading && query.isError ? (
        <State
          icon={<AlertTriangle className="size-7 text-destructive" />}
          title="Could not load bookings"
          description="Check your connection and try again."
          action="Retry"
          onAction={() => query.refetch()}
        />
      ) : null}

      {!query.isLoading && !query.isError && !bookings.length ? (
        <State
          icon={<SearchX className="size-7 text-primary" />}
          title={
            search ? "No bookings found" : "No confirmed upcoming bookings"
          }
          description={
            search
              ? "Try a different guest name, contact number, or booking reference."
              : "There are no confirmed reservations to prepare right now."
          }
        />
      ) : null}

      {!query.isLoading && !query.isError && bookings.length > 0
        ? sections.map((section) => (
            <section key={section.label} className="space-y-3">
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className={`size-2 rounded-full ${section.accent}`}
                />
                <h2 className="text-lg font-bold text-foreground">
                  {section.label}
                </h2>
                <span className="text-sm font-medium text-muted-foreground">
                  {section.items.length}
                </span>
              </div>

              <div className="space-y-3 lg:hidden">
                {section.items.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    today={today}
                  />
                ))}
              </div>
              <div className="hidden gap-3 lg:grid lg:grid-cols-3 2xl:grid-cols-4">
                {section.items.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    today={today}
                    variant="board"
                  />
                ))}
              </div>
            </section>
          ))
        : null}

      {query.hasNextPage ? (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={query.isFetchingNextPage}
          onClick={() => query.fetchNextPage()}
        >
          {query.isFetchingNextPage ? "Loading..." : "Load more"}
        </Button>
      ) : null}
    </div>
  );
};

const BookingSearch = ({
  value,
  onChange,
  mobile = false,
}: {
  value: string;
  onChange: (value: string) => void;
  mobile?: boolean;
}) => (
  <label
    className={`relative block ${mobile ? "lg:hidden" : "hidden lg:block lg:max-w-xl"}`}
  >
    <span className="sr-only">Search bookings</span>
    <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
    <Input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Search guest or reference"
      type="search"
      className={mobile ? "h-11 pl-9" : "pl-9"}
    />
  </label>
);

const BookingCard = ({
  booking,
  today,
  variant = "list",
}: {
  booking: StaffBookingSummary;
  today: string;
  variant?: "list" | "board";
}) => {
  const isToday = dayKey(booking.bookingDate) === today;

  return (
    <Link
      to={`/staff/resort/booking/${booking.id}`}
      className={`group relative block overflow-hidden rounded-xl border bg-card shadow-sm transition-colors hover:bg-accent/35 ${variant === "board" ? "h-full lg:min-h-[180px]" : ""}`}
    >
      <span
        aria-hidden="true"
        className={`absolute inset-y-0 left-0 w-1 ${isToday ? "bg-amber-400" : "bg-primary"}`}
      />
      <div className="space-y-3 p-4 pl-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-bold text-foreground">
              {booking.guestName}
            </h3>
            <p className="mt-1 truncate text-sm text-muted-foreground">
              {booking.accommodation.name} · {booking.stayOptionLabelSnapshot}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <span>{booking.referenceCode}</span>
            <ChevronRight className="size-4" />
          </div>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-4" />
            {formatResortDate(booking.bookingDate)}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="size-4" />
            {booking.numberOfGuests} guest
            {booking.numberOfGuests === 1 ? "" : "s"}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Booking reference: {booking.referenceCode}
        </p>
      </div>
    </Link>
  );
};

const State = ({
  icon,
  title,
  description,
  action,
  onAction,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: string;
  onAction?: () => void;
}) => (
  <section className="py-14 text-center">
    <div className="flex justify-center">{icon}</div>
    <h2 className="mt-3 font-bold">{title}</h2>
    <p className="mx-auto mt-1 max-w-xs text-sm leading-6 text-muted-foreground">
      {description}
    </p>
    {action && onAction ? (
      <Button
        type="button"
        variant="outline"
        className="mt-4"
        onClick={onAction}
      >
        {action}
      </Button>
    ) : null}
  </section>
);

export default BookingList;
