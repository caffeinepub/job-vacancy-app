import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  Archive,
  Briefcase,
  FileText,
  Gift,
  IdCard,
  LogOut,
  MapPin,
  Palette,
  PlusCircle,
} from "lucide-react";
import type { AuthUser } from "./panels/AuthPanel";

export type PanelId =
  | "auth"
  | "themes"
  | "locations"
  | "your-id"
  | "new-vacancy"
  | "old-vacancy"
  | "draft-vacancy"
  | "refer-earn"
  | "withdrawal"
  | null;

interface MenuItem {
  id: PanelId;
  label: string;
  icon: React.ElementType;
  description: string;
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: "themes",
    label: "Themes",
    icon: Palette,
    description: "Light, dark or system",
  },
  {
    id: "locations",
    label: "Locations",
    icon: MapPin,
    description: "Browse by Indian state",
  },
  {
    id: "new-vacancy",
    label: "New Vacancy",
    icon: PlusCircle,
    description: "Post a job opening",
  },
  {
    id: "old-vacancy",
    label: "Old Vacancy",
    icon: Archive,
    description: "Past closed listings",
  },
  {
    id: "draft-vacancy",
    label: "Draft Vacancy",
    icon: FileText,
    description: "Unpublished drafts",
  },
  {
    id: "refer-earn",
    label: "Refer & Earn",
    icon: Gift,
    description: "Invite friends, earn ₹100 each",
  },
];

interface SideMenuProps {
  isOpen: boolean;
  activePanel: PanelId;
  onClose: () => void;
  onSelectPanel: (panel: PanelId) => void;
  onLogout?: () => void;
  user?: AuthUser | null;
}

export function SideMenu({
  isOpen,
  activePanel,
  onClose,
  onSelectPanel,
  onLogout,
}: SideMenuProps) {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="left"
        className="w-[300px] sm:w-[320px] p-0 flex flex-col overflow-hidden bg-card border-r border-border"
      >
        {/* Header / Logo */}
        <SheetHeader className="flex-none px-5 pt-4 pb-3 border-b border-border bg-primary/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <Briefcase
                className="text-primary-foreground"
                style={{ width: "1rem", height: "1rem" }}
              />
            </div>
            <div className="leading-none">
              <SheetTitle className="font-display font-bold text-base text-foreground tracking-tight">
                JobFinder
              </SheetTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                India's Job Board
              </p>
            </div>
          </div>
        </SheetHeader>

        {/* Main nav — vertical stack, no scrolling */}
        <nav
          className="flex-none px-3 pt-2 pb-1 overflow-hidden"
          aria-label="Side navigation"
        >
          {/* Your ID — at the very top */}
          <button
            type="button"
            onClick={() => onSelectPanel("your-id")}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all duration-150 group",
              activePanel === "your-id"
                ? "bg-primary/10 text-primary"
                : "text-foreground hover:bg-secondary/70 hover:text-foreground",
            )}
            aria-current={activePanel === "your-id" ? "page" : undefined}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                activePanel === "your-id"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary",
              )}
            >
              <IdCard className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div
                className={cn(
                  "text-sm font-semibold leading-tight",
                  activePanel === "your-id"
                    ? "text-primary"
                    : "text-foreground",
                )}
              >
                Your ID
              </div>
              <div className="text-xs text-muted-foreground truncate">
                Profile and stats
              </div>
            </div>
            {activePanel === "your-id" && (
              <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
            )}
          </button>

          {/* Menu items: Themes, Locations, New Vacancy, Old Vacancy, Draft Vacancy, Refer & Earn */}
          <ul className="space-y-0">
            {MENU_ITEMS.map(({ id, label, icon: Icon, description }) => {
              const isActive = activePanel === id;
              return (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => onSelectPanel(id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all duration-150 group",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-secondary/70 hover:text-foreground",
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary",
                      )}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className={cn(
                          "text-sm font-semibold leading-tight",
                          isActive ? "text-primary" : "text-foreground",
                        )}
                      >
                        {label}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {description}
                      </div>
                    </div>
                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Thin divider before Logout */}
          <div className="border-t border-border/60 mx-3 my-1" />

          {/* Logout — always visible */}
          <button
            type="button"
            onClick={() => {
              onLogout?.();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all duration-150 group hover:bg-red-500/10"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-red-500/10 text-red-600 group-hover:bg-red-500/20 transition-colors">
              <LogOut className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold leading-tight text-red-600">
                Logout
              </div>
              <div className="text-xs text-muted-foreground truncate">
                Sign out of your account
              </div>
            </div>
          </button>
        </nav>

        {/* Spacer to push footer to bottom */}
        <div className="flex-1" />

        {/* Footer tagline */}
        <div className="flex-none px-5 py-2 border-t border-border bg-secondary/30">
          <p className="text-xs text-muted-foreground text-center leading-snug">
            From J&amp;K to Kanyakumari —{" "}
            <span className="font-medium text-foreground/60">
              your job is searching for you
            </span>
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
