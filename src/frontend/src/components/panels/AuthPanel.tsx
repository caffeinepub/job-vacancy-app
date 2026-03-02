import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, LogIn, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export interface AuthUser {
  name: string;
  email: string;
}

interface AuthPanelProps {
  onLogin?: (user: AuthUser) => void;
}

export function AuthPanel({ onLogin }: AuthPanelProps) {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [signIn, setSignIn] = useState({ email: "", password: "" });
  const [signUp, setSignUp] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    if (!signIn.email || !signIn.password) {
      toast.error("Please enter your email and password.");
      return;
    }
    // Use stored name if available, else derive from email
    const storedName =
      localStorage.getItem("jf_user_name") || signIn.email.split("@")[0];
    const user: AuthUser = { name: storedName, email: signIn.email };
    localStorage.setItem("jf_user_name", user.name);
    localStorage.setItem("jf_user_email", user.email);
    toast.success(`Welcome back, ${user.name}!`);
    onLogin?.(user);
  }

  function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    if (!signUp.name || !signUp.email || !signUp.password) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (signUp.password !== signUp.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (signUp.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    const user: AuthUser = { name: signUp.name, email: signUp.email };
    localStorage.setItem("jf_user_name", user.name);
    localStorage.setItem("jf_user_email", user.email);
    toast.success(`Account created! Welcome, ${user.name}!`);
    onLogin?.(user);
  }

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-display font-bold text-foreground">
          Welcome to JobFinder
        </h2>
        <p className="text-sm text-muted-foreground">
          Sign in or create an account to access all features.
        </p>
      </div>

      <Tabs defaultValue="signin" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-secondary/60">
          <TabsTrigger value="signin" className="gap-2">
            <LogIn className="w-3.5 h-3.5" />
            Sign In
          </TabsTrigger>
          <TabsTrigger value="signup" className="gap-2">
            <UserPlus className="w-3.5 h-3.5" />
            Sign Up
          </TabsTrigger>
        </TabsList>

        {/* Sign In Tab */}
        <TabsContent value="signin" className="mt-6">
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="signin-email">Email Address</Label>
              <Input
                id="signin-email"
                type="email"
                placeholder="you@example.com"
                value={signIn.email}
                onChange={(e) =>
                  setSignIn((p) => ({ ...p, email: e.target.value }))
                }
                autoComplete="email"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="signin-password">Password</Label>
              <div className="relative">
                <Input
                  id="signin-password"
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={signIn.password}
                  onChange={(e) =>
                    setSignIn((p) => ({ ...p, password: e.target.value }))
                  }
                  autoComplete="current-password"
                  className="pr-10"
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
            <Button type="submit" className="w-full mt-2">
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Forgot your password?{" "}
              <button
                type="button"
                className="text-primary underline hover:text-primary/80"
                onClick={() => toast.info("Password reset coming soon.")}
              >
                Reset it
              </button>
            </p>
          </form>
        </TabsContent>

        {/* Sign Up Tab */}
        <TabsContent value="signup" className="mt-6">
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="signup-name">Full Name</Label>
              <Input
                id="signup-name"
                type="text"
                placeholder="Priya Sharma"
                value={signUp.name}
                onChange={(e) =>
                  setSignUp((p) => ({ ...p, name: e.target.value }))
                }
                autoComplete="name"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="signup-email">Email Address</Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="you@example.com"
                value={signUp.email}
                onChange={(e) =>
                  setSignUp((p) => ({ ...p, email: e.target.value }))
                }
                autoComplete="email"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="signup-password">Password</Label>
              <div className="relative">
                <Input
                  id="signup-password"
                  type={showPass ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  value={signUp.password}
                  onChange={(e) =>
                    setSignUp((p) => ({ ...p, password: e.target.value }))
                  }
                  autoComplete="new-password"
                  className="pr-10"
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
              <Label htmlFor="signup-confirm">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="signup-confirm"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter password"
                  value={signUp.confirmPassword}
                  onChange={(e) =>
                    setSignUp((p) => ({
                      ...p,
                      confirmPassword: e.target.value,
                    }))
                  }
                  autoComplete="new-password"
                  className="pr-10"
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
            <Button type="submit" className="w-full mt-2">
              <UserPlus className="w-4 h-4 mr-2" />
              Create Account
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              By creating an account, you agree to our{" "}
              <button
                type="button"
                className="text-primary underline hover:text-primary/80"
                onClick={() => toast.info("Terms coming soon")}
              >
                Terms of Service
              </button>
            </p>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
