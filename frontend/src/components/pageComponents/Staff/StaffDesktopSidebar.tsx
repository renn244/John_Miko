import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import type { ComponentType } from "react";
import { Link, NavLink } from "react-router";

export type StaffNavigationItem = {
  label: string;
  path: string;
  icon: ComponentType<{ className?: string }>;
};

type StaffDesktopSidebarProps = {
  roleLabel: string;
  navigationItems: readonly StaffNavigationItem[];
  isCollapsed: boolean;
};

export const StaffDesktopSidebar = ({
  roleLabel,
  navigationItems,
  isCollapsed,
}: StaffDesktopSidebarProps) => {
  const { handleLogout } = useAuthContext();

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen shrink-0 border-r border-border/70 bg-background/95 transition-[width] duration-200 lg:flex lg:flex-col",
        isCollapsed ? "w-[76px]" : "w-[260px]",
      )}
    >
      <div
        className={cn(
          "flex h-15 items-center border-b border-border/60 px-3",
          isCollapsed ? "justify-center" : "justify-between",
        )}
      >
        <Link
          to="/"
          aria-label={isCollapsed ? "John Miko's Place home" : undefined}
          className="flex min-w-0 items-center gap-3"
        >
          <img
            src="/logo/JMPort_Icon.png"
            alt="JMPort"
            className="size-9 shrink-0 rounded-lg object-cover shadow-sm"
          />
          {!isCollapsed ? (
            <div className="min-w-0">
              <p className="truncate text-sm font-bold leading-5 text-foreground">
                John Miko&apos;s Place
              </p>
              <p className="text-[11px] font-medium text-muted-foreground">
                {roleLabel}
              </p>
            </div>
          ) : null}
        </Link>
      </div>

      <nav
        aria-label={`${roleLabel} navigation`}
        className="flex-1 overflow-y-auto px-2.5 py-3"
      >
        <div className="space-y-1">
          {navigationItems.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path.endsWith("/assigned")}
              title={label}
              aria-label={isCollapsed ? label : undefined}
              className={({ isActive }) =>
                cn(
                  "group flex h-11 items-center rounded-lg text-sm transition-colors",
                  isCollapsed ? "justify-center px-0" : "gap-3 px-2.5",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )
              }
            >
              <Icon className="size-4.5 shrink-0" />
              {!isCollapsed ? (
                <span className="font-medium">{label}</span>
              ) : null}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="border-t border-border/60 px-2.5 py-3">
        <Button
          type="button"
          variant="ghost"
          title="Logout"
          aria-label={isCollapsed ? "Logout" : undefined}
          onClick={handleLogout}
          className={cn(
            "h-11 w-full justify-start rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
            isCollapsed ? "justify-center px-0" : "gap-3 px-2.5",
          )}
        >
          <LogOut className="size-4.5 shrink-0" />
          {!isCollapsed ? <span className="font-medium">Logout</span> : null}
        </Button>
      </div>
    </aside>
  );
};
