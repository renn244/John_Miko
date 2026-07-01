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
        <div className="bg-white p-4 rounded-xl border-2">
            <div className="flex flex-col md:flex-row gap-4">

                <SearchBookingFilter />

                <AccommodationBookingFilter />

                <div className="relative">
                    <Select value={status || ""} onValueChange={(value) => updateStatus(value)}>
                        <SelectTrigger>
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

                <div className="relative">
                    <Select value={paymentType || ""} onValueChange={(value) => updatePaymentType(value)}>
                        <SelectTrigger>
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
                        className="w-70 justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
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

                <Button onClick={() => clearFilters()} variant="secondary">
                    <X className="w-4 h-4" />
                    Reset Filters
                </Button>
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
        <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-8"
            placeholder="Search by guest name or booking reference..."
            />
        </div>
    )
}

const AccommodationBookingFilter = () => {
    const { accommodationId, updateAccommodationId } = useBookingSearch();

    const { data: options, isLoading } = useGetAccommodationOptionsQuery();

    return (
        <div className="relative">
            <Select value={accommodationId || ""} onValueChange={(value) => updateAccommodationId(value)}>
                <SelectTrigger>
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
