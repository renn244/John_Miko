import Footer from "@/components/common/Footer"
import NavBar from "@/components/common/NavBar"
import Chatbot from "@/components/pageComponents/Chatbot"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { TIME_SLOT } from "@/lib/constant/TIME_SLOT.constant"
import {
    Calendar as CalendarIcon,
    CheckCircle,
    ChevronRight,
    Clock,
    CreditCard,
    Shield,
    Sparkles,
    Star,
    Utensils
} from "lucide-react"
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
    ]

    return (
        <div className="min-h-screen relative bg-background text-foreground">
            <NavBar />

            <section className="relative h-175 overflow-hidden">
                <img
                src="https://images.unsplash.com/photo-1729707691048-722c1acf5c51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiZWFjaCUyMHJlc29ydCUyMHBvb2x8ZW58MXx8fHwxNzcyMDk4MDA5fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="John Miko's Place Resort"
                className="w-full h-full object-cover"
                loading="eager"
                fetchPriority="high"
                />
        
                <div className="absolute inset-0 bg-linear-to-b from-black/55 via-black/45 to-black/75" />
        
                <div className="absolute inset-0">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
                        <div className="w-full text-white">
                            <div className="max-w-3xl">

                                <h1 className="mt-5 text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05]">
                                    John Miko&apos;s Place Resort
                                </h1>
                                <p className="mt-5 text-lg sm:text-xl md:text-2xl text-white/90 font-light">
                                    Book a DayStay or Overnight getaway in minutes.
                                </p>
                                <p className="mt-4 text-sm sm:text-base text-white/80 max-w-2xl">
                                    Comfortable accommodations, clear policies, and a simple booking flow—perfect for staycations, family bonding, and small celebrations.
                                </p>

                                <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                    <Link to="/accommodation" className="w-full sm:w-auto">
                                        <Button size="lg" className="w-full sm:w-auto">
                                            Browse Accommodations
                                            <ChevronRight className="w-6 h-6" />
                                        </Button>
                                    </Link>
                                    <Link to="/amenities" className="w-full sm:w-auto">
                                        <Button
                                        size="lg"
                                        variant="secondary"
                                        >
                                            View Amenities
                                            <Sparkles className="w-6 h-6" />
                                        </Button>
                                    </Link>
                                </div>

                                <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-white">
                                    <div className="rounded-2xl border border-white/15 bg-black/20 backdrop-blur-sm px-4 py-3">
                                        <div className="flex items-start gap-3">
                                            <div className="mt-0.5 w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                                                <Clock className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-[11px] uppercase tracking-wide text-white/70 font-semibold">DayStay hours</p>
                                                <p className="text-sm sm:text-[15px] font-semibold leading-snug">Check-in {TIME_SLOT.DAY_STAY.CHECK_IN} • Check-out {TIME_SLOT.DAY_STAY.CHECK_OUT}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-white/15 bg-black/20 backdrop-blur-sm px-4 py-3">
                                        <div className="flex items-start gap-3">
                                            <div className="mt-0.5 w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                                                <CalendarIcon className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-[11px] uppercase tracking-wide text-white/70 font-semibold">Overnight</p>
                                                <p className="text-sm sm:text-[15px] font-semibold leading-snug">Check-in {TIME_SLOT.OVERNIGHT.CHECK_IN} • Check-out {TIME_SLOT.OVERNIGHT.CHECK_OUT}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-white/15 bg-black/20 backdrop-blur-sm px-4 py-3 h-min">
                                        <div className="flex items-start gap-3">
                                            <div className="mt-0.5 w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                                                <CreditCard className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-[11px] uppercase tracking-wide text-white/70 font-semibold">Payment</p>
                                                <p className="text-sm sm:text-[15px] font-semibold leading-snug">50% down to confirm</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="rounded-3xl border bg-muted/20 p-6 md:p-8">
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                            <div>
                                <p className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">Booking</p>
                                <h3 className="mt-1 text-2xl md:text-3xl font-bold tracking-tight">At a glance</h3>
                                <p className="mt-1 text-sm md:text-base text-muted-foreground">
                                    Clear time slots, payment expectations, and the quick steps to confirm.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="rounded-2xl border bg-card p-5 transition-colors hover:bg-muted/30">
                                <div className="flex items-start gap-4">
                                    <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-primary/15 shrink-0">
                                        <Clock className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">Time Slots</p>
                                        <p className="mt-1 font-semibold leading-snug">DayStay or Overnight</p>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            DayStay {TIME_SLOT.DAY_STAY.CHECK_IN} – {TIME_SLOT.DAY_STAY.CHECK_OUT} <br/> 
                                            Overnight {TIME_SLOT.OVERNIGHT.CHECK_IN} – {TIME_SLOT.OVERNIGHT.CHECK_OUT}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl border bg-card p-5 transition-colors hover:bg-muted/30">
                                <div className="flex items-start gap-4">
                                    <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-primary/15 shrink-0">
                                        <CreditCard className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">Payment</p>
                                        <p className="mt-1 font-semibold leading-snug">50% down to confirm</p>
                                        <p className="mt-1 text-sm text-muted-foreground">Supported: Cash, Bank, GCash, PayMaya, PayMongo</p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl border bg-card p-5 transition-colors hover:bg-muted/30">
                                <div className="flex items-start gap-4">
                                    <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-primary/15 shrink-0">
                                        <CalendarIcon className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">Quick Steps</p>
                                        <p className="mt-1 font-semibold leading-snug">Select • Pick • Book</p>
                                        <p className="mt-1 text-sm text-muted-foreground">Choose a unit, pick a date, then select stay type.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 relative overflow-hidden">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -top-28 -right-28 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
                    <div className="absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                        <div className="lg:col-span-7">
                            <p className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">Experience</p>
                            <h2 className="mt-2 text-4xl md:text-5xl font-bold tracking-tight">Your Coastal Getaway Awaits</h2>
                            <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-2xl">
                                John Miko's Place Resort is a public space made for staycations, family bonding, and small celebrations.
                                With comfortable accommodations and guest-friendly policies, planning your visit is simple and stress-free.
                            </p>

                            <div className="mt-8 flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-sm">
                                    <CheckCircle className="w-4 h-4 text-primary" />
                                    Simple booking flow
                                </span>
                                <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-sm">
                                    <Shield className="w-4 h-4 text-primary" />
                                    Clear policies
                                </span>
                                <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-sm">
                                    <Star className="w-4 h-4 text-primary" />
                                    Guest-first experience
                                </span>
                            </div>
                        </div>

                        <div className="lg:col-span-5">
                            <div className="rounded-3xl border bg-muted/20 p-5 md:p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
                                    <div className="rounded-2xl border bg-card p-5">
                                        <div className="flex items-start gap-4">
                                            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-primary/15 shrink-0">
                                                <Star className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">Quality</p>
                                                <p className="mt-1 font-semibold leading-snug">Premium comfort</p>
                                                <p className="mt-1 text-sm text-muted-foreground">Clean spaces designed for rest and bonding.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border bg-card p-5">
                                        <div className="flex items-start gap-4">
                                            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-primary/15 shrink-0">
                                                <CheckCircle className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">Trust</p>
                                                <p className="mt-1 font-semibold leading-snug">Verified resort</p>
                                                <p className="mt-1 text-sm text-muted-foreground">Straightforward booking expectations and rules.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border bg-card p-5">
                                        <div className="flex items-start gap-4">
                                            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-primary/15 shrink-0">
                                                <Shield className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">Safety</p>
                                                <p className="mt-1 font-semibold leading-snug">Safe & secure</p>
                                                <p className="mt-1 text-sm text-muted-foreground">Capacity rules and guest safety come first.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-muted/20 relative overflow-hidden">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute inset-0 bg-linear-to-b from-transparent via-primary/5 to-transparent" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <div className="lg:col-span-4">
                            <p className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">Before You Book</p>
                            <h2 className="mt-2 text-4xl md:text-5xl font-bold tracking-tight">Important Policies</h2>
                            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                                Please review these quick guidelines so your booking is smooth and stress-free.
                            </p>

                            <div className="mt-6 rounded-3xl border bg-card p-5">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                                        <Shield className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">Quick note</p>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Weekend and holiday bookings are best made early.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="rounded-3xl p-6 md:p-7 border bg-card transition-colors hover:bg-muted/30">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-primary/15">
                                            <Clock className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">Check-in & Check-out</h3>
                                            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                                                <li>• Day Use: <br />
                                                    Check-in {TIME_SLOT.DAY_STAY.CHECK_IN} - 
                                                    Check-out {TIME_SLOT.DAY_STAY.CHECK_OUT}
                                                </li>
                                                <li>• Overnight: <br />
                                                    Check-in {TIME_SLOT.OVERNIGHT.CHECK_IN} - 
                                                    Check-out {TIME_SLOT.OVERNIGHT.CHECK_OUT}
                                                </li>
                                                <li>• Early check-in subject to availability</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-3xl p-6 md:p-7 border bg-card transition-colors hover:bg-muted/30">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-primary/15">
                                            <CreditCard className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">Payment Methods</h3>
                                            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                                                <li>• Cash, Bank Transfer, GCash, PayMaya, PayMongo</li>
                                                <li>• 50% down payment required to confirm booking</li>
                                                <li>• Balance payable upon check-in</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-3xl p-6 md:p-7 border bg-card transition-colors hover:bg-muted/30">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-primary/15">
                                            <Utensils className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">Corkage Policy</h3>
                                            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                                                <li>• Outside food allowed: ₱200 per dish/viand</li>
                                                <li>• Outside drinks allowed: ₱150 per bottle</li>
                                                <li>• Pre-order from our restaurant recommended</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-3xl p-6 md:p-7 border bg-card transition-colors hover:bg-muted/30">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-primary/15">
                                            <CalendarIcon className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">Reservation Policy</h3>
                                            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                                                <li>• Advanced booking required for weekends/holidays</li>
                                                <li>• Walk-ins subject to availability</li>
                                                <li>• Capacity limits strictly enforced for safety</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 relative overflow-hidden">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -top-28 -left-28 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                        <div className="lg:col-span-4">
                            <p className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">Help Center</p>
                            <h2 className="mt-2 text-4xl md:text-5xl font-bold tracking-tight">Frequently Asked Questions</h2>
                            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                                Quick answers to common questions about booking, payment, and policies.
                            </p>
                        </div>

                        <div className="lg:col-span-8">
                            <div className="bg-card rounded-3xl border p-2 sm:p-3">
                                <Accordion type="single" collapsible className="w-full">
                                    {faqs.map((faq, index) => (
                                        <AccordionItem
                                            key={index}
                                            value={`item-${index}`}
                                            className="border-0 border-b last:border-b-0"
                                        >
                                            <AccordionTrigger className="px-5 sm:px-6 py-4 hover:no-underline hover:bg-muted/60 rounded-2xl transition-colors">
                                                <span className="font-semibold text-left">{faq.question}</span>
                                            </AccordionTrigger>
                                            <AccordionContent className="px-5 sm:px-6 pb-5 pt-0">
                                                <p className="text-muted-foreground">{faq.answer}</p>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
            <Chatbot />
        </div>
    )
}

export default Home