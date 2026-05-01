import type { FeedbackAnalytics } from "@/types/feedback.types";

export type Interval = "day" | "week" | "month" | "year";

export type ChartPoint = {
	label: string;
	averageRating: number | null;
};

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const MONTH_LABELS = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
] as const;

function toNumber(value: string) {
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : 0;
}

function clampRating(value: number) {
	if (!Number.isFinite(value)) return 0;
	return Math.max(0, Math.min(5, value));
}

function buildBuckets(interval: Interval): ChartPoint[] {
	const now = new Date();

	if (interval === "day") {
		return Array.from({ length: 24 }, (_, hour) => ({
			label: `${hour.toString().padStart(2, "0")}:00`,
			averageRating: 0,
		}));
	}

	if (interval === "week") {
		return WEEKDAY_LABELS.map((label) => ({ label, averageRating: 0 }));
	}

	if (interval === "month") {
		const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
		return Array.from({ length: daysInMonth }, (_, index) => ({
			label: `${index + 1}`,
			averageRating: 0,
		}));
	}

	return MONTH_LABELS.map((label) => ({ label, averageRating: 0 }));
}

export function groupAnalyticsToChartData(interval: Interval, analytics: FeedbackAnalytics[]): ChartPoint[] {
	const buckets = buildBuckets(interval);
	const sums = new Array(buckets.length).fill(0) as number[];
	const counts = new Array(buckets.length).fill(0) as number[];

	for (const item of analytics) {
		const date = new Date(item.date);
		if (Number.isNaN(date.getTime())) continue;

		let index = 0;
		if (interval === "day") {
			index = date.getHours();
		} else if (interval === "week") {
			index = date.getDay();
		} else if (interval === "month") {
			index = date.getDate() - 1;
		} else {
			index = date.getMonth();
		}

		if (index < 0 || index >= buckets.length) continue;

		sums[index] += toNumber(item.averageRating);
		counts[index] += 1;
	}

	return buckets.map((bucket, index) => {
		const count = counts[index];
		if (!count) return bucket;

		return {
			...bucket,
			averageRating: Number(clampRating(sums[index] / count).toFixed(2)),
		};
	});
}
