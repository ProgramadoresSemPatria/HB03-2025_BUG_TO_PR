"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Terminal, Github, Eye, EyeOff, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [showToken, setShowToken] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    githubToken: "",
  });
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Integrate with backend API
      // For now, simulate authentication
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Store token temporarily (will be replaced with proper auth)
      if (formData.githubToken) {
        localStorage.setItem("github_token", formData.githubToken);
      }
      
      toast.success(isRegister ? "Account created successfully!" : "Welcome back!");
      router.push("/dashboard");
    } catch {
      toast.error("Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Simple header for login */}
      <header className="border-b border-border/40 bg-card/30 backdrop-blur-sm">
        <div className="w-full max-w-6xl mx-auto px-6 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Terminal className="h-5 w-5 text-foreground" />
            <span className="font-semibold">bug-to-pr</span>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/10" />
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-chart-2/10 rounded-full blur-3xl" />

        <Card className="w-full max-w-md relative z-10 border-border/50 shadow-2xl backdrop-blur-sm bg-card/80">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
              <Terminal className="h-7 w-7 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">
              {isRegister ? "Create Account" : "Welcome Back"}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {isRegister
                ? "Sign up to start fixing bugs"
                : "Sign in to continue"}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="githubToken" className="text-sm font-medium flex items-center gap-2">
                    <Github className="h-4 w-4" />
                    GitHub Token
                  </Label>
                  <a
                    href="https://github.com/settings/tokens/new?scopes=repo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline"
                  >
                    Generate token
                  </a>
                </div>
                <div className="relative">
                  <Input
                    id="githubToken"
                    type={showToken ? "text" : "password"}
                    placeholder="ghp_xxxxxxxxxxxx"
                    value={formData.githubToken}
                    onChange={(e) =>
                      setFormData({ ...formData, githubToken: e.target.value })
                    }
                    required
                    className="h-11 pr-10 font-mono text-sm"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowToken(!showToken)}
                  >
                    {showToken ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Required for creating branches and pull requests
                </p>
              </div>

              <Button
                type="submit"
                className="w-full h-11 font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    {isRegister ? "Creating account..." : "Signing in..."}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {isRegister ? "Create Account" : "Sign In"}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {isRegister
                  ? "Already have an account? Sign in"
                  : "Don't have an account? Create one"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/40 py-4">
        <div className="w-full max-w-6xl mx-auto px-6 text-center text-sm text-muted-foreground">
          Made for developers, by developers
        </div>
      </footer>
    </div>
  );
}
