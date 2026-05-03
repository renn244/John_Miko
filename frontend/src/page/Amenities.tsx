import Footer from "@/components/common/Footer"
import NavBar from "@/components/common/NavBar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BadgeCheck, Calendar, Car, ChevronRight, Coffee, ConciergeBell, Droplets, Fence, Info, MapPin, ShieldCheck, Users } from "lucide-react"
import { Link } from "react-router"

const Amenities = () => {
    return (
        <div className="min-h-screen">
            <NavBar />

            <section className="relative h-72 md:h-96 overflow-hidden">
                <img
                src="https://images.unsplash.com/photo-1501117716987-c8e2a8e8b1c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcml2YXRlJTIwcmVzb3J0JTIwcG9vbHxlbnwxfHx8fDE3NzY3NzQ0NTZ8MA&ixlib=rb-4.1.0&q=80&w=1600"
                alt="Amenities at John Miko's Place Resort"
                className="w-full h-full object-cover"
                loading="eager"
                fetchPriority="high"
                />

                <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/45 to-black/70">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
                        <div className="max-w-2xl text-white">
                            <h1 className="text-4xl md:text-5xl font-bold mb-3">Amenities</h1>
                            <p className="text-base md:text-lg text-white/90">
                                Everything you need for a relaxing staycation—whether you’re here for a day tour, overnight stay, or a special celebration.
                            </p>
                            <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                <Link to="/accommodation">
                                    <Button size="lg">
                                        Browse Accommodations
                                        <ChevronRight className="w-5 h-5" />
                                    </Button>
                                </Link>
                                <Link to="/about">
                                    <Button
                                    size="lg"
                                    variant="secondary"
                                    >
                                        Learn About Us <Info className="h-6 w-6" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                                <Droplets className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="font-semibold">Pool Access</p>
                                <p className="text-sm text-muted-foreground">Enjoy a refreshing swim during your stay.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                                <ConciergeBell className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="font-semibold">Guest-Friendly Service</p>
                                <p className="text-sm text-muted-foreground">Support for bookings, questions, and policies.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                                <ShieldCheck className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="font-semibold">Safety & Cleanliness</p>
                                <p className="text-sm text-muted-foreground">Facilities maintained for a comfortable stay.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-14 bg-muted/40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <h2 className="text-3xl md:text-4xl font-bold">What you can enjoy</h2>
                        <p className="mt-3 text-base md:text-lg text-muted-foreground">
                            A simple list of the essentials guests ask about most—so you can plan your day tour or overnight stay with confidence.
                        </p>
                    </div>

                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Droplets className="w-5 h-5 text-primary" />
                                    Pools
                                </CardTitle>
                                <CardDescription>Swim time for families and groups.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex gap-2"><BadgeCheck className="w-4 h-4 text-primary mt-0.5" />Free pool access for guests</li>
                                    <li className="flex gap-2"><BadgeCheck className="w-4 h-4 text-primary mt-0.5" />Family-friendly swimming rules</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Coffee className="w-5 h-5 text-primary" />
                                    Food Options
                                </CardTitle>
                                <CardDescription>Pre-order or bring your favorites.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex gap-2"><BadgeCheck className="w-4 h-4 text-primary mt-0.5" />Pre-ordering from our restaurant is encouraged</li>
                                    <li className="flex gap-2"><BadgeCheck className="w-4 h-4 text-primary mt-0.5" />Outside food/drinks allowed with corkage</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Car className="w-5 h-5 text-primary" />
                                    Parking
                                </CardTitle>
                                <CardDescription>Convenient arrival and unloading.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex gap-2"><BadgeCheck className="w-4 h-4 text-primary mt-0.5" />On-site parking (subject to space)</li>
                                    <li className="flex gap-2"><BadgeCheck className="w-4 h-4 text-primary mt-0.5" />Ask staff for help with large group arrivals</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Fence className="w-5 h-5 text-primary" />
                                    Privacy
                                </CardTitle>
                                <CardDescription>Ideal for staycations and celebrations.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex gap-2"><BadgeCheck className="w-4 h-4 text-primary mt-0.5" />Private resort atmosphere</li>
                                    <li className="flex gap-2"><BadgeCheck className="w-4 h-4 text-primary mt-0.5" />Great for family time and reunions</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-primary" />
                                    Events
                                </CardTitle>
                                <CardDescription>Celebrate birthdays and milestones.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex gap-2"><BadgeCheck className="w-4 h-4 text-primary mt-0.5" />Group-friendly accommodations</li>
                                    <li className="flex gap-2"><BadgeCheck className="w-4 h-4 text-primary mt-0.5" />Capacity limits enforced for safety</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-primary" />
                                    Day Tour & Overnight
                                </CardTitle>
                                <CardDescription>Two time slots for flexible plans.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex gap-2"><BadgeCheck className="w-4 h-4 text-primary mt-0.5" />Day use: 8:00 AM – 6:00 PM (cottages)</li>
                                    <li className="flex gap-2"><BadgeCheck className="w-4 h-4 text-primary mt-0.5" />Overnight: Check-in 2:00 PM, Check-out 12:00 PM</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold">Planning your visit?</h2>
                            <p className="mt-3 text-base md:text-lg text-muted-foreground">
                                For weekends, holidays, and peak season, advance reservation is strongly recommended.
                                Browse accommodations and check availability to lock in your dates.
                            </p>
                            <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                <Link to="/accommodation">
                                    <Button size="lg">
                                        Check Availability
                                        <Calendar className="w-5 h-5" />
                                    </Button>
                                </Link>
                                <Link to="/about">
                                    <Button size="lg" variant="outline">
                                        Contact & Location
                                        <MapPin className="w-5 h-5" />
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className="rounded-2xl overflow-hidden border">
                            <img
                            src="https://images.unsplash.com/photo-1519046904884-53103b34b206?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGF5Y2F0aW9uJTIwcmVzb3J0fGVufDF8fHx8MTc3Njc3NDU0M3ww&ixlib=rb-4.1.0&q=80&w=1600"
                            alt="Relaxing staycation vibe"
                            className="w-full h-72 md:h-96 object-cover"
                            loading="lazy"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default Amenities