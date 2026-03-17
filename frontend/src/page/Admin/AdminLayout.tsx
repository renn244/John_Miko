import { Calendar, Home, LayoutDashboard, LogOut, MessageSquare, Settings, Users } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router";


const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const navItems = [
        {
            label: 'Overview',
            icon: LayoutDashboard,
            path: '/admin/dashboard',
        },
        {
            label: 'Accommodations',
            icon: Home,
            path: '/admin/accommodation',
        },
        {
            label: 'Bookings',
            icon: Calendar,
            path: '/admin/bookings',
        },
        {
            label: 'Guests',
            icon: Users,
            path: '/admin/guests',
        },
        {
            label: 'Feedback',
            icon: MessageSquare,
            path: '/admin/feedback',
        },
        {
            label: 'Settings',
            icon: Settings,
            path: '/admin/settings',
        },
    ];

    //  we still need to add the animation through motion, for mobile.

    return (
        <div className="min-h-screen flex">

            <aside className="border">
                <div className="flex flex-col h-full">

                    <div className="h-16 flex items-center justify-between px-4 border-b">
                        
                        {!isCollapsed && (
                            <Link to="/" className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary">
                                    <Home className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h1 className="font-bold text-sm">
                                        John Miko's Place
                                    </h1>
                                    <p className="text-xs text-muted-foreground">
                                        Admin Portal
                                    </p>
                                </div>
                            </Link>
                        )}

                        {/* For Side Bar Later */}
                        {/* <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden lg:block p-2 rounded-lg hover:bg-gray-100"
                        >
                            <ChevronLeft
                            className={`w-5 h-5 transition-transform text-foreground ${isCollapsed ? 'rotate-180' : ''}`}
                            />
                        </button> */}

                    </div>

                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {navItems.map(({ path, label, icon: Icon }) => (
                            <NavLink
                            key={path}
                            to={path}
                            title={label}
                            onClick={() => setIsSidebarOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 h-11 rounded-lg transition-all ${isActive ? 'shadow-sm bg-primary text-white' : 'hover:bg-gray-50 bg-transparent text-muted-foreground'}`
                            }
                            >
                                <Icon className="w-5 h-5 shrink-0" />
                                {!isCollapsed && (
                                    <span className="font-medium text-sm">{label}</span>
                                )}
                            </NavLink>
                        )
                        )}
                    </nav>

                    <div className="p-4 border-t">
                        <button
                        className="flex items-center gap-3 px-3 h-11 w-full rounded-lg hover:bg-gray-50 transition-all"
                        title={isCollapsed ? 'Logout' : undefined}
                        >
                            <LogOut className="w-5 h-5 text-foreground shrink-0" />
                            {!isCollapsed && <span className="font-medium text-sm text-foreground">Logout</span>}
                        </button>
                    </div>
                
                </div>
            </aside>


            <div className="flex-1 flex flex-col min-h-screen">

                <header className="h-16.25 bg-white border-b flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
                    {/* <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                    >
                        <Menu className="w-6 h-6"/>
                    </button> */}

                    <div className="flex-1 lg:flex-none">
                        <h2 className="text-lg font-bold ml-2 lg:ml-0">
                            Admin Dashboard
                        </h2>
                    </div>

                    <div className="flex items-center gap-3">
                        
                        <div className="hidden sm:block text-right">
                            <p className="text-sm font-medium">
                                Administrator
                            </p>
                            <p className="text-xs text-muted-foreground">
                                admin@johnmikosplace.com
                            </p>
                        </div>

                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white bg-primary">
                            A
                        </div>

                    </div>
                </header>

                <main className="flex-1 p-4 lg:p-6"><Outlet /></main>
            </div>

        </div>
    )
}

export default AdminLayout