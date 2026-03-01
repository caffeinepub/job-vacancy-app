import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, LogIn, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function AuthPanel() {
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
    toast.info("Feature coming soon", {
      description: "Authentication will be available in the next update.",
    });
  }

  function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    toast.info("Feature coming soon", {
      description: "Account creation will be available in the next update.",
    });
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
                onClick={() =>
                  toast.info("Feature coming soon", {
                    description: "Password reset will be available soon.",
                  })
                }
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
                  placeholder="Min. 8 characters"
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
