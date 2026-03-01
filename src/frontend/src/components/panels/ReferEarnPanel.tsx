import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  Check,
  Copy,
  Gift,
  IndianRupee,
  Link,
  MessageSquare,
  Trophy,
  UserPlus,
  Wallet,
} from "lucide-react";
import { useState } from "react";

const TOP_EARNERS = [
  {
    name: "Rahul S.",
    earnings: "₹350",
    initials: "RS",
    color: "bg-orange-500",
  },
  { name: "Priya M.", earnings: "₹300", initials: "PM", color: "bg-pink-500" },
  { name: "Amit K.", earnings: "₹250", initials: "AK", color: "bg-blue-500" },
  {
    name: "Sunita R.",
    earnings: "₹200",
    initials: "SR",
    color: "bg-emerald-500",
  },
  {
    name: "Deepak V.",
    earnings: "₹150",
    initials: "DV",
    color: "bg-violet-500",
  },
];

const RANK_STYLES = [
  {
    badge: "bg-yellow-400 text-yellow-900",
    row: "bg-yellow-50/60 dark:bg-yellow-900/10",
  },
  {
    badge: "bg-slate-300 text-slate-700",
    row: "bg-slate-50/60 dark:bg-slate-800/20",
  },
  {
    badge: "bg-amber-600 text-amber-100",
    row: "bg-amber-50/60 dark:bg-amber-900/10",
  },
  { badge: "bg-muted text-muted-foreground", row: "" },
  { badge: "bg-muted text-muted-foreground", row: "" },
];

const HOW_IT_WORKS_STEPS = [
  {
    icon: Link,
    label: "Share Link",
    color:
      "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
    step: "01",
  },
  {
    icon: UserPlus,
    label: "Friend Joins",
    color: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400",
    step: "02",
  },
  {
    icon: IndianRupee,
    label: "You Get ₹100",
    color:
      "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    step: "03",
  },
];

const REFERRAL_LINK = "jobfinder.in/ref/USER123";
const REFERRAL_URL = `https://${REFERRAL_LINK}`;
const WA_MESSAGE = `Bhai, Job Finder app try kar! Isme sabhi New aur Old vacancies ki detail milti hai. Mere link se download kar: ${REFERRAL_URL}`;

export function ReferEarnPanel() {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    void navigator.clipboard.writeText(`https://${REFERRAL_LINK}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleWhatsApp() {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(WA_MESSAGE)}`,
      "_blank",
    );
  }

  function handleTelegram() {
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(REFERRAL_URL)}&text=${encodeURIComponent("Bhai, Job Finder app try kar!")}`,
      "_blank",
    );
  }

  function handleFacebook() {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(REFERRAL_URL)}`,
      "_blank",
    );
  }

  function handleSms() {
    window.open(`sms:?body=${encodeURIComponent(WA_MESSAGE)}`);
  }

  return (
    <div className="p-4 space-y-4">
      {/* ── Panel 1: The Hook ── */}
      <div
        className="relative rounded-2xl overflow-hidden shadow-lg"
        style={{
          background:
            "linear-gradient(135deg, #f97316 0%, #ec4899 55%, #8b5cf6 100%)",
        }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/10" />
        <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-white/10" />

        <div className="relative z-10 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <span className="text-white/80 text-sm font-medium tracking-wide uppercase">
              Referral Programme
            </span>
          </div>

          <h2 className="text-white text-2xl font-bold leading-tight mb-1">
            Invite Friends &amp;
          </h2>
          <h2 className="text-white text-2xl font-bold leading-tight mb-3">
            Earn <span className="text-yellow-300">₹100</span> for every friend
            who joins!
          </h2>
          <p className="text-white/80 text-sm mb-4 leading-relaxed">
            Share your referral link and get ₹100 for every friend who joins
            JobFinder.
          </p>

          {/* Referral link box */}
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur rounded-xl px-3 py-2 mb-4">
            <Link className="w-4 h-4 text-white/70 flex-shrink-0" />
            <span className="text-white text-sm font-mono flex-1 truncate">
              {REFERRAL_LINK}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              aria-label="Copy referral link"
            >
              {copied ? (
                <Check className="w-4 h-4 text-yellow-300" />
              ) : (
                <Copy className="w-4 h-4 text-white" />
              )}
            </button>
          </div>

          {/* WhatsApp Share Button */}
          <button
            type="button"
            onClick={handleWhatsApp}
            className="w-full h-12 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2.5 shadow-md transition-colors"
            style={{ backgroundColor: "#25D366" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#1ebe57";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#25D366";
            }}
          >
            {/* WhatsApp SVG logo */}
            <svg
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="white"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Share on WhatsApp
          </button>

          {/* Invite via other apps */}
          <div className="mt-4">
            <p className="text-white/60 text-xs text-center mb-3 tracking-wide uppercase">
              Invite via other apps
            </p>
            <div className="flex items-center justify-center gap-4">
              {/* Telegram */}
              <button
                type="button"
                onClick={handleTelegram}
                aria-label="Share on Telegram"
                className="w-11 h-11 rounded-full flex items-center justify-center shadow transition-opacity hover:opacity-80"
                style={{ backgroundColor: "#0088cc" }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="white"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.820 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
              </button>

              {/* Facebook */}
              <button
                type="button"
                onClick={handleFacebook}
                aria-label="Share on Facebook"
                className="w-11 h-11 rounded-full flex items-center justify-center shadow transition-opacity hover:opacity-80"
                style={{ backgroundColor: "#1877F2" }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="white"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>

              {/* SMS */}
              <button
                type="button"
                onClick={handleSms}
                aria-label="Share via SMS"
                className="w-11 h-11 rounded-full flex items-center justify-center shadow transition-opacity hover:opacity-80"
                style={{ backgroundColor: "#6b7280" }}
              >
                <MessageSquare className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Panel 2: Leaderboard ── */}
      <Card className="rounded-2xl shadow-md border border-border overflow-hidden">
        <CardHeader className="pb-3 pt-4 px-4">
          <CardTitle className="flex items-center gap-2 text-base font-bold">
            <div className="w-8 h-8 rounded-lg bg-yellow-400/20 flex items-center justify-center">
              <Trophy className="w-4 h-4 text-yellow-500" />
            </div>
            Top Earners This Week
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 space-y-1">
          {TOP_EARNERS.map((user, idx) => {
            const rank = RANK_STYLES[idx];
            return (
              <div
                key={user.name}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${rank.row}`}
              >
                {/* Rank badge */}
                <span
                  className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 ${rank.badge}`}
                >
                  {idx + 1}
                </span>

                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${user.color}`}
                >
                  {user.initials}
                </div>

                {/* Name */}
                <span className="flex-1 text-sm font-medium text-foreground">
                  {user.name}
                </span>

                {/* Earnings */}
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {user.earnings}
                </span>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* ── Panel 3: How it Works ── */}
      <Card className="rounded-2xl shadow-md border border-border">
        <CardHeader className="pb-3 pt-4 px-4">
          <CardTitle className="text-base font-bold">How it Works</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-5">
          <div className="flex items-start justify-between gap-1">
            {HOW_IT_WORKS_STEPS.map((step, idx) => (
              <div key={step.step} className="flex items-start gap-1 flex-1">
                {/* Step card */}
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2 ${step.color}`}
                  >
                    <step.icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground mb-1 tracking-wider">
                    STEP {step.step}
                  </span>
                  <span className="text-xs font-semibold text-foreground text-center leading-tight">
                    {step.label}
                  </span>
                </div>

                {/* Arrow connector — not after last step */}
                {idx < HOW_IT_WORKS_STEPS.length - 1 && (
                  <div className="flex items-center mt-4 flex-shrink-0">
                    <ArrowRight className="w-4 h-4 text-muted-foreground/60" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Panel 4: Wallet ── */}
      <Card className="rounded-2xl shadow-md border border-border">
        <CardContent className="px-4 py-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Your Earnings</p>
              <p className="text-xs text-muted-foreground">
                Total referral earnings
              </p>
            </div>
          </div>

          {/* Big earnings display */}
          <div className="text-center mb-4">
            <p className="text-5xl font-extrabold text-foreground tracking-tight">
              ₹0.00
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Refer friends to start earning!
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 mb-3">
            <Button className="flex-1 h-10 rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-700 text-white">
              Withdraw
            </Button>
            <Button
              variant="outline"
              className="flex-1 h-10 rounded-xl font-semibold border-border"
            >
              View History
            </Button>
          </div>

          {/* Minimum withdrawal note */}
          <p className="text-center text-xs text-muted-foreground">
            Minimum withdrawal:{" "}
            <span className="font-semibold text-foreground/70">₹100</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
