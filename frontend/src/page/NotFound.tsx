import Footer from "@/features/public/layout/components/Footer";
import NavBar from "@/features/public/layout/components/NavBar";
import { GuestContainer, GuestPageShell } from "@/features/public/layout/components/guest";
import StatusPageCard from "@/components/common/StatusPageCard";
import { cn } from "@/lib/utils";

type NotFoundPageProps = {
    title?: string;
    message?: string;
    embedded?: boolean;
    homeTo?: string;
    homeLabel?: string;
};

const NotFoundPage = ({
    title = "Page not found",
    message = "The page you are trying to open does not exist or may have been moved.",
    embedded = false,
    homeTo = "/",
    homeLabel = "Back to Home",
}: NotFoundPageProps) => {
    if (!embedded) {
        return (
            <GuestPageShell className="bg-background">
                <NavBar />
                <GuestContainer className="flex flex-1 items-center justify-center py-10">
                    <StatusPageCard
                        code="404"
                        title={title}
                        message={message}
                        actions={[
                            { label: homeLabel, to: homeTo },
                            { label: "Go to Login", to: "/login", variant: "outline" },
                        ]}
                    />
                </GuestContainer>
                <Footer />
            </GuestPageShell>
        );
    }

    return (
        <div
            className={cn(
                "flex px-4 py-10",
                "min-h-[calc(100vh-12rem)] items-center justify-center lg:py-14",
            )}
        >
            <StatusPageCard
                code="404"
                title={title}
                message={message}
                actions={[
                    { label: homeLabel, to: homeTo },
                    { label: "Go to Login", to: "/login", variant: "outline" },
                ]}
            />
        </div>
    );
};

export default NotFoundPage;
