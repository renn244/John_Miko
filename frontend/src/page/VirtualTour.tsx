import Footer from "@/components/common/Footer";
import NavBar from "@/components/common/NavBar";
import VirtualTourViewer from "@/components/pageComponents/VirtualTour/VirtualTourViewer";
import { GuestCard, GuestContainer, GuestPageShell, GuestSection } from "@/components/guest";
import { Button } from "@/components/ui/button";
import { VIRTUAL_TOUR_GUIDE_CARDS } from "@/lib/constant/VIRTUAL_TOUR.constant";
import { CalendarDays, ChevronRight } from "lucide-react";
import { Link } from "react-router";

const VirtualTour = () => (
    <GuestPageShell className="bg-background">
        <NavBar />

        <GuestContainer className="py-5 md:py-6">
            <div className="mx-auto max-w-6xl">
                <VirtualTourViewer />

                <GuestSection
                    compact
                    eyebrow="John Miko's Portal"
                    title="Explore the resort before you arrive"
                    description="Take the guided 360 degree route, discover each area, and get a feel for the resort before planning your stay."
                    actions={
                        <Button asChild size="sm">
                            <Link to="/accommodation">
                                Browse accommodations
                                <ChevronRight className="size-4" />
                            </Link>
                        </Button>
                    }
                >
                    <div className="grid gap-4 md:grid-cols-3">
                        {VIRTUAL_TOUR_GUIDE_CARDS.map(({ title, description, icon: Icon }) => (
                            <GuestCard key={title} className="p-4">
                                <div className="inline-flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <Icon className="size-4" />
                                </div>
                                <h3 className="mt-3 text-sm font-semibold text-foreground">{title}</h3>
                                <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
                            </GuestCard>
                        ))}
                    </div>
                    <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                        <CalendarDays className="size-3.5 text-primary" />
                        This is a sample guided route. Resort-specific scenes and details will be added with the final photography.
                    </p>
                </GuestSection>
            </div>
        </GuestContainer>

        <Footer />
    </GuestPageShell>
);

export default VirtualTour;
