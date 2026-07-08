import ProfileMenu from "@/components/common/ProfileMenu";
import SetClosureDialog from "@/components/pageComponents/Admin/Closure/SetClosureDialog";
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
    PlusCircle,
    Settings,
    Users,
    Wrench,
    X,
} from "lucide-react";
import { useState, type ComponentType } from "react";
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
            { label: "Chatbot", icon: Bot, path: "/admin/chatbot-rule" },
            { label: "Settings", icon: Settings, path: "/admin/settings" },
        ],
    },
];

const AdminLayout = () => {
    const { user, handleLogout } = useAuthContext();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="flex min-h-screen bg-muted/30">
            <aside
            className={cn(
                "fixed top-0 z-40 h-screen border-r border-border/70 bg-background/95 backdrop-blur transition-all duration-200 lg:sticky",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
                isCollapsed ? "w-[76px]" : "w-[260px]"
            )}
            >
                <div className="flex h-full flex-col">
                    <div className="flex h-15 items-center justify-between border-b border-border/60 px-3">
                        {!isCollapsed ? (
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
                            title="John Miko's Place"
                            className="mx-auto"
                            >
                                <img
                                src="/logo/JMPort_Icon.png"
                                alt="JMPort"
                                className="size-9 rounded-lg object-cover shadow-sm"
                                />
                            </Link>
                        )}

                        <div className="flex items-center gap-1">
                            <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
                            >
                                <X className="size-5" />
                            </button>

                            <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="hidden rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:block"
                            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                            >
                                <ChevronLeft className={cn("size-5 transition-transform", isCollapsed && "rotate-180")} />
                            </button>
                        </div>
                    </div>

                    <nav className="flex-1 overflow-y-auto px-2.5 py-3">
                        <div className="space-y-4">
                            {ADMIN_NAV_GROUPS.map((group) => (
                                <div key={group.label} className="space-y-1.5">
                                    {!isCollapsed && (
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
                                            onClick={() => setIsSidebarOpen(false)}
                                            className={({ isActive }) =>
                                                cn(
                                                    "group flex items-center rounded-lg text-sm transition-colors",
                                                    isCollapsed
                                                        ? "h-10 justify-center px-0 py-0"
                                                        : "h-10 gap-3 px-2.5",
                                                    isActive
                                                        ? "bg-primary/10 text-primary"
                                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                                )
                                            }
                                            >
                                                {() => (
                                                    <>
                                                        <Icon className="size-4.5 shrink-0" />
                                                        {!isCollapsed && <span className="font-medium">{label}</span>}
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
                        <button
                        onClick={handleLogout}
                        title="Logout"
                        className={cn(
                            "flex h-10 w-full items-center rounded-lg text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive",
                            isCollapsed ? "justify-center px-0" : "gap-3 px-2.5"
                        )}
                        >
                            <LogOut className="size-4.5 shrink-0" />
                            {!isCollapsed && <span className="font-medium">Logout</span>}
                        </button>
                    </div>
                </div>
            </aside>

            <div className="flex min-h-screen flex-1 flex-col">
                <header className="sticky top-0 z-30 flex h-15 items-center justify-between border-b border-border/70 bg-background/95 px-4 backdrop-blur lg:px-6">
                    <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
                    >
                        <Menu className="size-5" />
                    </button>

                    <div className="flex-1 lg:flex-none">
                        <h2 className="ml-2 text-base font-bold tracking-normal lg:ml-0">
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

                <main className="flex min-h-0 flex-1 flex-col p-4 lg:p-6">
                    <Outlet />
                </main>
            </div>

            <SetClosureDialog />
        </div>
    );
};

export default AdminLayout;
