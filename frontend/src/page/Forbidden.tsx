import Footer from "@/features/public/layout/components/Footer";
import NavBar from "@/features/public/layout/components/NavBar";
import { GuestContainer, GuestPageShell } from "@/features/public/layout/components/guest";
import StatusPageCard from "@/components/common/StatusPageCard";
import { useAuthContext } from "@/features/auth/context/AuthContext";
import { cn } from "@/lib/utils";

type ForbiddenPageProps = {
    embedded?: boolean;
};

const ForbiddenPage = ({ embedded = false }: ForbiddenPageProps) => {
    const { user } = useAuthContext();
    const actions = [
        {
            label: user?.role === "ADMIN" ? "Back to Overview" : "Back to Home",
            to: user?.role === "ADMIN" ? "/admin" : "/",
        },
        { label: "Go to Login", to: "/login", variant: "outline" as const },
    ];

    if (!embedded) {
        return (
            <GuestPageShell className="bg-background">
                <NavBar />
                <GuestContainer className="flex flex-1 items-center justify-center py-10">
                    <StatusPageCard
                        code="403"
                        title="You do not have access to this page"
                        message="Your account does not have permission to open this route. Please return to a page available for your role."
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
                code="403"
                title="You do not have access to this page"
                message="Your account does not have permission to open this route. Please return to a page available for your role."
                actions={actions}
            />
        </div>
    );
};

export default ForbiddenPage;
