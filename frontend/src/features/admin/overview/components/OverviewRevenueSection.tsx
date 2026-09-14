import RevenueBreakdownCard from "@/features/admin/overview/components/revenue/RevenueBreakdownCard";
import RevenueLineChart, {
    type RevenueLineChartPoint,
} from "@/features/admin/overview/components/revenue/RevenueLineChart";
import { EmptyState, surfaceClassName } from "@/features/admin/overview/components/Overview.shared";
import { useGetRevenueAnalyticsQuery } from "@/features/admin/payments/hooks/useAdminPayments";
import type { RevenueAnalyticsApiItem } from "@/features/admin/payments/types/payment.type";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";

const normalizeRevenueRow = (
    row: RevenueAnalyticsApiItem,
): RevenueLineChartPoint => ({
    month: row.month,
    count: Number(row.count) || 0,
    totalAmount: Number(row.totalamount) || 0,
    accommodationAmount: Number(row.accommodationamount) || 0,
    preOrderAmount: Number(row.preorderamount) || 0,
    addOnAmount: Number(row.addonamount) || 0,
    guestFeeAmount: Number(row.guestfeeamount) || 0,
    privateClosureRevenueAmount: Number(row.privateclosurerevenueamount) || 0,
});

const toMonthKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
};

const monthKeyToDate = (monthKey: string) => {
    const [year, month] = monthKey.split("-");
    return new Date(Number(year), Number(month) - 1, 1);
};

const addMonths = (date: Date, delta: number) =>
    new Date(date.getFullYear(), date.getMonth() + delta, 1);

const buildLastMonthsSeries = (
    rows: RevenueLineChartPoint[],
    months: number,
    endMonthKey: string,
): RevenueLineChartPoint[] => {
    const existingByMonth = new Map<string, RevenueLineChartPoint>();
    rows.forEach((row) => existingByMonth.set(row.month, row));

    const endDate = monthKeyToDate(endMonthKey);
    const series: RevenueLineChartPoint[] = [];

    for (let i = months - 1; i >= 0; i -= 1) {
        const key = toMonthKey(addMonths(endDate, -i));
        series.push(
            existingByMonth.get(key) ?? {
                month: key,
                count: 0,
                totalAmount: 0,
                accommodationAmount: 0,
                preOrderAmount: 0,
                addOnAmount: 0,
                guestFeeAmount: 0,
                privateClosureRevenueAmount: 0,
            },
        );
    }

    return series;
};

const OverviewRevenueSection = () => {
    const revenueQuery = useGetRevenueAnalyticsQuery();
    const [selectedRevenueMonth, setSelectedRevenueMonth] = useState<string | null>(
        () => toMonthKey(new Date()),
    );

    const revenueData = useMemo(() => {
        if (revenueQuery.isError) return [];
        const rows = (revenueQuery.data ?? []).map(normalizeRevenueRow);
        return buildLastMonthsSeries(rows, 12, toMonthKey(new Date()));
    }, [revenueQuery.data, revenueQuery.isError]);

    useEffect(() => {
        if (!selectedRevenueMonth) return;
        if (revenueData.some((row) => row.month === selectedRevenueMonth)) return;
        setSelectedRevenueMonth(null);
    }, [revenueData, selectedRevenueMonth]);

    const selectedRevenue = useMemo(
        () => revenueData.find((row) => row.month === selectedRevenueMonth) ?? null,
        [revenueData, selectedRevenueMonth],
    );

    if (revenueQuery.isError) {
        return (
            <div className={cn(surfaceClassName, "p-4")}>
                <EmptyState message="Failed to load revenue analytics." />
            </div>
        );
    }

    return (
        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
            <RevenueLineChart
                data={revenueData}
                isLoading={revenueQuery.isLoading}
                selectedMonth={selectedRevenueMonth}
                onSelectMonth={(month) => setSelectedRevenueMonth(month || null)}
            />
            <RevenueBreakdownCard selected={selectedRevenue} />
        </section>
    );
};

export default OverviewRevenueSection;
