import { Button } from "@/components/ui/button";
import {
  Bell,
  Briefcase,
  Check,
  ChevronRight,
  Globe,
  HardDrive,
  Languages,
  MapPin,
  X,
} from "lucide-react";
import { AnimatePresence, type Variants, motion } from "motion/react";
import { useState } from "react";

interface OnboardingFlowProps {
  onComplete: (language: string) => void;
}

type PermissionState = "pending" | "allowed" | "denied";

interface Permission {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
}

const PERMISSIONS: Permission[] = [
  {
    id: "location",
    icon: MapPin,
    title: "Location",
    description: "Helps us show vacancies in your area",
  },
  {
    id: "notifications",
    icon: Bell,
    title: "Notifications",
    description: "Get notified when new vacancies are posted",
  },
  {
    id: "storage",
    icon: HardDrive,
    title: "Storage",
    description: "Save and upload your resume for applications",
  },
];

const LANGUAGES = [
  { code: "en", native: "English", english: "English" },
  { code: "hi", native: "हिन्दी", english: "Hindi" },
  { code: "bn", native: "বাংলা", english: "Bengali" },
  { code: "mr", native: "मराठी", english: "Marathi" },
  { code: "te", native: "తెలుగు", english: "Telugu" },
  { code: "ta", native: "தமிழ்", english: "Tamil" },
  { code: "gu", native: "ગુજરાતી", english: "Gujarati" },
  { code: "ur", native: "اردو", english: "Urdu" },
  { code: "kn", native: "ಕನ್ನಡ", english: "Kannada" },
  { code: "or", native: "ଓଡ଼ିଆ", english: "Odia" },
  { code: "pa", native: "ਪੰਜਾਬੀ", english: "Punjabi" },
  { code: "ml", native: "മലയാളം", english: "Malayalam" },
  { code: "as", native: "অসমীয়া", english: "Assamese" },
  { code: "mai", native: "मैथिली", english: "Maithili" },
  { code: "sat", native: "ᱥᱟᱱᱛᱟᱲᱤ", english: "Santali" },
  { code: "ks", native: "کٲشُر", english: "Kashmiri" },
  { code: "ne", native: "नेपाली", english: "Nepali" },
  { code: "kok", native: "कोंकणी", english: "Konkani" },
  { code: "sd", native: "سنڌي", english: "Sindhi" },
  { code: "dог", native: "डोगरी", english: "Dogri" },
  { code: "mni", native: "ꯃꯩꯇꯩꯂꯣꯟ", english: "Manipuri" },
  { code: "sa", native: "संस्कृतम्", english: "Sanskrit" },
];

// Stagger variants for list items
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const pageVariants: Variants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 48 : -48,
  }),
  center: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.42, ease: "easeOut" },
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -48 : 48,
    transition: { duration: 0.3, ease: "easeIn" },
  }),
};

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [direction, setDirection] = useState(1);
  const [permissions, setPermissions] = useState<
    Record<string, PermissionState>
  >(() => Object.fromEntries(PERMISSIONS.map((p) => [p.id, "pending"])));
  const [selectedLang, setSelectedLang] = useState<string | null>(null);

  function handlePermission(id: string, action: "allowed" | "denied") {
    setPermissions((prev) => ({ ...prev, [id]: action }));
  }

  function goToLanguageStep() {
    setDirection(1);
    setStep(2);
  }

  function handleConfirmLanguage() {
    if (selectedLang) {
      onComplete(selectedLang);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col overflow-hidden"
      style={{
        background:
          "linear-gradient(145deg, oklch(0.22 0.09 258) 0%, oklch(0.28 0.11 255) 50%, oklch(0.18 0.07 270) 100%)",
      }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Glow orbs */}
        <div className="absolute top-[-80px] right-[-60px] w-80 h-80 rounded-full bg-blue-400/15 blur-3xl" />
        <div className="absolute bottom-[-60px] left-[-40px] w-72 h-72 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-blue-600/8 blur-3xl" />
      </div>

      {/* Top logo bar */}
      <div className="relative z-10 flex items-center justify-center pt-10 pb-4 px-6 flex-shrink-0">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col items-center gap-2"
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
            style={{
              background: "oklch(0.45 0.18 255)",
              boxShadow: "0 4px 24px oklch(0.4 0.2 255 / 0.5)",
            }}
          >
            <Briefcase className="w-7 h-7 text-white" />
          </div>
          <span
            className="font-display font-bold text-xl tracking-tight"
            style={{ color: "oklch(0.95 0.02 240)" }}
          >
            JobFinder
          </span>
        </motion.div>
      </div>

      {/* Step progress indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="relative z-10 flex items-center justify-center gap-2 pb-4 flex-shrink-0"
      >
        <div
          className="w-8 h-1.5 rounded-full transition-all duration-500"
          style={{
            background:
              step === 1
                ? "oklch(0.72 0.18 215)"
                : "oklch(0.72 0.18 215 / 0.4)",
          }}
        />
        <div
          className="w-8 h-1.5 rounded-full transition-all duration-500"
          style={{
            background:
              step === 2
                ? "oklch(0.72 0.18 215)"
                : "oklch(0.72 0.18 215 / 0.4)",
          }}
        />
      </motion.div>

      {/* Main card area — scrollable content */}
      <div className="relative z-10 flex-1 overflow-hidden flex flex-col px-4 sm:px-6 pb-4 min-h-0">
        <AnimatePresence mode="wait" custom={direction}>
          {step === 1 ? (
            <motion.div
              key="step1"
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex-1 flex flex-col max-w-lg w-full mx-auto"
            >
              {/* Step 1 content */}
              <div className="mb-5 text-center">
                <h1
                  className="font-display font-bold text-2xl sm:text-3xl tracking-tight mb-1"
                  style={{ color: "oklch(0.97 0.01 240)" }}
                >
                  Welcome to JobFinder
                </h1>
                <p
                  style={{ color: "oklch(0.72 0.05 240)" }}
                  className="text-sm sm:text-base"
                >
                  Before we begin, we need a few permissions
                </p>
              </div>

              {/* Permission cards */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-3 flex-1 overflow-y-auto"
              >
                {PERMISSIONS.map((perm) => {
                  const state = permissions[perm.id];
                  const Icon = perm.icon;
                  return (
                    <motion.div
                      key={perm.id}
                      variants={itemVariants}
                      className="rounded-2xl border p-4 flex items-start gap-4 transition-all duration-300"
                      style={{
                        background:
                          state === "allowed"
                            ? "oklch(0.95 0.04 150 / 0.12)"
                            : state === "denied"
                              ? "oklch(0.95 0.02 240 / 0.06)"
                              : "oklch(1 0 0 / 0.07)",
                        borderColor:
                          state === "allowed"
                            ? "oklch(0.65 0.15 150 / 0.6)"
                            : state === "denied"
                              ? "oklch(0.7 0.02 240 / 0.3)"
                              : "oklch(1 0 0 / 0.15)",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      {/* Icon */}
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background:
                            state === "allowed"
                              ? "oklch(0.65 0.15 150 / 0.25)"
                              : "oklch(0.55 0.18 255 / 0.25)",
                        }}
                      >
                        <Icon
                          className="w-5 h-5"
                          style={{
                            color:
                              state === "allowed"
                                ? "oklch(0.72 0.18 150)"
                                : "oklch(0.75 0.15 220)",
                          }}
                        />
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <p
                          className="font-semibold text-sm"
                          style={{ color: "oklch(0.95 0.02 240)" }}
                        >
                          {perm.title}
                        </p>
                        <p
                          className="text-xs mt-0.5 leading-relaxed"
                          style={{ color: "oklch(0.68 0.04 245)" }}
                        >
                          {perm.description}
                        </p>
                        {/* Status badge */}
                        {state !== "pending" && (
                          <motion.span
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                            style={{
                              background:
                                state === "allowed"
                                  ? "oklch(0.65 0.15 150 / 0.2)"
                                  : "oklch(0.5 0.04 240 / 0.2)",
                              color:
                                state === "allowed"
                                  ? "oklch(0.65 0.18 150)"
                                  : "oklch(0.7 0.05 240)",
                            }}
                          >
                            {state === "allowed" ? (
                              <Check className="w-2.5 h-2.5" />
                            ) : (
                              <X className="w-2.5 h-2.5" />
                            )}
                            {state === "allowed" ? "Allowed" : "Denied"}
                          </motion.span>
                        )}
                      </div>

                      {/* Allow / Deny buttons */}
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => handlePermission(perm.id, "allowed")}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
                          style={{
                            background:
                              state === "allowed"
                                ? "oklch(0.65 0.17 150)"
                                : "oklch(0.65 0.17 150 / 0.18)",
                            color:
                              state === "allowed"
                                ? "white"
                                : "oklch(0.72 0.18 150)",
                            border: `1.5px solid oklch(0.65 0.17 150 / ${state === "allowed" ? "0.9" : "0.4"})`,
                          }}
                        >
                          <Check className="w-3 h-3" />
                          Allow
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePermission(perm.id, "denied")}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
                          style={{
                            background:
                              state === "denied"
                                ? "oklch(0.55 0.04 250 / 0.5)"
                                : "oklch(0.55 0.04 250 / 0.12)",
                            color: "oklch(0.72 0.04 250)",
                            border: `1.5px solid oklch(0.6 0.04 250 / ${state === "denied" ? "0.5" : "0.25"})`,
                          }}
                        >
                          <X className="w-3 h-3" />
                          Deny
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Continue button */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.4 }}
                className="mt-5 flex-shrink-0"
              >
                <button
                  type="button"
                  onClick={goToLanguageStep}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-white text-base transition-all duration-200 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.48 0.2 255) 0%, oklch(0.42 0.22 260) 100%)",
                    boxShadow:
                      "0 4px 20px oklch(0.42 0.22 260 / 0.5), 0 1px 4px oklch(0.25 0.1 260 / 0.3)",
                  }}
                >
                  Continue
                  <ChevronRight className="w-5 h-5" />
                </button>
                <p
                  className="text-center text-[11px] mt-2"
                  style={{ color: "oklch(0.62 0.05 245)" }}
                >
                  You can change these settings later
                </p>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex-1 flex flex-col max-w-lg w-full mx-auto min-h-0"
            >
              {/* Step 2 header */}
              <div className="mb-4 text-center flex-shrink-0">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: "oklch(0.48 0.2 255 / 0.3)" }}
                  >
                    <Languages
                      className="w-4 h-4"
                      style={{ color: "oklch(0.78 0.15 220)" }}
                    />
                  </div>
                </div>
                <h1
                  className="font-display font-bold text-2xl sm:text-3xl tracking-tight"
                  style={{ color: "oklch(0.97 0.01 240)" }}
                >
                  Choose Your Language
                </h1>
                <p
                  className="font-display font-semibold text-base mt-0.5"
                  style={{ color: "oklch(0.72 0.1 240)" }}
                >
                  अपनी भाषा चुनें
                </p>
                <p
                  className="text-xs mt-2"
                  style={{ color: "oklch(0.65 0.04 245)" }}
                >
                  Select your preferred language to continue
                </p>
              </div>

              {/* Language grid — scrollable, takes remaining space */}
              <div className="flex-1 overflow-y-auto overscroll-contain -mx-1 min-h-0">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 px-1 pb-4"
                >
                  {LANGUAGES.map((lang) => {
                    const isSelected = selectedLang === lang.code;
                    const isRtl = ["ur", "ks", "sd"].includes(lang.code);
                    return (
                      <motion.button
                        key={lang.code}
                        variants={itemVariants}
                        type="button"
                        onClick={() => setSelectedLang(lang.code)}
                        className="group relative rounded-xl p-3 text-left transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] focus:outline-none"
                        style={{
                          background: isSelected
                            ? "linear-gradient(135deg, oklch(0.42 0.2 255 / 0.4) 0%, oklch(0.38 0.22 260 / 0.5) 100%)"
                            : "oklch(1 0 0 / 0.07)",
                          border: `1.5px solid ${isSelected ? "oklch(0.62 0.2 250)" : "oklch(1 0 0 / 0.12)"}`,
                          boxShadow: isSelected
                            ? "0 0 0 2px oklch(0.62 0.2 250 / 0.35), 0 4px 16px oklch(0.38 0.22 260 / 0.3)"
                            : "none",
                          backdropFilter: "blur(8px)",
                        }}
                        dir={isRtl ? "rtl" : "ltr"}
                      >
                        {/* Selected checkmark */}
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
                            style={{
                              background: "oklch(0.62 0.2 250)",
                            }}
                          >
                            <Check className="w-2.5 h-2.5 text-white" />
                          </motion.div>
                        )}

                        <Globe
                          className="w-3.5 h-3.5 mb-1.5"
                          style={{
                            color: isSelected
                              ? "oklch(0.78 0.18 220)"
                              : "oklch(0.62 0.08 240)",
                          }}
                        />
                        <p
                          className="font-bold text-base leading-tight"
                          style={{
                            color: isSelected
                              ? "oklch(0.97 0.01 240)"
                              : "oklch(0.9 0.02 240)",
                            direction: isRtl ? "rtl" : "ltr",
                          }}
                        >
                          {lang.native}
                        </p>
                        <p
                          className="text-[10px] mt-0.5 font-medium"
                          style={{
                            color: isSelected
                              ? "oklch(0.72 0.1 230)"
                              : "oklch(0.62 0.04 245)",
                            direction: "ltr",
                          }}
                        >
                          {lang.english}
                        </p>
                      </motion.button>
                    );
                  })}
                </motion.div>
              </div>

              {/* Sticky Confirm button — always visible at bottom */}
              <div
                className="flex-shrink-0 pt-3 pb-2"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent 0%, oklch(0.22 0.09 258 / 0.95) 30%)",
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                >
                  <button
                    type="button"
                    onClick={handleConfirmLanguage}
                    disabled={!selectedLang}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-white text-base transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                    style={{
                      background: selectedLang
                        ? "linear-gradient(135deg, oklch(0.48 0.2 255) 0%, oklch(0.42 0.22 260) 100%)"
                        : "oklch(0.4 0.08 255)",
                      boxShadow: selectedLang
                        ? "0 4px 20px oklch(0.42 0.22 260 / 0.5), 0 1px 4px oklch(0.25 0.1 260 / 0.3)"
                        : "none",
                    }}
                  >
                    <Check className="w-5 h-5" />
                    Confirm Language
                  </button>
                  {!selectedLang && (
                    <p
                      className="text-center text-[11px] mt-2"
                      style={{ color: "oklch(0.62 0.05 245)" }}
                    >
                      Please select a language to continue
                    </p>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
