import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMyResortReports } from "@/features/staff/resort/hooks/useStaffResort";
import type {
  ReportType,
  StaffBookingDetails,
  StaffReport,
} from "@/features/staff/resort/types/staffResort.type";
import { CalendarDays, Mail, MapPin, Phone, Plus, Users } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router";
import {
  formatResortDate,
  reportStatusClass,
  reportTypeLabels,
} from "./resortDisplay";

const BookingDetailContent = ({
  booking,
}: {
  booking: StaffBookingDetails;
}) => {
  const navigate = useNavigate();
  const reportsQuery = useMyResortReports({ bookingId: booking.id });
  const reports = reportsQuery.data?.pages.flatMap((page) => page.data) ?? [];
  const [now, setNow] = useState(() => new Date());
  const { checkIn, checkOut } = getBookingStayDates(
    booking.bookingDate,
    booking.stayOption.startTime,
    booking.stayOption.endTime,
  );
  const reportingOpen = now >= checkIn && now <= checkOut;

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(interval);
  }, []);

  const createReport = (type: ReportType) =>
    navigate(`/staff/resort/booking/${booking.id}/report/${type}`);

  return (
    <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
      <main className="min-w-0 space-y-5">
        <BookingInformation booking={booking} />

        <div className="space-y-5 xl:hidden">
          <GuestDetails booking={booking} />
          <ReservationTimeline checkIn={checkIn} checkOut={checkOut} />
        </div>

        <AccommodationCard booking={booking} />
        <ServicesAndOrders booking={booking} />

        {booking.specialRequests ? (
          <section className="rounded-xl border border-blue-100 bg-blue-50/60 p-5">
            <h2 className="font-bold">Special requests</h2>
            <p className="mt-2 text-sm leading-6 text-foreground">
              {booking.specialRequests}
            </p>
          </section>
        ) : null}

        <div className="xl:hidden">
          <CreateLinkedReport
            checkIn={checkIn}
            checkOut={checkOut}
            reportingOpen={reportingOpen}
            onCreate={createReport}
          />
        </div>

        <LinkedReports reports={reports} isLoading={reportsQuery.isLoading} />
      </main>

      <aside className="space-y-5 xl:sticky xl:top-6">
        <ReservationSnapshot booking={booking} />
        <div className="hidden space-y-5 xl:block">
          <GuestDetails booking={booking} />
          <ReservationTimeline checkIn={checkIn} checkOut={checkOut} />
          <CreateLinkedReport
            checkIn={checkIn}
            checkOut={checkOut}
            reportingOpen={reportingOpen}
            onCreate={createReport}
          />
        </div>
      </aside>
    </div>
  );
};

const BookingInformation = ({ booking }: { booking: StaffBookingDetails }) => (
  <section className="relative overflow-hidden rounded-xl border bg-card p-5 pl-6 shadow-sm">
    <span
      aria-hidden="true"
      className="absolute inset-y-0 left-0 w-1 bg-primary"
    />
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Confirmed reservation
        </p>
        <h2 className="mt-1 text-xl font-bold tracking-tight text-foreground md:text-2xl">
          {booking.guestName}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Booking reference: {booking.referenceCode}
        </p>
      </div>
      <Badge className="shrink-0 border border-emerald-200 bg-emerald-50 text-emerald-700">
        Confirmed
      </Badge>
    </div>
    <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t pt-4 text-sm text-muted-foreground">
      <span className="flex items-center gap-1.5">
        <CalendarDays className="size-4" />
        {formatResortDate(booking.bookingDate)}
      </span>
      <span className="flex items-center gap-1.5">
        <Users className="size-4" />
        {formatGuests(booking.numberOfGuests)}
      </span>
    </div>
  </section>
);

const ReservationSnapshot = ({ booking }: { booking: StaffBookingDetails }) => (
  <section className="rounded-xl border bg-card p-5 shadow-sm">
    <h2 className="text-lg font-bold">Reservation snapshot</h2>
    <div className="mt-4 space-y-3 text-sm">
      <SnapshotRow label="Status" value="Confirmed" />
      <SnapshotRow
        label="Booking date"
        value={formatResortDate(booking.bookingDate)}
      />
      <SnapshotRow label="Stay" value={booking.stayOptionLabelSnapshot} />
      <SnapshotRow
        label="Guests"
        value={formatGuests(booking.numberOfGuests)}
      />
      <SnapshotRow label="Accommodation" value={booking.accommodation.name} />
    </div>
  </section>
);

const SnapshotRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between gap-4 border-b pb-3 last:border-b-0 last:pb-0">
    <span className="text-muted-foreground">{label}</span>
    <span className="text-right font-semibold text-foreground">{value}</span>
  </div>
);

const GuestDetails = ({ booking }: { booking: StaffBookingDetails }) => (
  <section className="rounded-xl border bg-card p-5 shadow-sm">
    <h2 className="text-lg font-bold">Guest details</h2>
    <div className="mt-4 space-y-2.5">
      <Info
        icon={<Phone className="size-4" />}
        label="Phone"
        value={booking.contactNo}
      />
      <Info
        icon={<Mail className="size-4" />}
        label="Email"
        value={booking.email}
      />
      <Info
        icon={<Users className="size-4" />}
        label="Guest mix"
        value={`${booking.adultGuests} adults \u00B7 ${booking.kidGuests} kids \u00B7 ${booking.seniorGuest} seniors`}
      />
    </div>
  </section>
);

const Info = ({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-3 rounded-lg bg-muted/60 p-3">
    <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-blue-100 text-primary">
      {icon}
    </span>
    <div className="min-w-0">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="truncate text-sm text-foreground">{value}</p>
    </div>
  </div>
);

const ReservationTimeline = ({
  checkIn,
  checkOut,
}: {
  checkIn: Date;
  checkOut: Date;
}) => (
  <section className="rounded-xl border bg-card p-5 shadow-sm">
    <h2 className="text-lg font-bold">Reservation timeline</h2>
    <div className="mt-4">
      <TimelineRow
        label="Check-in"
        value={formatResortDateTime(checkIn)}
        active
      />
      <TimelineRow
        label="Check-out"
        value={formatResortDateTime(checkOut)}
        isLast
      />
    </div>
  </section>
);

const TimelineRow = ({
  label,
  value,
  active,
  isLast = false,
}: {
  label: string;
  value: string;
  active?: boolean;
  isLast?: boolean;
}) => (
  <div className="flex gap-3">
    <div className="flex flex-col items-center">
      <span
        className={`size-4 rounded-full ${active ? "border-4 border-primary" : "border-2 border-muted-foreground/30"}`}
      />
      {!isLast ? (
        <span aria-hidden="true" className="h-10 w-px bg-border" />
      ) : null}
    </div>
    <div className="min-h-14 flex-1">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
    </div>
  </div>
);

const AccommodationCard = ({ booking }: { booking: StaffBookingDetails }) => (
  <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
    <img
      src={booking.accommodation.imageUrl}
      alt={booking.accommodation.name}
      className="h-44 w-full object-cover"
    />
    <div className="p-5">
      <h2 className="text-lg font-bold">{booking.accommodation.name}</h2>
      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
        <MapPin className="size-4" />
        {booking.accommodation.type}
      </p>
    </div>
  </section>
);

const ServicesAndOrders = ({ booking }: { booking: StaffBookingDetails }) => (
  <section className="rounded-xl border bg-card p-5 shadow-sm">
    <h2 className="text-lg font-bold">Services & orders</h2>
    <div className="mt-4 space-y-4">
      <ServiceList
        title="Add-on services"
        empty="No add-on services."
        items={booking.addOns}
      />
      <div className="border-t" />
      <ServiceList
        title="Restaurant pre-orders"
        empty="No restaurant pre-orders."
        items={booking.preOrders}
      />
    </div>
  </section>
);

const ServiceList = ({
  title,
  empty,
  items,
}: {
  title: string;
  empty: string;
  items: {
    id: string;
    name: string;
    quantity: number;
    status?: "Pending" | "Completed";
  }[];
}) => (
  <div>
    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {title}
    </p>
    {items.length ? (
      <div className="mt-2 space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-3 rounded-lg bg-muted/60 p-3 text-sm"
          >
            <div className="min-w-0">
              <p className="truncate font-semibold text-foreground">
                {item.name}
              </p>
              {item.status ? (
                <span
                  className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${item.status === "Completed" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-800"}`}
                >
                  {item.status}
                </span>
              ) : null}
            </div>
            <strong className="shrink-0 text-primary">
              Qty {item.quantity}
            </strong>
          </div>
        ))}
      </div>
    ) : (
      <p className="mt-2 text-sm text-muted-foreground">{empty}</p>
    )}
  </div>
);

const CreateLinkedReport = ({
  checkIn,
  checkOut,
  reportingOpen,
  onCreate,
}: {
  checkIn: Date;
  checkOut: Date;
  reportingOpen: boolean;
  onCreate: (type: ReportType) => void;
}) => (
  <section className="rounded-xl border bg-card p-5 shadow-sm">
    <h2 className="text-lg font-bold">Create linked report</h2>
    <p className="mt-1 text-sm leading-6 text-muted-foreground">
      Available during guest stay ({formatResortDateTime(checkIn)} –{" "}
      {formatResortDateTime(checkOut)}).
    </p>
    {!reportingOpen ? (
      <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
        <p className="font-semibold text-foreground">
          Report window is not open right now.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Reports can only be created during the active stay.
        </p>
      </div>
    ) : null}
    <div className="mt-4 grid gap-2">
      <Button
        type="button"
        disabled={!reportingOpen}
        onClick={() => onCreate("checkIn")}
      >
        <Plus className="size-4" />
        Check-in report
      </Button>
      <Button
        type="button"
        disabled={!reportingOpen}
        onClick={() => onCreate("checkOut")}
      >
        <Plus className="size-4" />
        Check-out report
      </Button>
      <Button
        type="button"
        disabled={!reportingOpen}
        onClick={() => onCreate("maintenance")}
      >
        <Plus className="size-4" />
        Maintenance report
      </Button>
    </div>
  </section>
);

const LinkedReports = ({
  reports,
  isLoading,
}: {
  reports: StaffReport[];
  isLoading: boolean;
}) => (
  <section className="rounded-xl border bg-card p-5 shadow-sm">
    <div className="flex items-center justify-between gap-3">
      <div>
        <h2 className="text-lg font-bold">Linked reports</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Reports for this booking.
        </p>
      </div>
      {isLoading ? (
        <span className="text-xs text-muted-foreground">Loading...</span>
      ) : null}
    </div>
    <div className="mt-4 space-y-2">
      {reports.map((report) => (
        <Link
          key={report.id}
          to={`/staff/resort/report/${report.id}`}
          className="flex items-center justify-between gap-3 rounded-lg bg-muted/60 p-3 transition-colors hover:bg-muted"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {report.title}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {reportTypeLabels[report.type]}
            </p>
          </div>
          <span
            className={`shrink-0 rounded-full border px-2 py-1 text-xs font-semibold ${reportStatusClass[report.status]}`}
          >
            {report.status}
          </span>
        </Link>
      ))}
      {!isLoading && !reports.length ? (
        <p className="py-3 text-sm text-muted-foreground">
          No linked reports yet.
        </p>
      ) : null}
    </div>
  </section>
);

const formatGuests = (count: number) =>
  `${count} guest${count === 1 ? "" : "s"}`;

const getBookingStayDates = (
  bookingDate: string,
  startTime?: string | null,
  endTime?: string | null,
) => {
  const dateOnly = bookingDate.slice(0, 10);
  const checkIn = new Date(`${dateOnly}T00:00:00`);
  const checkOut = new Date(checkIn);
  const time = (value?: string | null) => {
    const match = value?.match(/(?:T|^)(\d{2}):(\d{2})(?::\d{2})?/);
    return match
      ? { hours: Number(match[1]), minutes: Number(match[2]) }
      : null;
  };
  const start = time(startTime);
  const end = time(endTime);

  if (start) checkIn.setHours(start.hours, start.minutes, 0, 0);
  if (end) checkOut.setHours(end.hours, end.minutes, 0, 0);
  if (
    start &&
    end &&
    end.hours * 60 + end.minutes <= start.hours * 60 + start.minutes
  ) {
    checkOut.setDate(checkOut.getDate() + 1);
  }

  return { checkIn, checkOut };
};

const formatResortDateTime = (date: Date) =>
  new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);

export default BookingDetailContent;
