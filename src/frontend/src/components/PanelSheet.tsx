import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";
import type { JobListing } from "../data/jobs";
import type { PanelId } from "./SideMenu";
import type { AuthUser } from "./panels/AuthPanel";
import { AuthPanel } from "./panels/AuthPanel";
import { DraftVacancyPanel } from "./panels/DraftVacancyPanel";
import { LocationsPanel } from "./panels/LocationsPanel";
import { NewVacancyPanel } from "./panels/NewVacancyPanel";
import { OldVacancyPanel } from "./panels/OldVacancyPanel";
import { ReferEarnPanel } from "./panels/ReferEarnPanel";
import { ThemesPanel } from "./panels/ThemesPanel";
import { WithdrawalPanel } from "./panels/WithdrawalPanel";
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
  "refer-earn": {
    title: "Refer & Earn",
    description: "Invite friends and earn rewards",
  },
  withdrawal: {
    title: "Withdrawal",
    description: "Withdraw your referral earnings",
  },
};

interface PanelSheetProps {
  activePanel: PanelId;
  onClose: () => void;
  onStateFilter: (state: string) => void;
  activeState: string;
  onNewJob?: (job: JobListing) => void;
  allVacancies?: JobListing[];
  user: AuthUser | null;
  onLogin?: (user: AuthUser) => void;
  onOpenAuth?: () => void;
  onLogout?: () => void;
  onNavigate?: (panel: PanelId) => void;
}

export function PanelSheet({
  activePanel,
  onClose,
  onStateFilter,
  activeState,
  onNewJob,
  allVacancies = [],
  user,
  onLogin,
  onOpenAuth,
  onLogout,
  onNavigate,
}: PanelSheetProps) {
  const isOpen = activePanel !== null;
  const meta = activePanel ? PANEL_META[activePanel] : null;
  const [withdrawalInitialScreen, setWithdrawalInitialScreen] = useState<
    "select" | "history"
  >("select");

  function handleSheetClose() {
    setWithdrawalInitialScreen("select");
    onClose();
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && handleSheetClose()}>
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
        {/* Panels that manage their own native scroll (no ScrollArea) */}
        {activePanel === "new-vacancy" ||
        activePanel === "old-vacancy" ||
        activePanel === "draft-vacancy" ||
        activePanel === "refer-earn" ||
        activePanel === "withdrawal" ||
        activePanel === "themes" ? (
          <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
            {activePanel === "new-vacancy" && (
              <NewVacancyPanel
                onPost={(job) => {
                  if (onNewJob) onNewJob(job);
                  setTimeout(onClose, 2200);
                }}
                allVacancies={allVacancies}
              />
            )}
            {activePanel === "old-vacancy" && (
              <OldVacancyPanel allVacancies={allVacancies} />
            )}
            {activePanel === "draft-vacancy" && <DraftVacancyPanel />}
            {activePanel === "refer-earn" && (
              <div
                className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                <ReferEarnPanel
                  onWithdraw={() => {
                    setWithdrawalInitialScreen("select");
                    onNavigate?.("withdrawal");
                  }}
                  onViewHistory={() => {
                    setWithdrawalInitialScreen("history");
                    onNavigate?.("withdrawal");
                  }}
                />
              </div>
            )}
            {activePanel === "withdrawal" && (
              <WithdrawalPanel
                initialScreen={withdrawalInitialScreen}
                onBack={() => {
                  setWithdrawalInitialScreen("select");
                  onNavigate?.("refer-earn");
                }}
              />
            )}
            {activePanel === "themes" && (
              <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
                <ThemesPanel />
              </div>
            )}
          </div>
        ) : (
          <ScrollArea className="flex-1">
            {activePanel === "auth" && (
              <AuthPanel
                onLogin={(u) => {
                  onLogin?.(u);
                  onClose();
                }}
              />
            )}
            {activePanel === "locations" && (
              <LocationsPanel
                onStateFilter={(state) => {
                  onStateFilter(state);
                  onClose();
                }}
                activeState={activeState}
              />
            )}
            {activePanel === "your-id" && (
              <YourIdPanel
                user={user}
                onOpenAuth={() => {
                  onOpenAuth?.();
                }}
                onLogin={(u) => {
                  onLogin?.(u);
                }}
                onLogout={onLogout}
              />
            )}
          </ScrollArea>
        )}
      </SheetContent>
    </Sheet>
  );
}
