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
  Edit,
  FileText,
  IdCard,
  LogIn,
  MapPin,
  Palette,
  PlusCircle,
} from "lucide-react";

export type PanelId =
  | "auth"
  | "themes"
  | "locations"
  | "your-id"
  | "new-vacancy"
  | "old-vacancy"
  | "draft-vacancy"
  | "add-post"
  | null;

interface MenuItem {
  id: PanelId;
  label: string;
  icon: React.ElementType;
  description: string;
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: "auth",
    label: "Sign Up / Login",
    icon: LogIn,
    description: "Create account or sign in",
  },
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
    id: "your-id",
    label: "Your ID",
    icon: IdCard,
    description: "Profile and stats",
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
    id: "add-post",
    label: "Add Post",
    icon: Edit,
    description: "Share news & tips",
  },
];

interface SideMenuProps {
  isOpen: boolean;
  activePanel: PanelId;
  onClose: () => void;
  onSelectPanel: (panel: PanelId) => void;
}

export function SideMenu({
  isOpen,
  activePanel,
  onClose,
  onSelectPanel,
}: SideMenuProps) {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="left"
        className="w-[300px] sm:w-[320px] p-0 flex flex-col bg-card border-r border-border"
      >
        {/* Header */}
        <SheetHeader className="px-5 pt-5 pb-4 border-b border-border bg-primary/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <Briefcase
                className="w-4.5 h-4.5 text-primary-foreground"
                style={{ width: "1.1rem", height: "1.1rem" }}
              />
            </div>
            <div className="leading-none">
              <SheetTitle className="font-display font-bold text-lg text-foreground tracking-tight">
                JobFinder
              </SheetTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                India's Job Board
              </p>
            </div>
          </div>
        </SheetHeader>

        {/* Menu Items */}
        <nav
          className="flex-1 overflow-y-auto py-3 px-3"
          aria-label="Side navigation"
        >
          <ul className="space-y-0.5">
            {MENU_ITEMS.map(({ id, label, icon: Icon, description }) => {
              const isActive = activePanel === id;
              return (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => onSelectPanel(id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 group",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-secondary/70 hover:text-foreground",
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <div
                      className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
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
                      <div className="text-xs text-muted-foreground mt-0.5 truncate">
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
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-border bg-secondary/30">
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            From Jammu &amp; Kashmir to Kanyakumari
            <br />
            <span className="font-medium text-foreground/60">
              Your job is searching for you
            </span>
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
