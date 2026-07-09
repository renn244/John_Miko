import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import LoadingSpinner from "@/components/ui/loadingSpinner"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGetAccommodationOptionsQuery } from "@/hooks/admin/accommodation.hook"
import { useBookingSearch } from "@/hooks/admin/booking.search"
import useDebounce from "@/lib/useDebounce"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Search, X } from "lucide-react"
import { useEffect, useState } from "react"

const BookingFilter = () => {
    const { 
        status, paymentType, bookingDate,
        updateStatus, updatePaymentType, updateBookingDate,
        clearFilters
    } = useBookingSearch();

    return (
        <div className="border-b bg-card px-4 py-3">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">

                <SearchBookingFilter />

                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center xl:ml-4 xl:flex-nowrap xl:justify-end xl:gap-2 xl:self-start">
                    <AccommodationBookingFilter />

                    <div className="relative w-full sm:w-auto">
                        <Select value={status || ""} onValueChange={(value) => updateStatus(value)}>
                            <SelectTrigger className="w-full sm:w-auto">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Status</SelectLabel>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="relative w-full sm:w-auto">
                        <Select value={paymentType || ""} onValueChange={(value) => updatePaymentType(value)}>
                            <SelectTrigger className="w-full sm:w-auto">
                                <SelectValue placeholder="Payment Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Payment Type</SelectLabel>
                                    <SelectItem value="all">All Payment Types</SelectItem>
                                    <SelectItem value="Partial">50% Downpayment</SelectItem>
                                    <SelectItem value="Full">Full Payment</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                            variant="outline"
                            data-empty={!bookingDate}
                            className="w-full justify-start text-left font-normal data-[empty=true]:text-muted-foreground sm:w-auto"
                            >
                                <CalendarIcon />
                                {bookingDate ? format(new Date(bookingDate), 'PPP') : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                            mode="single"
                            selected={bookingDate ? new Date(bookingDate) : undefined}
                            onSelect={(date) => {
                                updateBookingDate(date)
                            }}
                            />
                        </PopoverContent>
                    </Popover>

                    <Button
                    onClick={() => clearFilters()}
                    variant="ghost"
                    className="justify-start whitespace-nowrap text-primary hover:text-primary"
                    >
                        <X className="size-4" />
                        Clear Filters
                    </Button>
                </div>
            </div>
        </div>
    )
}

const SearchBookingFilter = () => {
    const { search, updateSearch } = useBookingSearch();
    const [searchInput, setSearchInput] = useState(search || "");
    const debounceValue = useDebounce(searchInput, 500);

    useEffect(() => {
        if(debounceValue !== search) {
            updateSearch(debounceValue);
        }
    }, [debounceValue])

    return (
        <div className="relative w-full xl:max-w-xl xl:flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
            placeholder="Search by guest name or booking reference..."
            />
        </div>
    )
}

const AccommodationBookingFilter = () => {
    const { accommodationId, updateAccommodationId } = useBookingSearch();

    const { data: options, isLoading } = useGetAccommodationOptionsQuery();

    return (
        <div className="relative w-full sm:w-auto">
            <Select value={accommodationId || ""} onValueChange={(value) => updateAccommodationId(value)}>
                <SelectTrigger className="w-full sm:w-auto">
                    <SelectValue placeholder="Accommodation" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Accommodations</SelectLabel>
                        <SelectItem value="all">All Accommodations</SelectItem>
                        {isLoading ? (
                            <SelectItem value="loading" disabled>
                                <LoadingSpinner />
                            </SelectItem>
                        ) : (
                            options?.map((option) => (
                                <SelectItem key={option.id} value={option.id}>
                                    {option.name}
                                </SelectItem>
                            ))
                        )}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    )
}

export default BookingFilter
