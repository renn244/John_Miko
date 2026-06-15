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
        <div className="min-h-screen flex bg-muted/20">
            <aside
            className={cn(
                "fixed lg:sticky top-0 h-screen z-40 border-r bg-white/96 backdrop-blur transition-all duration-200",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
                isCollapsed ? "w-[84px]" : "w-[276px]"
            )}
            >
                <div className="flex h-full flex-col">
                    <div className="flex h-16 items-center justify-between border-b border-border/70 px-3.5">
                        {!isCollapsed ? (
                            <Link to="/" className="flex items-center gap-3 min-w-0">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/12 text-primary">
                                    <Home className="h-4.5 w-4.5" />
                                </div>
                                <div className="min-w-0">
                                    <h1 className="truncate text-sm font-semibold text-foreground">
                                        John Miko&apos;s Place
                                    </h1>
                                    <p className="text-[11px] text-muted-foreground">
                                        Admin Portal
                                    </p>
                                </div>
                            </Link>
                        ) : (
                            <Link
                            to="/"
                            title="John Miko's Place"
                            className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-primary/12 text-primary"
                            >
                                <Home className="h-4.5 w-4.5" />
                            </Link>
                        )}

                        <div className="flex items-center gap-1">
                            <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground lg:hidden"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="hidden rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground lg:block"
                            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                            >
                                <ChevronLeft className={cn("h-5 w-5 transition-transform", isCollapsed && "rotate-180")} />
                            </button>
                        </div>
                    </div>

                    <nav className="flex-1 overflow-y-auto px-3 py-4">
                        <div className="space-y-5">
                            {ADMIN_NAV_GROUPS.map((group) => (
                                <div key={group.label} className="space-y-1.5">
                                    {!isCollapsed && (
                                        <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/80">
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
                                                    "group flex items-center rounded-xl text-sm transition-all",
                                                    isCollapsed
                                                        ? "justify-center px-0 py-0 h-11"
                                                        : "gap-3 px-3 py-2.5",
                                                    isActive
                                                        ? "bg-primary/10 text-primary"
                                                        : "text-muted-foreground hover:bg-muted/55 hover:text-foreground"
                                                )
                                            }
                                            >
                                                <Icon className="h-4.5 w-4.5 shrink-0" />
                                                {!isCollapsed && <span className="font-medium">{label}</span>}
                                            </NavLink>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </nav>

                    <div className="border-t border-border/70 px-3 py-3">
                        <button
                        onClick={handleLogout}
                        title="Logout"
                        className={cn(
                            "flex w-full items-center rounded-xl text-sm text-muted-foreground transition-colors hover:bg-muted/55 hover:text-foreground",
                            isCollapsed ? "justify-center h-11 px-0" : "gap-3 px-3 py-2.5"
                        )}
                        >
                            <LogOut className="h-4.5 w-4.5 shrink-0" />
                            {!isCollapsed && <span className="font-medium">Logout</span>}
                        </button>
                    </div>
                </div>
            </aside>

            <div className="flex min-h-screen flex-1 flex-col">
                <header className="sticky top-0 z-30 flex h-16.25 items-center justify-between border-b bg-white/96 px-4 backdrop-blur lg:px-6">
                    <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground lg:hidden"
                    >
                        <Menu className="h-6 w-6" />
                    </button>

                    <div className="flex-1 lg:flex-none">
                        <h2 className="ml-2 text-lg font-semibold lg:ml-0">
                            Admin Dashboard
                        </h2>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden text-right sm:block">
                            <p className="text-sm font-medium">
                                Administrator
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {user!.email}
                            </p>
                        </div>

                        <ProfileMenu />
                    </div>
                </header>

                <main className="flex-1 p-4 lg:p-6">
                    <Outlet />
                </main>
            </div>

            <SetClosureDialog />
        </div>
    );
};

export default AdminLayout;
