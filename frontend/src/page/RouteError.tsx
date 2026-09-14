import Footer from "@/features/public/layout/components/Footer";
import NavBar from "@/features/public/layout/components/NavBar";
import { GuestContainer, GuestPageShell } from "@/features/public/layout/components/guest";
import StatusPageCard from "@/components/common/StatusPageCard";
import { cn } from "@/lib/utils";
import { isRouteErrorResponse, useRouteError } from "react-router";

type RouteErrorPageProps = {
    embedded?: boolean;
};

const RouteErrorPage = ({ embedded = false }: RouteErrorPageProps) => {
    const error = useRouteError();

    const title = isRouteErrorResponse(error)
        ? `${error.status} ${error.statusText}`
        : "Something went wrong";

    const message = isRouteErrorResponse(error)
        ? typeof error.data === "string" && error.data.trim()
            ? error.data
            : "The router could not finish loading this page."
        : error instanceof Error && error.message
            ? error.message
            : "An unexpected routing error happened while loading this page.";

    const actions = [
        { label: "Back to Home", to: "/" },
        { label: "Go to Login", to: "/login", variant: "outline" as const },
    ];

    if (!embedded) {
        return (
            <GuestPageShell className="bg-background">
                <NavBar />
                <GuestContainer className="flex flex-1 items-center justify-center py-10">
                    <StatusPageCard
                        code={isRouteErrorResponse(error) ? String(error.status) : "500"}
                        title={title}
                        message={message}
                        actions={actions}
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
                code={isRouteErrorResponse(error) ? String(error.status) : "500"}
                title={title}
                message={message}
                actions={actions}
            />
        </div>
    );
};

export default RouteErrorPage;
