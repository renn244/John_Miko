import Footer from "@/components/common/Footer";
import NavBar from "@/components/common/NavBar";
import {
    GuestCard,
    GuestContainer,
    GuestInfoChip,
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
import {
    AlertTriangle,
    BedDouble,
    CalendarDays,
    Home,
    PartyPopper,
    RefreshCcw,
} from "lucide-react";
import { format, startOfToday } from "date-fns";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";

type StayFilter = "All" | "DayStay" | "Overnight" | "22 Hours" | "12 Hours";

const typeOptions: Array<{ value: Accommodation["type"] | "All"; label: string }> = [
    { value: "All", label: "All" },
    { value: "Room", label: "Room" },
    { value: "Cottage", label: "Cottage" },
    { value: "EventHall", label: "Event Hall" },
];

const stayOptions: StayFilter[] = ["All", "DayStay", "Overnight", "22 Hours", "12 Hours"];

const AccommodationList = () => {
    const [selectedType, setSelectedType] = useState<Accommodation["type"] | "All">("All");
    const [selectedStay, setSelectedStay] = useState<StayFilter>("All");
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

    const { data: allAccommodationData } = useGetAccommodationsQuery({
        page: 1,
        limit: 100,
    });

    const accommodations = useMemo(() => {
        if (selectedStay === "All") return data?.data ?? [];

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

    const allAccommodations = allAccommodationData?.data ?? data?.data ?? [];
    const roomCount = allAccommodations.filter((item) => item.type === "Room").length;
    const cottageCount = allAccommodations.filter((item) => item.type === "Cottage").length;
    const eventHallCount = allAccommodations.filter((item) => item.type === "EventHall").length;
    const hasFilters = selectedType !== "All" || selectedStay !== "All" || !!selectedDate;

    const clearFilters = () => {
        setSelectedType("All");
        setSelectedStay("All");
        setSelectedDate(undefined);
    };

    return (
        <GuestPageShell>
            <NavBar />

            <GuestContainer className="pb-12">
                <GuestPageHeader
                    title="Our Accommodations"
                />

                <div className="mb-6 flex flex-wrap gap-3">
                    <GuestInfoChip>
                        <BedDouble className="size-3.5" />
                        {roomCount} Rooms
                    </GuestInfoChip>
                    <GuestInfoChip>
                        <Home className="size-3.5" />
                        {cottageCount} Cottages
                    </GuestInfoChip>
                    <GuestInfoChip>
                        <PartyPopper className="size-3.5" />
                        {eventHallCount} Event Halls
                    </GuestInfoChip>
                </div>

                <div className="mb-7 border-y py-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                        <Popover open={isDateFilterOpen} onOpenChange={setIsDateFilterOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="justify-start lg:w-auto">
                                    <CalendarDays className="size-4" />
                                    {selectedDate ? format(selectedDate, "MMM d, yyyy") : "Select Date"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={(date) => {
                                        setSelectedDate(date);
                                        setIsDateFilterOpen(false);
                                    }}
                                    disabled={{ before: startOfToday() }}
                                />
                            </PopoverContent>
                        </Popover>

                        <div className="hidden h-7 w-px bg-border lg:block" />

                        <div className="flex gap-2 overflow-x-auto pb-1">
                            {stayOptions.map((option) => (
                                <Button
                                    key={option}
                                    type="button"
                                    size="sm"
                                    variant={selectedStay === option ? "default" : "outline"}
                                    className="shrink-0"
                                    onClick={() => setSelectedStay(option)}
                                >
                                    {option === "All" ? "All Stays" : option}
                                </Button>
                            ))}
                        </div>

                        <div className="hidden h-7 w-px bg-border lg:block" />

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
                            className="ml-0 px-0 lg:ml-auto"
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
