import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Bookmark,
  Briefcase,
  Calendar,
  ChevronRight,
  Fingerprint,
  LogOut,
  Mail,
  Phone,
  Shield,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AuthPanel } from "./AuthPanel";
import type { AuthUser } from "./AuthPanel";

interface YourIdPanelProps {
  user: AuthUser | null;
  onOpenAuth?: () => void;
  onLogin?: (user: AuthUser) => void;
  onLogout?: () => void;
}

const PROFILE_ITEMS = [
  { icon: User, label: "Personal Info", description: "Name, phone, location" },
  {
    icon: Briefcase,
    label: "Work Experience",
    description: "Add your work history",
  },
  { icon: Mail, label: "Contact Details", description: "Email and phone" },
  {
    icon: Shield,
    label: "Account Settings",
    description: "Privacy & security",
  },
];

function formatDate(ts: number): string {
  if (!ts) return "—";
  const d = new Date(ts);
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function YourIdPanel({ user, onLogin, onLogout }: YourIdPanelProps) {
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    phone: localStorage.getItem("jf_user_phone") || "",
    location: localStorage.getItem("jf_user_location") || "",
    jobTitle: localStorage.getItem("jf_user_job_title") || "",
  });

  const completionFields = [
    !!user?.name,
    !!(user?.email || user?.phone),
    !!profileData.phone,
    !!profileData.location,
    !!profileData.jobTitle,
  ];
  const completionPct = Math.round(
    (completionFields.filter(Boolean).length / completionFields.length) * 100,
  );

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    localStorage.setItem("jf_user_phone", profileData.phone);
    localStorage.setItem("jf_user_location", profileData.location);
    localStorage.setItem("jf_user_job_title", profileData.jobTitle);
    setEditMode(false);
    toast.success("Profile updated successfully!");
  }

  // ── Guest / not logged in: show inline AuthPanel ──
  if (!user) {
    return (
      <div className="p-6 space-y-4">
        <div className="text-center mb-2">
          <h3 className="font-display font-bold text-lg text-foreground">
            Your ID
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Login or sign up to access your profile.
          </p>
        </div>
        <AuthPanel onLogin={(u) => onLogin?.(u)} />
      </div>
    );
  }

  // ── Logged-in profile dashboard ──
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const displayContact = user.email || user.phone || "—";
  const authBadgeLabel =
    user.authMethod === "email" ? "Email Account" : "Phone Account";
  const shortId = `#JF-${user.userId.slice(0, 8).toUpperCase()}`;

  return (
    <div className="p-6 space-y-6">
      {/* Profile Card */}
      <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-gradient-to-b from-primary/10 to-secondary/40 border border-primary/20">
        <Avatar className="w-20 h-20 mb-4 border-4 border-primary/20 shadow-lg">
          <AvatarFallback className="text-2xl font-display font-bold bg-primary/15 text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
        <h3 className="font-display font-bold text-xl text-foreground">
          {user.name}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">{displayContact}</p>
        {profileData.jobTitle && (
          <p className="text-xs text-primary font-medium mt-1">
            {profileData.jobTitle}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
          <Badge className="text-xs bg-emerald-500/15 text-emerald-700 border-emerald-300/40">
            Active Member
          </Badge>
          <Badge
            variant="outline"
            className="text-xs font-mono border-primary/30 text-primary/80"
          >
            {shortId}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {authBadgeLabel}
          </Badge>
        </div>

        {/* Account meta */}
        <div className="w-full mt-4 space-y-1.5 text-left">
          {user.email && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Mail className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{user.email}</span>
            </div>
          )}
          {user.phone && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Phone className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{user.phone}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Fingerprint className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="font-mono">User ID: {shortId}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Member since: {formatDate(user.createdAt)}</span>
          </div>
        </div>

        {/* Logout button */}
        <Button
          variant="destructive"
          className="w-full mt-5 gap-2 bg-red-500/10 text-red-600 hover:bg-red-500/20 border border-red-300/40 shadow-none"
          onClick={() => {
            toast.success("Logged out successfully.");
            onLogout?.();
          }}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-xl bg-card border border-border text-center shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
            <Briefcase className="w-5 h-5 text-primary" />
          </div>
          <div className="text-2xl font-display font-bold text-foreground">
            0
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            Jobs Applied
          </div>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border text-center shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center mx-auto mb-2">
            <Bookmark className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-2xl font-display font-bold text-foreground">
            0
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">Saved Jobs</div>
        </div>
      </div>

      {/* Profile Completion */}
      <div className="p-4 rounded-xl bg-card border border-border shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">
            Profile Completion
          </span>
          <span className="text-sm font-bold text-primary">
            {completionPct}%
          </span>
        </div>
        <Progress value={completionPct} className="h-2" />
        <p className="text-xs text-muted-foreground">
          {completionPct < 100
            ? "Complete your profile to get 3× more job matches."
            : "Your profile is complete!"}
        </p>
        {completionPct < 100 && (
          <Button
            onClick={() => setEditMode(true)}
            className="w-full"
            size="sm"
          >
            Complete Profile
          </Button>
        )}
      </div>

      {/* Edit Profile Form */}
      {editMode && (
        <div className="p-4 rounded-xl bg-card border border-primary/30 shadow-xs space-y-4">
          <h4 className="text-sm font-bold text-foreground">
            Edit Personal Info
          </h4>
          <form onSubmit={handleSaveProfile} className="space-y-3">
            <div className="space-y-1.5">
              <Label
                htmlFor="profile-phone"
                className="text-xs flex items-center gap-1.5"
              >
                <Phone className="w-3 h-3" /> Phone Number
              </Label>
              <Input
                id="profile-phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={profileData.phone}
                onChange={(e) =>
                  setProfileData((p) => ({ ...p, phone: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="profile-location" className="text-xs">
                City / Location
              </Label>
              <Input
                id="profile-location"
                type="text"
                placeholder="e.g. Mumbai, Maharashtra"
                value={profileData.location}
                onChange={(e) =>
                  setProfileData((p) => ({ ...p, location: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="profile-job-title" className="text-xs">
                Current / Desired Job Title
              </Label>
              <Input
                id="profile-job-title"
                type="text"
                placeholder="e.g. Software Engineer"
                value={profileData.jobTitle}
                onChange={(e) =>
                  setProfileData((p) => ({ ...p, jobTitle: e.target.value }))
                }
              />
            </div>
            <div className="flex gap-2 pt-1">
              <Button type="submit" size="sm" className="flex-1">
                Save Changes
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <Separator />

      {/* Account Settings */}
      <div className="space-y-1">
        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
          Account Settings
        </h4>
        {PROFILE_ITEMS.map(({ icon: Icon, label, description }) => (
          <button
            key={label}
            type="button"
            onClick={() => {
              if (label === "Personal Info") {
                setEditMode(true);
              } else {
                toast.info("Feature coming soon", {
                  description: `${label} management will be available in the next update.`,
                });
              }
            }}
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
