import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Field, FieldContent, FieldDescription, FieldLabel, FieldTitle } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Bed,
    Calendar,
    Car,
    CheckCircle,
    Coffee,
    Dumbbell,
    House,
    Info,
    Tv,
    Users,
    UtensilsCrossed,
    Waves,
    Wifi,
    Wind
} from 'lucide-react';

const AccommodationView = () => {

    const accommodation = {
        id: 'ACC-001',
        name: 'Deluxe Beachfront Cottage',
        type: 'Cottage',
        price: 3500,
        capacity: 4,
        bedrooms: 2,
        size: 45,
        description: 'Experience ultimate coastal luxury in our Deluxe Beachfront Cottage. Wake up to stunning ocean views and enjoy direct beach access just steps from your door. This spacious cottage features modern amenities, comfortable furnishings, and a private veranda perfect for watching breathtaking sunsets. Ideal for families or small groups seeking a peaceful getaway with all the comforts of home.',
        images: [
            'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200',
            // 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200',
            // 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200',
            // 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200',
            // 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200',
        ],
        amenities: [
            { icon: Wind, label: 'Air Conditioning', description: 'Climate control for your comfort' },
            { icon: Wifi, label: 'Free WiFi', description: 'High-speed internet access' },
            { icon: Tv, label: 'Smart TV', description: '55" with cable channels' },
            { icon: Coffee, label: 'Coffee Maker', description: 'Fresh coffee anytime' },
            { icon: Bed, label: 'Premium Bedding', description: 'Hotel-quality linens' },
            { icon: Waves, label: 'Beach Access', description: 'Private beach just steps away' },
        ],
        resortFacilities: [
            { icon: UtensilsCrossed, label: 'Restaurant', description: 'Filipino and international cuisine' },
            { icon: Waves, label: 'Swimming Pool', description: 'Infinity pool with ocean view' },
            { icon: Car, label: 'Parking', description: 'Free parking for guests' },
            { icon: Dumbbell, label: 'Fitness Center', description: 'Modern gym equipment' },
        ],
        location: 'Beachfront, North Wing',
        checkIn: '2:00 PM',
        checkOut: '12:00 PM',
    };

    const bookedDate = [
        new Date(2026, 2, 27),
        new Date(2026, 2, 24),
        new Date(2026, 2, 28),
        new Date(2026, 2, 29),
    ]

    return (
        <div style={{ backgroundColor: '#F1F5F9' }}>
            <div className="relative bg-black">
                {accommodation.images.map((image, index) => (
                    <div key={index} className="relative">
                        <div className="h-100 md:h-125 lg:h-150">
                            <img
                            src={image}
                            alt={`${accommodation.name} - Image ${index + 1}`}
                            className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
                <div className="grid lg:grid-cols-3 gap-8">

                    <div className="lg:col-span-2 space-y-6">

                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border-2">

                            <h1 className="text-3xl md:text-4xl font-bold mb-4">
                                {accommodation.name}
                            </h1>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-primary/20">
                                        <House className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Type
                                        </p>
                                        <p className="font-bold">
                                            {accommodation.type}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-primary/20">
                                        <Users className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Capacity
                                        </p>
                                        <p className="font-bold">
                                            {accommodation.capacity} Guests
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-primary/20">
                                        <Bed className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Bedrooms
                                        </p>
                                        <p className="font-bold">
                                            {accommodation.bedrooms} Rooms
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border-2">
                            <h2 className="text-2xl font-bold mb-4">
                                About This Accommodation
                            </h2>
                            <p className="text-base leading-relaxed text-muted-foreground">
                                {accommodation.description}
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border-2">
                            <h2 className="text-2xl font-bold mb-6">
                                Amenities & Features
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {accommodation.amenities.map((amenity, index) => {
                                    const Icon = amenity.icon;

                                    return (
                                        <div key={index} className="flex items-start gap-4 p-4 rounded-xl border-2 hover:shadow-md transition-all">
                                            <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0 bg-primary/20">
                                                <Icon className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold mb-1">
                                                    {amenity.label}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {amenity.description}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border-2">
                            <h2 className="text-2xl font-bold mb-6">
                                Resort Facilities
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {accommodation.resortFacilities.map((facility, index) => {
                                    const Icon = facility.icon;
                                    
                                    return (
                                        <div key={index} className="flex items-start gap-4 p-4 rounded-xl border-2 hover:shadow-md transition-all">
                                            <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0 bg-primary/20">
                                                <Icon className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold mb-1">
                                                    {facility.label}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {facility.description}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border-2">
                            <h2 className="text-2xl font-bold mb-6">
                                Virtual Tour
                            </h2>
                            <div className="relative h-64 md:h-96 rounded-xl overflow-hidden flex items-center justify-center bg-muted">
                                <div className="text-center">
                                    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 bg-primary/20">
                                        <Info className="w-10 h-10 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">
                                        360° Virtual Tour
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Interactive virtual tour coming soon
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="lg:col-span-1">
                        <div className="sticky top-24">

                            <div className="bg-white rounded-2xl p-6 shadow-xl border-2">

                                <div className="mb-6">
                                    <div className="flex items-baseline gap-2 mb-1">
                                        <span className="text-4xl font-bold text-primary">
                                            ₱{accommodation.price.toLocaleString()}
                                        </span>
                                        <span className="text-sm text-muted-foreground">
                                            / night
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Plus applicable taxes and fees
                                    </p>
                                </div>

                                <div className="rounded-xl mb-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Calendar className="w-5 h-5 text-primary" />
                                        <span className="font-semibold text-sm">
                                            Check-in & Check-out
                                        </span>
                                    </div>
                                    <RadioGroup>
                                        <FieldLabel htmlFor="OverNight">
                                            <Field orientation="horizontal">
                                                <FieldContent>
                                                    <FieldTitle>Over Night</FieldTitle>
                                                    <FieldDescription>
                                                        12:00 PM to 1:00 AM
                                                    </FieldDescription>
                                                </FieldContent>
                                                <RadioGroupItem value="overnight" id="OverNight" />
                                            </Field>
                                        </FieldLabel>

                                        <FieldLabel htmlFor="DayStay">
                                            <Field orientation="horizontal">
                                                <FieldContent>
                                                    <FieldTitle>Day Stay</FieldTitle>
                                                    <FieldDescription>
                                                        1:00 AM to 11:00 PM
                                                    </FieldDescription>
                                                </FieldContent>
                                                <RadioGroupItem value="daystay" id="DayStay" /> 
                                            </Field>
                                        </FieldLabel>
                                    </RadioGroup>
                                </div>

                                
                                <CalendarComponent 
                                className="w-full sm:w-auto mb-4 border rounded-xl"
                                mode="single"
                                defaultMonth={new Date()}
                                selected={new Date()}
                                onSelect={() => undefined}
                                disabled={bookedDate}
                                modifiers={{
                                    booked: bookedDate
                                }}
                                modifiersClassNames={{
                                    booked: '[&>button]:bg-red-700 text-white pointer-events-none ',  
                                }}
                                />

                                <Button className="w-full">
                                    <Calendar className="w-6 h-6" />
                                    Book Now
                                </Button>

                                <div className="mt-6 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5" style={{ color: '#059669' }} />
                                        <span className="text-sm" style={{ color: '#4B5563' }}>
                                            Free cancellation up to 48 hours
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5" style={{ color: '#059669' }} />
                                        <span className="text-sm" style={{ color: '#4B5563' }}>
                                            Best price guarantee
                                        </span>
                                    </div> 
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5" style={{ color: '#059669' }} />
                                        <span className="text-sm" style={{ color: '#4B5563' }}>
                                            Instant booking confirmation
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 mt-6">
                                <h3 className="font-bold mb-2">
                                    Need Help?
                                </h3>
                                <p className="text-sm mb-2 text-muted-foreground">
                                    Our team is here to assist you with your booking
                                </p>
                                <Button variant="outline" className="w-full">
                                    Contact Us
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    </div>
    )
}

export default AccommodationView