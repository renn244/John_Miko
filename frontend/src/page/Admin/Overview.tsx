
import StatisticCards from "@/components/ui/StatisticCards";
import { Badge } from "@/components/ui/badge";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useGetAccommodationStatsQuery } from "@/hooks/admin/accommodation.hook";
import { useGetBookingDetailsBulkQuery, useGetOverviewBookingsQuery } from "@/hooks/admin/booking.hook";
import { useGetFeedbackStatsQuery, useGetRecentFeedbacksQuery } from "@/hooks/admin/feedback.hook";
import { useGetPaymentReports } from "@/hooks/admin/payment.hook";
import { useGetStaffReportReportsQuery } from "@/hooks/admin/staff-report.hook";
import { formatToSmartDate } from "@/lib/date.util";
import { format } from "date-fns";
import { BookMarked, CalendarCheck, ClipboardList, DollarSign, Home, Mails, MessageSquare, MessageSquareWarning, ShoppingBag, Star } from "lucide-react";
import { Link } from "react-router";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Confirmed":
      return { bg: "#DBEAFE", text: "#1E73BE", border: "#1E73BE" };
    case "Completed":
      return { bg: "#D1FAE5", text: "#059669", border: "#059669" };
    case "Cancelled":
      return { bg: "#FEE2E2", text: "#DC2626", border: "#DC2626" };
    default:
      return { bg: "#F3F4F6", text: "#6B7280", border: "#6B7280" };
  }
};

const Overview = () => {
  const { data: accommodationStats, isLoading: accommodationLoading } = useGetAccommodationStatsQuery();
  const { data: feedbackStats, isLoading: feedbackStatsLoading } = useGetFeedbackStatsQuery();
  const { data: paymentReport, isLoading: paymentLoading } = useGetPaymentReports();
  const { data: bookingSummary, isLoading: bookingsLoading } = useGetOverviewBookingsQuery(20);
  const { data: recentFeedbacks, isLoading: recentFeedbackLoading } = useGetRecentFeedbacksQuery(5);
  const { data: staffReport, isLoading: staffReportLoading } = useGetStaffReportReportsQuery();

  const totalRevenue = paymentReport ? paymentReport.paidOnBooking + paymentReport.paidOnCash : 0;
  const totalBookings = bookingSummary?.meta.total || 0;
  const bookings = bookingSummary?.data || [];
  const feedbacks = recentFeedbacks?.data || [];

  const today = new Date();
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const upcomingBookings = bookings
    .filter((booking) => {
      const bookingDate = new Date(booking.bookingDate);
      const bookingDateOnly = new Date(
        bookingDate.getFullYear(),
        bookingDate.getMonth(),
        bookingDate.getDate()
      );

      return (
        bookingDateOnly >= todayDate &&
        (booking.status === "Confirmed" || booking.status === "Pending")
      );
    })
    .sort((a, b) => new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime())
    .slice(0, 5);

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const recentBookingIds = recentBookings.map((booking) => booking.id);
  const { data: recentBookingDetails, isLoading: bookingDetailsLoading } =
    useGetBookingDetailsBulkQuery(recentBookingIds);

  const recentPreOrders = recentBookingDetails
    .filter((booking) => (booking?.preOrders?.length || 0) > 0)
    .map((booking) => {
      const totalItems = (booking.preOrders || []).reduce(
        (total, item) => total + item.quantity,
        0
      );

      return {
        booking,
        totalItems,
        amount: booking.payment?.preOrderAmount || 0,
      };
    })
    .sort((a, b) => new Date(b.booking.createdAt).getTime() - new Date(a.booking.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Overview</h1>
          <p className="text-sm mt-1 text-muted-foreground">
            Get a quick snapshot of restaurant performance and key metrics
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatisticCards
          title="Total Accommodations"
          Icon={<Home className="w-5 h-5 text-blue-600" />}
          stat={accommodationStats?.total || 0}
          isLoading={accommodationLoading}
        />

        <StatisticCards
          title="Total Bookings"
          Icon={<CalendarCheck className="w-5 h-5 text-emerald-600" />}
          stat={totalBookings}
          isLoading={bookingsLoading}
        />

        <StatisticCards
          title="Total Feedback"
          Icon={<MessageSquare className="w-5 h-5 text-amber-600" />}
          stat={feedbackStats?.total || 0}
          isLoading={feedbackStatsLoading}
        />

        <StatisticCards
          title="Total Revenue"
          Icon={<DollarSign className="w-5 h-5 text-primary" />}
          stat={totalRevenue}
          format={(value) => `₱${value.toLocaleString()}`}
          isLoading={paymentLoading}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-2 bg-card rounded-xl p-6 shadow-sm border border-border">
          <div className="flex items-start justify-between mb-5 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10 text-primary">
                <BookMarked className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Upcoming Bookings</h3>
                <p className="text-xs text-muted-foreground">
                  Next confirmed and pending reservations
                </p>
              </div>
            </div>
            <Link to="/admin/booking" className="text-xs font-semibold text-primary">
              View all
            </Link>
          </div>

          {bookingsLoading ? (
            <LoadingSpinner className="w-6 h-6" />
          ) : upcomingBookings.length ? (
            <div className="space-y-3">
              {upcomingBookings.map((booking) => {
                const statusColors = getStatusColor(booking.status);

                return (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between gap-4 rounded-lg border border-border bg-muted/40 p-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {booking.guestName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {booking.accommodation.name} · {format(new Date(booking.bookingDate), "MMM dd, yyyy")} · {booking.timeSlot}
                      </p>
                    </div>
                    <Badge
                      style={{
                        backgroundColor: statusColors.bg,
                        color: statusColors.text,
                        borderColor: statusColors.border,
                        borderWidth: "1px",
                      }}
                    >
                      {booking.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              No upcoming bookings found
            </div>
          )}
          </div>

          <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
            <div className="flex items-start justify-between mb-5 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10 text-primary">
                  <Mails className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Recent Bookings</h3>
                  <p className="text-xs text-muted-foreground">Latest reservations created</p>
                </div>
              </div>
              <Link to="/admin/booking" className="text-xs font-semibold text-primary">
                View all
              </Link>
            </div>

            {bookingsLoading ? (
              <LoadingSpinner className="w-6 h-6" />
            ) : recentBookings.length ? (
              <div className="space-y-3">
                {recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between gap-4 rounded-lg border border-border bg-muted/40 p-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {booking.guestName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {booking.accommodation.name} · {format(new Date(booking.bookingDate), "MMM dd, yyyy")}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatToSmartDate(booking.createdAt)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                No recent bookings created
              </div>
            )}
          </div>

          <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
            <div className="flex items-start justify-between mb-5 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10 text-primary">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Recent Pre-orders</h3>
                  <p className="text-xs text-muted-foreground">Pulled from latest bookings</p>
                </div>
              </div>
              <Link to="/admin/booking" className="text-xs font-semibold text-primary">
                View bookings
              </Link>
            </div>

            {bookingsLoading || bookingDetailsLoading ? (
              <LoadingSpinner className="w-6 h-6" />
            ) : recentPreOrders.length ? (
              <div className="space-y-3">
                {recentPreOrders.map(({ booking, totalItems, amount }) => (
                  <div
                    key={booking.id}
                    className="flex items-start justify-between gap-4 rounded-lg border border-border bg-muted/40 p-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {booking.guestName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {booking.accommodation.name} · {totalItems} item{totalItems > 1 ? "s" : ""}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatToSmartDate(booking.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground">₱{amount.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">pre-order</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                No recent pre-orders found
              </div>
            )}
          </div>
        </div>

        <div className="xl:col-span-4 space-y-6">
          <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
            <div className="flex items-start justify-between mb-5 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10 text-primary">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Staff Reports Today</h3>
                  <p className="text-xs text-muted-foreground">Check-in and check-out notes</p>
                </div>
              </div>
              <Link to="/admin/report" className="text-xs font-semibold text-primary">
                View reports
              </Link>
            </div>

            {staffReportLoading ? (
              <LoadingSpinner className="w-6 h-6" />
            ) : staffReport ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg border border-border bg-muted/40">
                    <div className="text-xs mb-1 text-muted-foreground">From Check-in</div>
                    <div className="text-sm font-bold text-foreground">{staffReport.checkInReportToday}</div>
                  </div>
                  <div className="p-3 rounded-lg border border-border bg-muted/40">
                    <div className="text-xs mb-1 text-muted-foreground">From Check-out</div>
                    <div className="text-sm font-bold text-foreground">{staffReport.checkOutReportToday}</div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-muted">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Total today</span>
                    <span className="text-sm font-bold text-foreground">
                      {staffReport.totalToday} {staffReport.totalToday > 1 ? "reports" : "report"}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                No staff reports found
              </div>
            )}
          </div>

          <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
            <div className="flex items-start justify-between mb-5 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10 text-primary">
                  <MessageSquareWarning className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Recent Feedback</h3>
                  <p className="text-xs text-muted-foreground">Latest guest reviews</p>
                </div>
              </div>
              <Link to="/admin/feedback" className="text-xs font-semibold text-primary">
                View all
              </Link>
            </div>

            {recentFeedbackLoading ? (
              <LoadingSpinner className="w-6 h-6" />
            ) : feedbacks.length ? (
              <div className="space-y-3">
                {feedbacks.map((feedback) => (
                  <div
                    key={feedback.id}
                    className="rounded-lg border border-border bg-muted/40 p-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-foreground">{feedback.user.name}</p>
                      <div className="flex items-center gap-1 text-xs font-semibold text-amber-600">
                        <Star className="w-3.5 h-3.5" fill="currentColor" />
                        {feedback.rating}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{formatToSmartDate(feedback.createdAt)}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{feedback.comment || "No comment provided."}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                No recent feedback available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;