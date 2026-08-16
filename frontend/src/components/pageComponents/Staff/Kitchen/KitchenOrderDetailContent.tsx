import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useCompleteAllKitchenItems,
  useUpdateKitchenItemStatus,
} from "@/hooks/staff/kitchen-order.hook";
import type { KitchenOrder } from "@/types/staff/kitchen-order.type";
import { CalendarDays, LoaderCircle, Mail, Phone } from "lucide-react";
import { useState, type ReactNode } from "react";
import { formatKitchenDate, kitchenStatusClassName } from "./kitchenDisplay";
import { KitchenOrderMeta } from "./KitchenOrderMeta";

const KitchenOrderDetailContent = ({ order }: { order: KitchenOrder }) => {
  const updateItem = useUpdateKitchenItemStatus();
  const completeAll = useCompleteAllKitchenItems();
  const [confirmCompleteAll, setConfirmCompleteAll] = useState(false);
  const isMutating = updateItem.isPending || completeAll.isPending;
  const completedCount = order.items.filter(
    (item) => item.status === "Completed",
  ).length;
  const { checkIn, checkOut } = getOrderStayDates(
    order.bookingDate,
    order.startTime,
    order.endTime,
  );
  const markAllDone = () =>
    completeAll.mutate(order.bookingId, {
      onSuccess: () => setConfirmCompleteAll(false),
    });

  return (
    <>
      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <main className="min-w-0 space-y-5">
          <OrderInformation order={order} />
          {order.notes?.trim() ? (
            <section className="rounded-xl border border-blue-100 bg-blue-50/60 p-5">
              <h2 className="font-bold">Dietary / service note</h2>
              <p className="mt-2 text-sm leading-6 text-foreground">
                {order.notes.trim()}
              </p>
            </section>
          ) : null}
          <MealItems
            order={order}
            completedCount={completedCount}
            isMutating={isMutating}
            isItemPending={updateItem.isPending}
            pendingItemId={updateItem.variables?.itemId}
            onToggleItem={(itemId, status) =>
              updateItem.mutate({ bookingId: order.bookingId, itemId, status })
            }
            onRequestCompleteAll={() => setConfirmCompleteAll(true)}
          />
        </main>

        <aside className="space-y-5 xl:sticky xl:top-6">
          <OrderSnapshot order={order} completedCount={completedCount} />
          <GuestContact order={order} />
          <ReservationTimeline
            checkIn={checkIn}
            checkOut={checkOut}
            hasCheckOutTime={Boolean(order.endTime)}
          />
        </aside>
      </div>
      {confirmCompleteAll ? (
        <CompleteAllDialog
          isPending={completeAll.isPending}
          onCancel={() => setConfirmCompleteAll(false)}
          onConfirm={markAllDone}
        />
      ) : null}
    </>
  );
};

const OrderInformation = ({ order }: { order: KitchenOrder }) => (
  <section className="relative overflow-hidden rounded-xl border bg-card p-5 pl-6 shadow-sm">
    <span
      aria-hidden="true"
      className="absolute inset-y-0 left-0 w-1 bg-primary"
    />
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Meal preparation
        </p>
        <h2 className="mt-1 truncate text-xl font-bold tracking-tight text-foreground md:text-2xl">
          {order.guestName}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Booking reference: {order.referenceCode}
        </p>
      </div>
      <Badge
        className={`shrink-0 border ${kitchenStatusClassName[order.kitchenStatus]}`}
      >
        {order.kitchenStatus}
      </Badge>
    </div>
    <div className="mt-5 border-t pt-4">
      <KitchenOrderMeta order={order} />
    </div>
  </section>
);

const MealItems = ({
  order,
  completedCount,
  isMutating,
  isItemPending,
  pendingItemId,
  onToggleItem,
  onRequestCompleteAll,
}: {
  order: KitchenOrder;
  completedCount: number;
  isMutating: boolean;
  isItemPending: boolean;
  pendingItemId?: string;
  onToggleItem: (itemId: string, status: "Pending" | "Completed") => void;
  onRequestCompleteAll: () => void;
}) => (
  <section className="rounded-xl border bg-card p-5 shadow-sm">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 className="text-lg font-bold">Meal items</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {completedCount} of {order.items.length} items completed
        </p>
      </div>
      {order.items.length > 0 && completedCount !== order.items.length ? (
        <Button
          type="button"
          size="sm"
          disabled={isMutating}
          onClick={onRequestCompleteAll}
        >
          Mark all done
        </Button>
      ) : null}
    </div>
    <div className="mt-4 space-y-2.5">
      {order.items.length ? (
        order.items.map((item) => {
          const isComplete = item.status === "Completed";
          const itemLoading = isItemPending && pendingItemId === item.id;
          return (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-lg bg-muted/60 px-3 py-3"
            >
              <div className="min-w-0 flex-1">
                <p
                  className={`font-semibold ${isComplete ? "text-muted-foreground line-through" : "text-foreground"}`}
                >
                  {item.name}
                </p>
              </div>
              <span className="rounded-md bg-blue-100 px-2.5 py-1.5 text-sm font-bold text-foreground">
                x{item.quantity}
              </span>
              <Button
                type="button"
                size="sm"
                variant={isComplete ? "outline" : "default"}
                disabled={isMutating}
                aria-label={itemLoading ? "Saving item" : undefined}
                onClick={() =>
                  onToggleItem(item.id, isComplete ? "Pending" : "Completed")
                }
              >
                {itemLoading ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : isComplete ? (
                  "Undo"
                ) : (
                  "Mark"
                )}
              </Button>
            </div>
          );
        })
      ) : (
        <p className="py-6 text-center text-sm text-muted-foreground">
          This booking has no meal items to prepare.
        </p>
      )}
    </div>
  </section>
);

const OrderSnapshot = ({
  order,
  completedCount,
}: {
  order: KitchenOrder;
  completedCount: number;
}) => (
  <section className="rounded-xl border bg-card p-5 shadow-sm">
    <h2 className="text-lg font-bold">Order snapshot</h2>
    <div className="mt-4 space-y-3 text-sm">
      <SnapshotRow label="Status" value={order.kitchenStatus} />
      <SnapshotRow
        label="Service date"
        value={formatKitchenDate(order.bookingDate)}
      />
      <SnapshotRow label="Time slot" value={order.timeSlot || "Not set"} />
      <SnapshotRow
        label="Items"
        value={`${completedCount}/${order.items.length} completed`}
      />
    </div>
  </section>
);

const SnapshotRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between gap-4 border-b pb-3 last:border-b-0 last:pb-0">
    <span className="text-muted-foreground">{label}</span>
    <span className="text-right font-semibold text-foreground">{value}</span>
  </div>
);

const GuestContact = ({ order }: { order: KitchenOrder }) => (
  <section className="rounded-xl border bg-card p-5 shadow-sm">
    <h2 className="font-bold">Guest contact</h2>
    <div className="mt-3 space-y-2.5">
      <ContactRow
        icon={<Phone className="size-4" />}
        label="Phone"
        value={order.contactNo || "No contact number"}
      />
      <ContactRow
        icon={<Mail className="size-4" />}
        label="Email"
        value={order.email || "No email available"}
      />
    </div>
  </section>
);

const ReservationTimeline = ({
  checkIn,
  checkOut,
  hasCheckOutTime,
}: {
  checkIn: Date;
  checkOut: Date;
  hasCheckOutTime: boolean;
}) => (
  <section className="rounded-xl border bg-card p-5 shadow-sm">
    <h2 className="font-bold">Reservation timeline</h2>
    <div className="mt-4">
      <TimelineRow
        label="Check-in"
        value={formatTimelineDate(checkIn)}
        active
      />
      <TimelineRow
        label="Check-out"
        value={hasCheckOutTime ? formatTimelineDate(checkOut) : "Time not set"}
        isLast
      />
    </div>
  </section>
);

const CompleteAllDialog = ({
  isPending,
  onCancel,
  onConfirm,
}: {
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) => (
  <Dialog
    open
    onOpenChange={(open) => {
      if (!open && !isPending) onCancel();
    }}
  >
    <DialogContent
      showCloseButton={false}
      className="inset-x-0 bottom-0 left-0 top-auto w-full max-w-none translate-x-0 translate-y-0 rounded-b-none rounded-t-xl data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom sm:top-1/2 sm:left-1/2 sm:bottom-auto sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-lg sm:data-[state=closed]:zoom-out-95 sm:data-[state=open]:zoom-in-95"
    >
      <DialogHeader>
        <DialogTitle>Mark all items done?</DialogTitle>
        <DialogDescription>
          This completes every item in this order.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="flex-col sm:flex-row">
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="button"
          disabled={isPending}
          aria-label={isPending ? "Saving all items" : undefined}
          onClick={onConfirm}
        >
          {isPending ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            "Mark all done"
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

const ContactRow = ({
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
      <p className="mt-1 flex items-center gap-2 text-sm font-semibold">
        <CalendarDays className="size-4" />
        {value}
      </p>
    </div>
  </div>
);

const formatTimelineDate = (value?: Date | null) =>
  !value || Number.isNaN(value.getTime())
    ? "Time not set"
    : new Intl.DateTimeFormat("en-PH", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }).format(value);
const getOrderStayDates = (
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
  )
    checkOut.setDate(checkOut.getDate() + 1);
  return { checkIn, checkOut };
};

export default KitchenOrderDetailContent;
