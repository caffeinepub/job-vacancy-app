import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { PanelId } from "./SideMenu";
import { AddPostPanel } from "./panels/AddPostPanel";
import { AuthPanel } from "./panels/AuthPanel";
import { DraftVacancyPanel } from "./panels/DraftVacancyPanel";
import { LocationsPanel } from "./panels/LocationsPanel";
import { NewVacancyPanel } from "./panels/NewVacancyPanel";
import { OldVacancyPanel } from "./panels/OldVacancyPanel";
import { ThemesPanel } from "./panels/ThemesPanel";
import { YourIdPanel } from "./panels/YourIdPanel";

const PANEL_META: Record<
  Exclude<PanelId, null>,
  { title: string; description: string }
> = {
  auth: {
    title: "Sign Up / Login",
    description: "Access your JobFinder account",
  },
  themes: {
    title: "Themes",
    description: "Customize how JobFinder looks",
  },
  locations: {
    title: "Locations",
    description: "Filter jobs by Indian state",
  },
  "your-id": {
    title: "Your ID",
    description: "Your profile and activity",
  },
  "new-vacancy": {
    title: "New Vacancy",
    description: "Post a new job opening",
  },
  "old-vacancy": {
    title: "Old Vacancy",
    description: "Your closed job listings",
  },
  "draft-vacancy": {
    title: "Draft Vacancy",
    description: "Unpublished job drafts",
  },
  "add-post": {
    title: "Add Post",
    description: "Share with the community",
  },
};

interface PanelSheetProps {
  activePanel: PanelId;
  onClose: () => void;
  onStateFilter: (state: string) => void;
  activeState: string;
}

export function PanelSheet({
  activePanel,
  onClose,
  onStateFilter,
  activeState,
}: PanelSheetProps) {
  const isOpen = activePanel !== null;
  const meta = activePanel ? PANEL_META[activePanel] : null;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:w-[480px] p-0 flex flex-col"
      >
        {meta && (
          <SheetHeader className="sr-only">
            <SheetTitle>{meta.title}</SheetTitle>
            <SheetDescription>{meta.description}</SheetDescription>
          </SheetHeader>
        )}
        <ScrollArea className="flex-1">
          {activePanel === "auth" && <AuthPanel />}
          {activePanel === "themes" && <ThemesPanel />}
          {activePanel === "locations" && (
            <LocationsPanel
              onStateFilter={(state) => {
                onStateFilter(state);
                onClose();
              }}
              activeState={activeState}
            />
          )}
          {activePanel === "your-id" && <YourIdPanel />}
          {activePanel === "new-vacancy" && <NewVacancyPanel />}
          {activePanel === "old-vacancy" && <OldVacancyPanel />}
          {activePanel === "draft-vacancy" && <DraftVacancyPanel />}
          {activePanel === "add-post" && <AddPostPanel />}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
