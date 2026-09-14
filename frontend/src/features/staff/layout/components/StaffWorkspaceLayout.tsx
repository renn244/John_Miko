import ProfileMenu from "@/components/common/ProfileMenu";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/features/auth/context/AuthContext";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { Suspense, useState } from "react";
import { Link, NavLink, Outlet } from "react-router";
import {
  StaffDesktopSidebar,
  type StaffNavigationItem,
} from "./StaffDesktopSidebar";

type StaffWorkspaceLayoutProps = {
  roleLabel: string;
  navigationItems: readonly StaffNavigationItem[];
};

const getMobileGridColumnsClass = (itemCount: number) => {
  if (itemCount === 2) return "grid-cols-2";
  if (itemCount === 3) return "grid-cols-3";
  return "grid-cols-4";
};

const StaffWorkspaceLayout = ({
  roleLabel,
  navigationItems,
}: StaffWorkspaceLayoutProps) => {
  const { user } = useAuthContext();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const mobileGridClass = getMobileGridColumnsClass(navigationItems.length);

  return (
    <div className="flex min-h-screen bg-muted/30">
      <StaffDesktopSidebar
        roleLabel={roleLabel}
        navigationItems={navigationItems}
        isCollapsed={isSidebarCollapsed}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur lg:hidden">
          <div className="mx-auto flex h-15 w-full max-w-2xl items-center px-5">
            <Link to="/" className="flex min-w-0 items-center gap-3">
              <img
                src="/logo/JMPort_Icon.png"
                alt="JMPort"
                className="size-9 rounded-lg object-cover shadow-sm"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-foreground">
                  John Miko&apos;s Place
                </p>
                <p className="text-xs font-medium text-muted-foreground">
                  {roleLabel}
                </p>
              </div>
            </Link>
          </div>
        </header>

        <header className="sticky top-0 z-20 hidden h-15 items-center justify-between border-b border-border/70 bg-background/95 px-6 backdrop-blur lg:flex">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={
              isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
            }
            aria-pressed={isSidebarCollapsed}
            title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setIsSidebarCollapsed((collapsed) => !collapsed)}
            className="size-11 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <ChevronLeft
              className={cn(
                "size-4 transition-transform",
                isSidebarCollapsed && "rotate-180",
              )}
            />
          </Button>
          <div className="flex items-center gap-2.5">
            <div className="text-right">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                {roleLabel}
              </p>
              <p className="max-w-48 truncate text-sm font-medium text-foreground">
                {user?.email}
              </p>
            </div>
            <ProfileMenu />
          </div>
        </header>

        <main className="mx-auto w-full max-w-2xl px-5 py-4 pb-24 lg:max-w-none lg:px-6 lg:py-6 lg:pb-6">
          <Suspense fallback={<StaffWorkspaceLoading roleLabel={roleLabel} />}>
            <Outlet />
          </Suspense>
        </main>

        <nav
          className="fixed inset-x-0 bottom-0 z-20 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
          aria-label={`${roleLabel} navigation`}
        >
          <div
            className={cn("mx-auto grid h-16 max-w-2xl px-2", mobileGridClass)}
          >
            {navigationItems.map(({ label, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  cn(
                    "flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-semibold transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )
                }
              >
                <Icon className="size-5" />
                {label}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
};

const StaffWorkspaceLoading = ({ roleLabel }: { roleLabel: string }) => (
  <div className="space-y-3 p-5" role="status" aria-live="polite">
    <span className="sr-only">Loading {roleLabel.toLowerCase()} page</span>
    <div className="h-8 w-44 animate-pulse rounded bg-muted" />
    <div className="h-9 w-80 max-w-full animate-pulse rounded bg-muted/70" />
    <div className="h-36 animate-pulse rounded-xl border bg-card" />
  </div>
);

export default StaffWorkspaceLayout;
