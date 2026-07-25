import Footer from "@/components/common/Footer";
import NavBar from "@/components/common/NavBar";
import {
    GuestCard,
    GuestContainer,
    GuestPageHeader,
    GuestPageShell,
} from "@/components/guest";
import AccommodationCardView from "@/components/pageComponents/Accommodation/AccommodationCardView";
import Chatbot from "@/components/pageComponents/Chatbot";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useGetAccommodationsQuery } from "@/hooks/admin/accommodation.hook";
import { toDateOnly } from "@/lib/date.util";
import type { Accommodation } from "@/types/admin/accommodation.type";
import { format, startOfToday } from "date-fns";
import {
    AlertTriangle,
    BedDouble,
    CalendarDays,
    RefreshCcw,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";

type StayFilter = "DayStay" | "Overnight" | "22 Hours" | "12 Hours";

const typeOptions: Array<{ value: Accommodation["type"] | "All"; label: string }> = [
    { value: "All", label: "All" },
    { value: "Room", label: "Room" },
    { value: "Cottage", label: "Cottage" },
    { value: "EventHall", label: "Event Hall" },
];

const stayOptions: StayFilter[] = ["DayStay", "Overnight", "22 Hours", "12 Hours"];

const AccommodationList = () => {
    const [selectedType, setSelectedType] = useState<Accommodation["type"] | "All">("All");
    const [selectedStay, setSelectedStay] = useState<StayFilter>();
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
    const navigate = useNavigate();

    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
    } = useGetAccommodationsQuery({
        type: selectedType === "All" ? undefined : selectedType,
        date: selectedDate ? toDateOnly(selectedDate) : undefined,
        page: 1,
        limit: 100,
    });

    const accommodations = useMemo(() => {
        if (!selectedStay) return data?.data ?? [];

        const normalizedSelected = selectedStay.toLowerCase().replace(/\s/g, "");

        return (data?.data ?? []).filter((accommodation) =>
            accommodation.stayOptions?.some((option) =>
                `${option.label} ${option.code} ${option.durationHours ?? ""}`
                    .toLowerCase()
                    .replace(/\s/g, "")
                    .includes(normalizedSelected)
            )
        );
    }, [data?.data, selectedStay]);

    const hasFilters = selectedType !== "All" || !!selectedStay || !!selectedDate;

    const clearFilters = () => {
        setSelectedType("All");
        setSelectedStay(undefined);
        setSelectedDate(undefined);
    };

    return (
        <GuestPageShell className="bg-background">
            <NavBar />

            <GuestContainer className="pb-12">
                <GuestPageHeader
                    title="Our Accommodations"
                    className="pb-3 md:pb-4"
                />

                <div className="mb-7 border-b py-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                        <Popover open={isDateFilterOpen} onOpenChange={setIsDateFilterOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="justify-start sm:w-auto">
                                    <CalendarDays className="size-4" />
                                    {selectedDate ? format(selectedDate, "MMM d, yyyy") : "Select Date"}
                                    {selectedStay ? ` · ${selectedStay}` : null}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={setSelectedDate}
                                    disabled={{ before: startOfToday() }}
                                />
                                <div className="border-t p-3">
                                    <p className="mb-2 text-xs font-medium text-muted-foreground">
                                        Stay option
                                    </p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {stayOptions.map((option) => (
                                            <Button
                                                key={option}
                                                type="button"
                                                size="sm"
                                                variant={selectedStay === option ? "default" : "outline"}
                                                className="w-full"
                                                onClick={() => setSelectedStay((current) => current === option ? undefined : option)}
                                            >
                                                {option}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>

                        <div className="flex gap-2 overflow-x-auto pb-1">
                            {typeOptions.map((option) => (
                                <Button
                                    key={option.value}
                                    type="button"
                                    size="sm"
                                    variant={selectedType === option.value ? "default" : "outline"}
                                    className="shrink-0"
                                    onClick={() => setSelectedType(option.value)}
                                >
                                    {option.label}
                                </Button>
                            ))}
                        </div>

                        <Button
                            type="button"
                            variant="link"
                            size="sm"
                            className="ml-0 h-auto px-0 sm:ml-auto"
                            disabled={!hasFilters}
                            onClick={clearFilters}
                        >
                            Clear Filters
                        </Button>
                    </div>
                </div>

                {isError ? (
                    <GuestCard>
                        <Empty>
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <AlertTriangle className="h-5 w-5" />
                                </EmptyMedia>
                                <EmptyTitle>Unable to load accommodations</EmptyTitle>
                                <EmptyDescription>
                                    {(error as Error)?.message || "We couldn't load accommodations right now."}
                                </EmptyDescription>
                            </EmptyHeader>
                            <EmptyContent>
                                <Button onClick={() => refetch()}>
                                    <RefreshCcw className="h-4 w-4" />
                                    Retry
                                </Button>
                            </EmptyContent>
                        </Empty>
                    </GuestCard>
                ) : isLoading && !data ? (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <GuestCard key={index} padded={false} className="overflow-hidden shadow-none">
                                <div className="aspect-[16/10] animate-pulse bg-muted" />
                                <div className="space-y-3 p-5">
                                    <div className="h-5 w-2/3 rounded bg-muted" />
                                    <div className="h-4 w-full rounded bg-muted" />
                                    <div className="h-4 w-5/6 rounded bg-muted" />
                                    <div className="h-9 w-full rounded bg-muted" />
                                </div>
                            </GuestCard>
                        ))}
                    </div>
                ) : accommodations.length === 0 ? (
                    <GuestCard>
                        <Empty>
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <BedDouble className="h-5 w-5" />
                                </EmptyMedia>
                                <EmptyTitle>No stays found</EmptyTitle>
                                <EmptyDescription>
                                    {selectedDate
                                        ? `No accommodations match your filters on ${format(selectedDate, "MMMM d, yyyy")}.`
                                        : "Try changing the stay type or accommodation type filter."}
                                </EmptyDescription>
                            </EmptyHeader>
                            <EmptyContent>
                                <Button onClick={clearFilters}>Clear Filters</Button>
                            </EmptyContent>
                        </Empty>
                    </GuestCard>
                ) : (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {accommodations.map((accommodation) => (
                            <AccommodationCardView
                                key={accommodation.id}
                                accommodation={accommodation}
                                viewDetailsClick={() => navigate(`/accommodation/${accommodation.id}`)}
                            />
                        ))}
                    </div>
                )}
            </GuestContainer>

            <Footer />
            <Chatbot />
        </GuestPageShell>
    );
};

export default AccommodationList;
