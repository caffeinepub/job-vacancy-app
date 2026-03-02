import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  LogIn,
  Mail,
  Phone,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { UserAccount, backendInterface } from "../../backend.d";
import { useActor } from "../../hooks/useActor";

// ── Exported types ────────────────────────────────────────────────────────────

export interface AuthUser {
  name: string;
  email: string;
  phone: string;
  userId: string;
  authMethod: "email" | "phone";
  createdAt: number; // timestamp ms
}

interface AuthPanelProps {
  onLogin?: (user: AuthUser) => void;
}

// ── Helper functions ──────────────────────────────────────────────────────────

function simpleHash(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h = h & h;
  }
  return Math.abs(h).toString(16);
}

function mapUserAccount(u: UserAccount): AuthUser {
  return {
    name: u.fullName,
    email: u.email ?? "",
    phone: u.phone ?? "",
    userId: u.userId,
    authMethod: u.authMethod.__kind__ === "email" ? "email" : "phone",
    createdAt:
      typeof u.createdAt === "bigint"
        ? Number(u.createdAt / 1_000_000n)
        : Number(u.createdAt),
  };
}

function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function persistUser(user: AuthUser) {
  localStorage.setItem("jf_user_name", user.name);
  localStorage.setItem("jf_user_email", user.email);
  localStorage.setItem("jf_user_phone", user.phone);
  localStorage.setItem("jf_user_id", user.userId);
  localStorage.setItem("jf_user_auth_method", user.authMethod);
  localStorage.setItem("jf_user_created_at", String(user.createdAt));
}

function fallbackEmailUser(name: string, email: string): AuthUser {
  const existing = localStorage.getItem("jf_user_id");
  const userId = existing || `jf-${Date.now()}`;
  const now = Date.now();
  return {
    name,
    email,
    phone: "",
    userId,
    authMethod: "email",
    createdAt: now,
  };
}

function fallbackPhoneUser(name: string, phone: string): AuthUser {
  const existing = localStorage.getItem("jf_user_id");
  const userId = existing || `jf-${Date.now()}`;
  const now = Date.now();
  return {
    name: name || phone,
    email: "",
    phone,
    userId,
    authMethod: "phone",
    createdAt: now,
  };
}

// ── Email Login Sub-form ──────────────────────────────────────────────────────

interface SubFormProps {
  actor: backendInterface | null;
  onLogin: (u: AuthUser) => void;
}

function EmailLoginForm({ actor, onLogin }: SubFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Please enter your email and password.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      if (actor) {
        const result = await actor.loginWithEmail(
          email.trim(),
          simpleHash(password),
        );
        if (result.__kind__ === "ok") {
          const u = mapUserAccount(result.ok);
          persistUser(u);
          toast.success(`Welcome back, ${u.name}!`);
          onLogin(u);
          return;
        }
        const err = result.err;
        if (err === "not_found") {
          toast.error("No account found with this email.");
        } else if (err === "wrong_password") {
          toast.error("Incorrect password. Please try again.");
        } else {
          toast.error("Login failed. Please try again.");
        }
        return;
      }
    } catch {
      // fall through to localStorage fallback
    } finally {
      setLoading(false);
    }
    // Fallback: localStorage-based
    const storedEmail = localStorage.getItem("jf_user_email");
    const storedName = localStorage.getItem("jf_user_name");
    const name =
      storedEmail === email.trim() && storedName
        ? storedName
        : email.trim().split("@")[0];
    const u = fallbackEmailUser(name, email.trim());
    persistUser(u);
    toast.success(`Welcome back, ${u.name}!`);
    onLogin(u);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email-login-email">Email Address</Label>
        <Input
          id="email-login-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          disabled={loading}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email-login-password">Password</Label>
        <div className="relative">
          <Input
            id="email-login-password"
            type={showPass ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="pr-10"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPass((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPass ? "Hide password" : "Show password"}
          >
            {showPass ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
      <Button type="submit" className="w-full mt-2" disabled={loading}>
        {loading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <LogIn className="w-4 h-4 mr-2" />
        )}
        {loading ? "Signing in..." : "Login with Email"}
      </Button>
    </form>
  );
}

// ── Phone Login Sub-form ──────────────────────────────────────────────────────

function PhoneLoginForm({ actor, onLogin }: SubFormProps) {
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim() || phone.trim().length < 10) {
      toast.error("Please enter a valid phone number.");
      return;
    }
    const otp = generateOtp();
    setGeneratedOtp(otp);
    setOtpSent(true);
    toast.success(`OTP sent! Your OTP is: ${otp}`, { duration: 10000 });
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (otpInput.trim() !== generatedOtp) {
      toast.error("Wrong OTP. Please try again.");
      return;
    }
    setLoading(true);
    try {
      if (actor) {
        const result = await actor.loginWithPhone(phone.trim());
        if (result.__kind__ === "ok") {
          const u = mapUserAccount(result.ok);
          persistUser(u);
          toast.success(`Welcome back, ${u.name}!`);
          onLogin(u);
          return;
        }
        const err = result.err;
        if (err === "not_found") {
          toast.error("No account found with this phone number.");
        } else {
          toast.error("Login failed. Please try again.");
        }
        return;
      }
    } catch {
      // fall through
    } finally {
      setLoading(false);
    }
    // Fallback
    const storedPhone = localStorage.getItem("jf_user_phone");
    const storedName = localStorage.getItem("jf_user_name");
    const name =
      storedPhone === phone.trim() && storedName ? storedName : phone.trim();
    const u = fallbackPhoneUser(name, phone.trim());
    persistUser(u);
    toast.success(`Welcome back, ${u.name}!`);
    onLogin(u);
  }

  if (!otpSent) {
    return (
      <form onSubmit={handleSendOtp} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="phone-login-number">Phone Number</Label>
          <Input
            id="phone-login-number"
            type="tel"
            placeholder="+91 98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
          />
        </div>
        <Button type="submit" className="w-full mt-2">
          <Phone className="w-4 h-4 mr-2" />
          Send OTP
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleVerify} className="space-y-4">
      <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
        <p className="text-xs text-emerald-700">
          OTP sent to <strong>{phone}</strong>. Check the notification.
        </p>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="phone-login-otp">Enter 6-digit OTP</Label>
        <Input
          id="phone-login-otp"
          type="text"
          inputMode="numeric"
          maxLength={6}
          placeholder="• • • • • •"
          value={otpInput}
          onChange={(e) =>
            setOtpInput(e.target.value.replace(/\D/g, "").slice(0, 6))
          }
          className="tracking-[0.5em] text-center font-mono text-lg"
          disabled={loading}
        />
      </div>
      <Button
        type="submit"
        className="w-full mt-2"
        disabled={loading || otpInput.length !== 6}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <LogIn className="w-4 h-4 mr-2" />
        )}
        {loading ? "Verifying..." : "Verify & Login"}
      </Button>
      <button
        type="button"
        className="w-full text-xs text-muted-foreground hover:text-foreground text-center transition-colors"
        onClick={() => {
          setOtpSent(false);
          setOtpInput("");
          setGeneratedOtp("");
        }}
      >
        ← Change phone number
      </button>
    </form>
  );
}

// ── Email Signup Sub-form ─────────────────────────────────────────────────────

function EmailSignupForm({ actor, onLogin }: SubFormProps) {
  const [fields, setFields] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fields.name.trim() || !fields.email.trim() || !fields.password) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (fields.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (fields.password !== fields.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      if (actor) {
        const result = await actor.registerWithEmail(
          fields.name.trim(),
          fields.email.trim(),
          simpleHash(fields.password),
        );
        if (result.__kind__ === "ok") {
          const u = mapUserAccount(result.ok);
          persistUser(u);
          toast.success(`Account created! Welcome, ${u.name}!`);
          onLogin(u);
          return;
        }
        const err = result.err;
        if (err === "email_exists") {
          toast.error("This email is already registered.");
        } else {
          toast.error("Registration failed. Please try again.");
        }
        return;
      }
    } catch {
      // fall through
    } finally {
      setLoading(false);
    }
    // Fallback
    const u = fallbackEmailUser(fields.name.trim(), fields.email.trim());
    persistUser(u);
    toast.success(`Account created! Welcome, ${u.name}!`);
    onLogin(u);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email-signup-name">Full Name</Label>
        <Input
          id="email-signup-name"
          type="text"
          placeholder="Priya Sharma"
          value={fields.name}
          onChange={(e) => setFields((p) => ({ ...p, name: e.target.value }))}
          autoComplete="name"
          disabled={loading}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email-signup-email">Email Address</Label>
        <Input
          id="email-signup-email"
          type="email"
          placeholder="you@example.com"
          value={fields.email}
          onChange={(e) => setFields((p) => ({ ...p, email: e.target.value }))}
          autoComplete="email"
          disabled={loading}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email-signup-password">Password</Label>
        <div className="relative">
          <Input
            id="email-signup-password"
            type={showPass ? "text" : "password"}
            placeholder="Min. 6 characters"
            value={fields.password}
            onChange={(e) =>
              setFields((p) => ({ ...p, password: e.target.value }))
            }
            autoComplete="new-password"
            className="pr-10"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPass((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPass ? "Hide password" : "Show password"}
          >
            {showPass ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email-signup-confirm">Confirm Password</Label>
        <div className="relative">
          <Input
            id="email-signup-confirm"
            type={showConfirm ? "text" : "password"}
            placeholder="Re-enter password"
            value={fields.confirmPassword}
            onChange={(e) =>
              setFields((p) => ({ ...p, confirmPassword: e.target.value }))
            }
            autoComplete="new-password"
            className="pr-10"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showConfirm ? "Hide password" : "Show password"}
          >
            {showConfirm ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
      <Button type="submit" className="w-full mt-2" disabled={loading}>
        {loading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <UserPlus className="w-4 h-4 mr-2" />
        )}
        {loading ? "Creating account..." : "Create Account"}
      </Button>
    </form>
  );
}

// ── Phone Signup Sub-form ─────────────────────────────────────────────────────

function PhoneSignupForm({ actor, onLogin }: SubFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      toast.error("Please enter a valid phone number.");
      return;
    }
    const otp = generateOtp();
    setGeneratedOtp(otp);
    setOtpSent(true);
    toast.success(`OTP sent! Your OTP is: ${otp}`, { duration: 10000 });
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (otpInput.trim() !== generatedOtp) {
      toast.error("Wrong OTP. Please try again.");
      return;
    }
    setLoading(true);
    try {
      if (actor) {
        const result = await actor.registerWithPhone(name.trim(), phone.trim());
        if (result.__kind__ === "ok") {
          const u = mapUserAccount(result.ok);
          persistUser(u);
          toast.success(`Account created! Welcome, ${u.name}!`);
          onLogin(u);
          return;
        }
        const err = result.err;
        if (err === "phone_exists") {
          toast.error("This phone number is already registered.");
        } else {
          toast.error("Registration failed. Please try again.");
        }
        return;
      }
    } catch {
      // fall through
    } finally {
      setLoading(false);
    }
    // Fallback
    const u = fallbackPhoneUser(name.trim(), phone.trim());
    persistUser(u);
    toast.success(`Account created! Welcome, ${u.name}!`);
    onLogin(u);
  }

  if (!otpSent) {
    return (
      <form onSubmit={handleSendOtp} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="phone-signup-name">Full Name</Label>
          <Input
            id="phone-signup-name"
            type="text"
            placeholder="Priya Sharma"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone-signup-number">Phone Number</Label>
          <Input
            id="phone-signup-number"
            type="tel"
            placeholder="+91 98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
          />
        </div>
        <Button type="submit" className="w-full mt-2">
          <Phone className="w-4 h-4 mr-2" />
          Send OTP
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleVerify} className="space-y-4">
      <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
        <p className="text-xs text-emerald-700">
          OTP sent to <strong>{phone}</strong>. Check the notification.
        </p>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="phone-signup-otp">Enter 6-digit OTP</Label>
        <Input
          id="phone-signup-otp"
          type="text"
          inputMode="numeric"
          maxLength={6}
          placeholder="• • • • • •"
          value={otpInput}
          onChange={(e) =>
            setOtpInput(e.target.value.replace(/\D/g, "").slice(0, 6))
          }
          className="tracking-[0.5em] text-center font-mono text-lg"
          disabled={loading}
        />
      </div>
      <Button
        type="submit"
        className="w-full mt-2"
        disabled={loading || otpInput.length !== 6}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <UserPlus className="w-4 h-4 mr-2" />
        )}
        {loading ? "Creating account..." : "Verify & Create Account"}
      </Button>
      <button
        type="button"
        className="w-full text-xs text-muted-foreground hover:text-foreground text-center transition-colors"
        onClick={() => {
          setOtpSent(false);
          setOtpInput("");
          setGeneratedOtp("");
        }}
      >
        ← Change phone number
      </button>
    </form>
  );
}

// ── Method selector buttons ───────────────────────────────────────────────────

type LoginMethod = "email" | "phone" | null;

function MethodSelector({
  selected,
  onSelect,
  loginLabel,
}: {
  selected: LoginMethod;
  onSelect: (m: LoginMethod) => void;
  loginLabel?: boolean;
}) {
  const emailActive = selected === "email";
  const phoneActive = selected === "phone";
  const verb = loginLabel ? "Login with" : "Signup with";
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={() => onSelect(emailActive ? null : "email")}
        className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl border text-sm font-medium transition-all ${
          emailActive
            ? "bg-primary text-primary-foreground border-primary shadow-sm"
            : "bg-card border-border text-foreground hover:border-primary/50 hover:bg-primary/5"
        }`}
      >
        <Mail className="w-4 h-4 flex-shrink-0" />
        <span>{verb} Email</span>
      </button>
      <button
        type="button"
        onClick={() => onSelect(phoneActive ? null : "phone")}
        className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl border text-sm font-medium transition-all ${
          phoneActive
            ? "bg-primary text-primary-foreground border-primary shadow-sm"
            : "bg-card border-border text-foreground hover:border-primary/50 hover:bg-primary/5"
        }`}
      >
        <Phone className="w-4 h-4 flex-shrink-0" />
        <span>{verb} Phone</span>
      </button>
    </div>
  );
}

// ── Main AuthPanel component ──────────────────────────────────────────────────

export function AuthPanel({ onLogin }: AuthPanelProps) {
  const { actor } = useActor();
  const [loginMethod, setLoginMethod] = useState<LoginMethod>(null);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-display font-bold text-foreground">
          Welcome to JobFinder
        </h2>
        <p className="text-sm text-muted-foreground">
          Sign in or create an account to access all features.
        </p>
      </div>

      <Tabs
        defaultValue="email-signup"
        className="w-full"
        onValueChange={() => {
          setLoginMethod(null);
        }}
      >
        <TabsList className="grid w-full grid-cols-3 bg-secondary/60">
          <TabsTrigger
            value="email-signup"
            className="overflow-hidden w-full text-xs"
          >
            <span className="truncate">Email Signup</span>
          </TabsTrigger>
          <TabsTrigger
            value="phone-signup"
            className="overflow-hidden w-full text-xs"
          >
            <span className="truncate">Phone Signup</span>
          </TabsTrigger>
          <TabsTrigger value="login" className="overflow-hidden w-full text-xs">
            <span className="truncate">Login</span>
          </TabsTrigger>
        </TabsList>

        {/* ── Email Signup Tab ── */}
        <TabsContent value="email-signup" className="mt-5">
          <div className="rounded-xl border border-border bg-card/60 p-4">
            <EmailSignupForm actor={actor} onLogin={(u) => onLogin?.(u)} />
          </div>
        </TabsContent>

        {/* ── Phone Signup Tab ── */}
        <TabsContent value="phone-signup" className="mt-5">
          <div className="rounded-xl border border-border bg-card/60 p-4">
            <PhoneSignupForm actor={actor} onLogin={(u) => onLogin?.(u)} />
          </div>
        </TabsContent>

        {/* ── Login Tab ── */}
        <TabsContent value="login" className="mt-5 space-y-5">
          <MethodSelector
            selected={loginMethod}
            onSelect={setLoginMethod}
            loginLabel
          />
          {loginMethod === "email" && (
            <div className="rounded-xl border border-border bg-card/60 p-4">
              <EmailLoginForm actor={actor} onLogin={(u) => onLogin?.(u)} />
            </div>
          )}
          {loginMethod === "phone" && (
            <div className="rounded-xl border border-border bg-card/60 p-4">
              <PhoneLoginForm actor={actor} onLogin={(u) => onLogin?.(u)} />
            </div>
          )}
          {!loginMethod && (
            <p className="text-center text-xs text-muted-foreground pt-2">
              Select a login method above to continue.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
