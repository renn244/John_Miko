import NavBar from "@/components/common/NavBar"
import Chatbot from "@/components/pageComponents/Chatbot"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Calendar, CheckCircle, ChevronRight, Clock, CreditCard, Mail, MapPin, Phone, Shield, Star, Utensils } from "lucide-react"
import { Link } from "react-router"

const Home = () => {

    const faqs = [
        {
            question: "Is overnight stay allowed?",
            answer: "Yes! Day use: 8 AM - 6 PM. Overnight: Check-in 2 PM, Check-out 12 PM.",
        },
        {
            question: "Is corkage allowed?",
            answer: "Yes. Corkage: ₱200 per dish, ₱150 per bottle. Pre-ordering from our restaurant is encouraged.",
        },
        {
            question: "What payment methods do you accept?",
            answer: "Cash, Bank Transfer, GCash, PayMaya, and PayMongo. 50% down payment required.",
        },
        {
            question: "Is reservation required on weekends?",
            answer: "Yes, advance reservation is highly recommended for weekends, holidays, and peak season.",
        },
        {
            question: "Can I bring additional guests beyond capacity?",
            answer: "No. Each accommodation has a maximum capacity for safety. Please book multiple units if needed.",
        },
        {
            question: "What are your pool rules?",
            answer: "Free pool access for all guests. Children must be supervised. Swimming attire required. No glass containers.",
        },
    ];

    return (
        <div className="min-h-screen relative">
            <NavBar />

            <section className="relative h-175 overflow-hidden">
                <img
                src="https://images.unsplash.com/photo-1729707691048-722c1acf5c51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiZWFjaCUyMHJlc29ydCUyMHBvb2x8ZW58MXx8fHwxNzcyMDk4MDA5fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="John Miko's Place Resort"
                className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/40 to-black/60">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col items-center justify-center text-center">
                        <div className="text-white max-w-4xl">
                            <h1 className="text-6xl md:text-7xl font-bold mb-6">
                                John Miko's Place Resort
                            </h1>
                            <p className="text-xl md:text-2xl mb-4 text-white/95 font-light">
                                Your Perfect Coastal Paradise
                            </p>
                            <p className="text-lg mb-10 text-white/90 max-w-2xl mx-auto">
                                Experience pristine beaches, modern accommodations, and exceptional hospitality.
                                Perfect for families, groups, and celebrations.
                            </p>

                            <Link to="/accommodation">
                                <Button size="lg">
                                    Book Your Stay Now
                                    <ChevronRight className="w-6 h-6" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-white border-b-2">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full flex items-center justify-center bg-blue-100">
                                <Clock className="w-7 h-7 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm">2 Time Slot in a day</p>
                                <p className="text-sm text-muted-foreground">DayStay / OverNight</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full flex items-center justify-center bg-emerald-100">
                                <CreditCard className="w-7 h-7 text-emerald-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm">Payment Required</p>
                                <p className="text-sm text-muted-foreground">50% Down Payment</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full flex items-center justify-center bg-amber-100">
                                <Calendar className="w-7 h-7 text-amber-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm">Booking Feature</p>
                                <p className="text-sm text-muted-foreground">Easy and Convenient Booking Process</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">
                                Your Coastal Getaway Awaits
                            </h2>
                            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                                Nestled along the beautiful coastline, John Miko's Place Resort offers a serene escape 
                                with modern amenities, comfortable accommodations, and exceptional hospitality. Whether 
                                you're planning a family vacation, group event, or romantic getaway, we have everything 
                                you need for an unforgettable stay.
                            </p>
                            <div className="flex items-center justify-center gap-8 text-sm">
                                <div className="flex items-center gap-2 text-primary">
                                    <Star className="w-5 h-5 fill-current" />
                                    <span className="font-semibold">Premium Quality</span>
                                </div>
                                <div className="flex items-center gap-2 text-primary">
                                    <CheckCircle className="w-5 h-5" />
                                    <span className="font-semibold">Verified Resort</span>
                                </div>
                                <div className="flex items-center gap-2 text-primary">
                                    <Shield className="w-5 h-5 fill-current" />
                                    <span className="font-semibold">Safe & Secure</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            Important Policies
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Please review before booking
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div className="bg-linear-to-br from-blue-50 to-white rounded-2xl p-8 border-2 border-blue-200">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-blue-600">
                                    <Clock className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-2">
                                        Check-in & Check-out
                                    </h3>
                                    <ul className="space-y-1 text-sm text-muted-foreground">
                                        <li>• Overnight: Check-in 2:00 PM, Check-out 12:00 PM</li>
                                        <li>• Day Use: 8:00 AM - 6:00 PM (cottages only)</li>
                                        <li>• Early check-in subject to availability</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="bg-linear-to-br from-green-50 to-white rounded-2xl p-8 border-2 border-emerald-200">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-emerald-600">
                                    <CreditCard className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-2">
                                        Payment Methods
                                    </h3>
                                    <ul className="space-y-1 text-sm text-muted-foreground">
                                        <li>• Cash, Bank Transfer, GCash, PayMaya, PayMongo</li>
                                        <li>• 50% down payment required to confirm booking</li>
                                        <li>• Balance payable upon check-in</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="bg-linear-to-br from-orange-50 to-white rounded-2xl p-8 border-2 border-orange-200">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-orange-500">
                                    <Utensils className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-2">
                                        Corkage Policy
                                    </h3>
                                    <ul className="space-y-1 text-sm text-muted-foreground">
                                        <li>• Outside food allowed: ₱200 per dish/viand</li>
                                        <li>• Outside drinks allowed: ₱150 per bottle</li>
                                        <li>• Pre-order from our restaurant recommended</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="bg-linear-to-br from-purple-50 to-white rounded-2xl p-8 border-2 border-purple-200">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-purple-600">
                                    <Calendar className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-2">
                                        Reservation Policy
                                    </h3>
                                    <ul className="space-y-1 text-sm text-muted-foreground">
                                        <li>• Advanced booking required for weekends/holidays</li>
                                        <li>• Walk-ins subject to availability</li>
                                        <li>• Capacity limits strictly enforced for safety</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <section className="py-20 bg-muted/40">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Quick answers to common questions
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border-2 border-border p-2">
                        <Accordion type="single" collapsible className="w-full">
                            {faqs.map((faq, index) => (
                                <AccordionItem key={index} value={`item-${index}`} className="border-0">
                                    <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted rounded-xl transition-colors">
                                        <span className="font-semibold text-left">
                                            {faq.question}
                                        </span>
                                    </AccordionTrigger>
                                    <AccordionContent className="px-6 pb-4 pt-0">
                                        <p className="text-muted-foreground">
                                            {faq.answer}
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </section>

            <section className="py-24 relative overflow-hidden">
                <img
                src="https://images.unsplash.com/photo-1758117638619-42ab7021183b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNvcnQlMjBjb3R0YWdlJTIwcG9vbCUyMHZpZXd8ZW58MXx8fHwxNzcyMTAwMTAxfDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Resort View"
                className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-primary/60" />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center text-white">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            Ready to Book Your Escape?
                        </h2>
                        <p className="text-xl mb-10 text-white/95">
                            Start planning your perfect coastal getaway today. Check availability and secure your reservation now.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/accommodation">
                                <Button size="lg">
                                    Check Availability
                                    <Calendar className="w-6 h-6" />
                                </Button>
                            </Link>
                            <Link to="/accommodations">
                                <Button size="lg" variant="outline" className="text-black">
                                    View All Accommodations
                                    <ChevronRight className="w-6 h-6" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center bg-blue-50">
                                <MapPin className="w-7 h-7 text-blue-700" />
                            </div>
                            <h3 className="font-bold mb-2">
                                Location
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Purok 6, Sentinela Rd., Pulong Yantok, <br />  Angat, Bulacan, Philippines
                            </p>
                        </div>
                        <div>
                            <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center bg-blue-50">
                                <Phone className="w-7 h-7 text-blue-700" />
                            </div>
                            <h3 className="font-bold mb-2">
                                Phone
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                +63 123 456 7890
                            </p>
                        </div>
                        <div>
                            <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center bg-blue-50">
                                <Mail className="w-7 h-7 text-blue-700" />
                            </div>
                            <h3 className="font-bold mb-2">
                                Email
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                info@johnmikosplace.com
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Chatbot */}
            <Chatbot />
        </div>
    )
}

export default Home