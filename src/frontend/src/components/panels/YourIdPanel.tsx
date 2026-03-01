import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Bookmark,
  Briefcase,
  ChevronRight,
  LogIn,
  Mail,
  Shield,
  User,
} from "lucide-react";
import { toast } from "sonner";

const STATS = [
  {
    icon: Briefcase,
    label: "Jobs Applied",
    value: "0",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Bookmark,
    label: "Saved Jobs",
    value: "0",
    color: "text-amber-600",
    bg: "bg-amber-100",
  },
];

const PROFILE_ITEMS = [
  { icon: User, label: "Personal Info", description: "Name, phone, location" },
  {
    icon: Briefcase,
    label: "Work Experience",
    description: "Add your work history",
  },
  { icon: Mail, label: "Contact Details", description: "Email and phone" },
  { icon: Shield, label: "Privacy Settings", description: "Control your data" },
];

export function YourIdPanel() {
  function handleFeature() {
    toast.info("Feature coming soon", {
      description: "Profile management will be available in the next update.",
    });
  }

  return (
    <div className="p-6 space-y-6">
      {/* Profile Card */}
      <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-gradient-to-b from-primary/10 to-secondary/40 border border-primary/20">
        <Avatar className="w-20 h-20 mb-4 border-4 border-primary/20 shadow-lg">
          <AvatarFallback className="text-2xl font-display font-bold bg-primary/15 text-primary">
            G
          </AvatarFallback>
        </Avatar>
        <h3 className="font-display font-bold text-xl text-foreground">
          Guest User
        </h3>
        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
          <LogIn className="w-3.5 h-3.5" />
          Sign in to view full profile
        </p>
        <Badge variant="secondary" className="mt-3 text-xs">
          Free Account
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        {STATS.map(({ icon: Icon, label, value, color, bg }) => (
          <div
            key={label}
            className="p-4 rounded-xl bg-card border border-border text-center shadow-xs"
          >
            <div
              className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mx-auto mb-2`}
            >
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div className="text-2xl font-display font-bold text-foreground">
              {value}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Profile Completion */}
      <div className="p-4 rounded-xl bg-card border border-border shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">
            Profile Completion
          </span>
          <span className="text-sm font-bold text-primary">20%</span>
        </div>
        <Progress value={20} className="h-2" />
        <p className="text-xs text-muted-foreground">
          Complete your profile to get 3× more job matches.
        </p>
        <Button onClick={handleFeature} className="w-full" size="sm">
          Complete Profile
        </Button>
      </div>

      <Separator />

      {/* Profile Menu Items */}
      <div className="space-y-1">
        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
          Account Settings
        </h4>
        {PROFILE_ITEMS.map(({ icon: Icon, label, description }) => (
          <button
            key={label}
            type="button"
            onClick={handleFeature}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/60 transition-colors text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
              <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground">{label}</div>
              <div className="text-xs text-muted-foreground">{description}</div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
          </button>
        ))}
      </div>
    </div>
  );
}
