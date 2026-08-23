import ProfileMenu from "@/components/common/ProfileMenu";
import SetClosureDialog from "@/components/pageComponents/Admin/Closure/SetClosureDialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/context/AuthContext";
import {
    BarChart3,
    Bot,
    Calendar,
    ChevronLeft,
    CreditCard,
    Hamburger,
    Home,
    LayoutDashboard,
    LogOut,
    Menu,
    MessageSquare,
    MapPinned,
    PlusCircle,
    Settings,
    Users,
    Wrench,
    X,
} from "lucide-react";
import { Suspense, useEffect, useRef, useState, type ComponentType } from "react";
import { Link, NavLink, Outlet } from "react-router";

type AdminNavItem = {
    label: string;
    path: string;
    icon: ComponentType<{ className?: string }>;
};

type AdminNavGroup = {
    label: string;
    items: AdminNavItem[];
};

const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
    {
        label: "Insights",
        items: [
            { label: "Overview", icon: LayoutDashboard, path: "/admin/" },
            { label: "Reports", icon: BarChart3, path: "/admin/report" },
        ],
    },
    {
        label: "Operations",
        items: [
            { label: "Accommodations", icon: Home, path: "/admin/accommodation" },
            { label: "Bookings", icon: Calendar, path: "/admin/booking" },
            { label: "Maintenance", icon: Wrench, path: "/admin/maintenance" },
            { label: "Payment Methods", icon: CreditCard, path: "/admin/payment-methods" },
        ],
    },
    {
        label: "Catalog",
        items: [
            { label: "Menu Items", icon: Hamburger, path: "/admin/menu-item" },
            { label: "AddOn Services", icon: PlusCircle, path: "/admin/add-on-service" },
        ],
    },
    {
        label: "People",
        items: [
            { label: "Staff Management", icon: Users, path: "/admin/staff-management" },
            { label: "User Management", icon: Users, path: "/admin/user-management" },
            { label: "Feedback", icon: MessageSquare, path: "/admin/feedback" },
        ],
    },
    {
        label: "System",
        items: [
            { label: "Virtual Tour", icon: MapPinned, path: "/admin/virtual-tour" },
            { label: "Chatbot Knowledge", icon: Bot, path: "/admin/knowledge" },
            { label: "Settings", icon: Settings, path: "/admin/settings" },
        ],
    },
];

const AdminPageLoading = () => (
    <div className="flex min-h-72 flex-1 flex-col gap-4" role="status" aria-live="polite">
        <span className="sr-only">Loading admin page</span>
        <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-80 max-w-full animate-pulse rounded-md bg-muted/70" />
        <div className="mt-3 flex-1 animate-pulse rounded-xl border bg-card/70" />
    </div>
);

const AdminLayout = () => {
    const { user, handleLogout } = useAuthContext();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDesktop, setIsDesktop] = useState(() => window.matchMedia("(min-width: 1024px)").matches);
    const sidebarRef = useRef<HTMLElement>(null);
    const mobileCloseButtonRef = useRef<HTMLButtonElement>(null);
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const isSidebarCollapsed = isDesktop && isCollapsed;

    const closeMobileSidebar = () => {
        setIsSidebarOpen(false);
        requestAnimationFrame(() => menuButtonRef.current?.focus());
    };

    useEffect(() => {
        const mediaQuery = window.matchMedia("(min-width: 1024px)");
        const updateIsDesktop = () => setIsDesktop(mediaQuery.matches);

        updateIsDesktop();
        mediaQuery.addEventListener("change", updateIsDesktop);

        return () => mediaQuery.removeEventListener("change", updateIsDesktop);
    }, []);

    useEffect(() => {
        if (isDesktop || !isSidebarOpen) return;

        const previousBodyOverflow = document.body.style.overflow;
        const focusableSelector = [
            "a[href]",
            "button:not([disabled])",
            "[tabindex]:not([tabindex='-1'])",
        ].join(",");

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.preventDefault();
                closeMobileSidebar();
                return;
            }

            if (event.key !== "Tab") return;

            const focusableElements = Array.from(
                sidebarRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? []
            );

            if (focusableElements.length === 0) return;

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (event.shiftKey && document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            } else if (!event.shiftKey && document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        };

        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", handleKeyDown);
        requestAnimationFrame(() => mobileCloseButtonRef.current?.focus());

        return () => {
            document.body.style.overflow = previousBodyOverflow;
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isDesktop, isSidebarOpen]);

    return (
        <div className="flex min-h-screen bg-muted/30">
            {!isDesktop && isSidebarOpen && (
                <button
                type="button"
                aria-label="Close navigation menu"
                className="fixed inset-0 z-30 bg-foreground/20 lg:hidden"
                onClick={closeMobileSidebar}
                />
            )}

            <aside
            ref={sidebarRef}
            id="admin-sidebar"
            role={!isDesktop && isSidebarOpen ? "dialog" : undefined}
            aria-label={!isDesktop && isSidebarOpen ? "Admin navigation" : undefined}
            aria-modal={!isDesktop && isSidebarOpen ? true : undefined}
            aria-hidden={!isDesktop && !isSidebarOpen ? true : undefined}
            inert={!isDesktop && !isSidebarOpen ? true : undefined}
            className={cn(
                "fixed top-0 z-40 h-screen border-r border-border/70 bg-background/95 backdrop-blur transition-[width,transform] duration-200 lg:sticky",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
                isSidebarCollapsed ? "w-[76px]" : "w-[260px]"
            )}
            >
                <div className="flex h-full flex-col">
                    <div
                    className={cn(
                        "flex h-15 items-center border-b border-border/60 px-3",
                        isSidebarCollapsed ? "justify-center" : "justify-between"
                    )}
                    >
                        {!isSidebarCollapsed ? (
                            <Link to="/" className="flex min-w-0 items-center gap-3">
                                <img
                                src="/logo/JMPort_Icon.png"
                                alt="JMPort"
                                className="size-9 rounded-lg object-cover shadow-sm"
                                />
                                <div className="min-w-0">
                                    <h1 className="truncate text-sm font-bold leading-5 text-foreground">
                                        John Miko&apos;s Place
                                    </h1>
                                    <p className="text-[11px] font-medium text-muted-foreground">
                                        Admin Portal
                                    </p>
                                </div>
                            </Link>
                        ) : (
                            <Link
                            to="/"
                            aria-label="John Miko's Place home"
                            className="shrink-0"
                            >
                                <img
                                src="/logo/JMPort_Icon.png"
                                alt="JMPort"
                                className="size-9 shrink-0 rounded-lg object-cover shadow-sm"
                                />
                            </Link>
                        )}

                        <div className="flex items-center lg:hidden">
                            <Button
                            ref={mobileCloseButtonRef}
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label="Close navigation menu"
                            onClick={closeMobileSidebar}
                            className="size-11 lg:hidden"
                            >
                                <X className="size-5" />
                            </Button>

                        </div>
                    </div>

                    <nav aria-label="Admin navigation" className="flex-1 overflow-y-auto px-2.5 py-3">
                        <div className={cn(isSidebarCollapsed ? "space-y-3" : "space-y-4")}>
                            {ADMIN_NAV_GROUPS.map((group) => (
                                <div key={group.label} className="space-y-1.5">
                                    {!isSidebarCollapsed && (
                                        <p className="px-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground/75">
                                            {group.label}
                                        </p>
                                    )}

                                    <div className="space-y-1">
                                        {group.items.map(({ path, label, icon: Icon }) => (
                                            <NavLink
                                            key={path}
                                            to={path}
                                            end={path === "/admin/"}
                                            title={label}
                                            aria-label={isSidebarCollapsed ? label : undefined}
                                            onClick={() => setIsSidebarOpen(false)}
                                            className={({ isActive }) =>
                                                cn(
                                                    "group flex items-center rounded-lg text-sm transition-colors",
                                                    isSidebarCollapsed
                                                        ? "h-11 justify-center px-0 py-0"
                                                        : "h-11 gap-3 px-2.5",
                                                    isActive
                                                        ? "bg-primary/10 text-primary"
                                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                                )
                                            }
                                            >
                                                {() => (
                                                    <>
                                                        <Icon className="size-4.5 shrink-0" />
                                                        {!isSidebarCollapsed && <span className="font-medium">{label}</span>}
                                                    </>
                                                )}
                                            </NavLink>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </nav>

                    <div className="border-t border-border/60 px-2.5 py-3">
                        <Button
                        onClick={handleLogout}
                        type="button"
                        variant="ghost"
                        title="Logout"
                        aria-label={isSidebarCollapsed ? "Logout" : undefined}
                        className={cn(
                            "h-11 w-full justify-start rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
                            isSidebarCollapsed ? "justify-center px-0" : "gap-3 px-2.5"
                        )}
                        >
                            <LogOut className="size-4.5 shrink-0" />
                            {!isSidebarCollapsed && <span className="font-medium">Logout</span>}
                        </Button>
                    </div>
                </div>
            </aside>

            <div
            aria-hidden={!isDesktop && isSidebarOpen ? true : undefined}
            inert={!isDesktop && isSidebarOpen ? true : undefined}
            className="flex min-h-screen min-w-0 flex-1 flex-col"
            >
                <header className="sticky top-0 z-30 flex h-15 items-center justify-between border-b border-border/70 bg-background/95 px-4 backdrop-blur lg:px-6">
                    <div className="flex min-w-0 flex-1 items-center gap-1 lg:flex-none">
                        <Button
                        ref={menuButtonRef}
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Open navigation menu"
                        aria-controls="admin-sidebar"
                        aria-expanded={isSidebarOpen}
                        onClick={() => setIsSidebarOpen(true)}
                        className="size-11 lg:hidden"
                        >
                            <Menu className="size-5" />
                        </Button>

                        <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                        aria-pressed={isSidebarCollapsed}
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden lg:inline-flex"
                        title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                        >
                            <ChevronLeft className={cn("size-5 transition-transform", isSidebarCollapsed && "rotate-180")} />
                        </Button>

                        <h2 className="min-w-0 text-base font-bold tracking-normal">
                            Admin Dashboard
                        </h2>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <div className="hidden text-right sm:block">
                            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                                Administrator
                            </p>
                            <p className="max-w-48 truncate text-sm font-medium text-foreground">
                                {user!.email}
                            </p>
                        </div>

                        <ProfileMenu />
                    </div>
                </header>

                <main className="flex min-h-0 min-w-0 flex-1 flex-col p-4 lg:p-6">
                    <Suspense fallback={<AdminPageLoading />}>
                        <Outlet />
                    </Suspense>
                </main>
            </div>

            <SetClosureDialog />
        </div>
    );
};

export default AdminLayout;
