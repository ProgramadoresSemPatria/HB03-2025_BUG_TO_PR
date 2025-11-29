/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Github, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";
import { toast } from "sonner";
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
import { Footer } from "@/components/shared";
import { ROUTES } from "@/constants";
import { config } from "@/config";
import { authService } from "@/services/auth";
import { createSessionSchema, createUserSchema } from "@/validators/auth.validator";
import type { ZodIssue } from "zod";
import type { AuthFormData } from "@/types";

export default function LoginPage() {
  const router = useRouter();
  const [showToken, setShowToken] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<AuthFormData>({
    email: "",
    password: "",
    githubToken: "",
  });
  const [isRegister, setIsRegister] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    githubToken?: string;
  }>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (field: "email" | "password" | "githubToken", value: string) => {
    if (isRegister) {
      const result = createUserSchema.safeParse({
        email: formData.email,
        password: formData.password,
        githubToken: formData.githubToken,
        [field]: value,
      });
      if (!result.success) {
        const fieldError = result.error.issues.find((e) => e.path.includes(field));
        return fieldError?.message;
      }
    } else if (field !== "githubToken") {
      const result = createSessionSchema.safeParse({
        email: formData.email,
        password: formData.password,
        [field]: value,
      });
      if (!result.success) {
        const fieldError = result.error.issues.find((e) => e.path.includes(field));
        return fieldError?.message;
      }
    }
    return undefined;
  };

  const handleBlur = (field: "email" | "password" | "githubToken") => {
    setTouched({ ...touched, [field]: true });
    const error = validateField(field, formData[field]);
    setErrors({ ...errors, [field]: error });
  };

  const handleChange = (field: "email" | "password" | "githubToken", value: string) => {
    setFormData({ ...formData, [field]: value });
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors({ ...errors, [field]: error });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const allTouched = {
      email: true,
      password: true,
      githubToken: isRegister ? true : false,
    };
    setTouched(allTouched);

    try {
      if (isRegister) {
        const validationResult = createUserSchema.safeParse({
          email: formData.email,
          password: formData.password,
          githubToken: formData.githubToken,
        });

        if (!validationResult.success) {
          const newErrors: typeof errors = {};
          validationResult.error.issues.forEach((err: ZodIssue) => {
            const field = err.path[0] as keyof typeof newErrors;
            if (field && typeof field === "string") {
              newErrors[field] = err.message;
            }
          });
          setErrors(newErrors);
          const firstError = validationResult.error.issues[0];
          toast.error(firstError.message);
          setIsLoading(false);
          return;
        }

        await authService.register({
          email: formData.email,
          password: formData.password,
          githubToken: formData.githubToken,
        });
        toast.success("Account created successfully! Please sign in.");
        setIsRegister(false);
        setFormData({ ...formData, githubToken: "" });
      } else {
        const validationResult = createSessionSchema.safeParse({
          email: formData.email,
          password: formData.password,
        });

        if (!validationResult.success) {
          const newErrors: typeof errors = {};
          validationResult.error.issues.forEach((err: ZodIssue) => {
            const field = err.path[0] as keyof typeof newErrors;
            if (field && typeof field === "string") {
              newErrors[field] = err.message;
            }
          });
          setErrors(newErrors);
          const firstError = validationResult.error.issues[0];
          toast.error(firstError.message);
          setIsLoading(false);
          return;
        }

        await authService.login({
          email: formData.email,
          password: formData.password,
        });
        toast.success("Welcome back!");
        router.push(ROUTES.DASHBOARD);
      }
    } catch (error: any) {
      const errorMessage = error?.message || "Authentication failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#0a0a0a]">
      {/* Background gradients - Warp style */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: "radial-gradient(ellipse 100% 100% at 50% 0%, rgba(34, 211, 238, 0.05) 0%, transparent 50%)",
          }}
        />
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            background: "radial-gradient(ellipse 80% 80% at 100% 100%, rgba(34, 211, 238, 0.03) 0%, transparent 50%)",
          }}
        />
      </div>

      <header className="relative z-10 border-b border-slate-900/80 bg-[#0a0a0a]/90 backdrop-blur-xl">
        <div className="w-full max-w-6xl mx-auto px-6 h-16 flex items-center">
          <Link href={ROUTES.HOME} className="flex items-center hover:opacity-80 transition-opacity -ml-4 sm:-ml-6">
            <img
              src="/logo.gif"
              alt=""
              className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 object-contain"
              style={{ imageRendering: "auto" }}
            />
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="relative w-full max-w-md">
          {/* Glow effect - Warp style */}
          <div 
            className="absolute -inset-0.5 rounded opacity-20 blur-2xl"
            style={{
              background: "radial-gradient(circle at 50% 50%, rgba(34, 211, 238, 0.1) 0%, transparent 70%)",
            }}
          />
          <Card className="relative z-10 w-full border-slate-900/80 bg-[#0a0a0a]/95 backdrop-blur-xl overflow-hidden" style={{ 
            boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.05), 0 8px 32px rgba(0, 0, 0, 0.5)',
          }}>
          <CardHeader className="text-center pb-6 border-b border-slate-900/50">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center">
              <img
                src="/logo.gif"
                alt=""
                className="h-14 w-14 object-contain"
                style={{ imageRendering: "auto" }}
              />
            </div>
            <CardTitle 
              className="text-xl font-normal tracking-tight mb-1.5 text-white"
              style={{ fontFamily: 'var(--font-geist-mono), ui-monospace, monospace', fontWeight: 400, letterSpacing: '-0.01em' }}
            >
              {isRegister ? "Create Account" : "Welcome Back"}
            </CardTitle>
            <CardDescription 
              className="text-slate-400 text-xs"
              style={{ fontFamily: 'var(--font-geist-mono), ui-monospace, monospace', fontWeight: 400 }}
            >
              {isRegister
                ? "Sign up to start fixing bugs"
                : "Sign in to continue"}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-normal text-slate-400 uppercase tracking-wider" style={{ fontFamily: 'var(--font-geist-mono), ui-monospace, monospace' }}>
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  required
                  className={`h-9 bg-[#0a0a0a] border-slate-800/70 text-white placeholder:text-slate-500 focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/40 font-mono text-sm ${errors.email ? "border-red-500/50" : ""}`}
                  style={{
                    fontFamily: 'var(--font-geist-mono), ui-monospace, monospace',
                    boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
                  }}
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-normal text-slate-400 uppercase tracking-wider" style={{ fontFamily: 'var(--font-geist-mono), ui-monospace, monospace' }}>
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  onBlur={() => handleBlur("password")}
                  required
                  className={`h-9 bg-[#0a0a0a] border-slate-800/70 text-white placeholder:text-slate-500 focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/40 font-mono text-sm ${errors.password ? "border-red-500/50" : ""}`}
                  style={{
                    fontFamily: 'var(--font-geist-mono), ui-monospace, monospace',
                    boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
                  }}
                  aria-invalid={!!errors.password}
                />
                {errors.password && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.password}
                  </p>
                )}
              </div>

              {isRegister && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="githubToken" className="text-xs font-normal text-slate-400 uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: 'var(--font-geist-mono), ui-monospace, monospace' }}>
                      <Github className="h-3 w-3 text-slate-500" />
                      GitHub Token
                    </Label>
                    <a
                      href={config.github.tokenUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-mono transition-colors"
                      style={{ fontFamily: 'var(--font-geist-mono), ui-monospace, monospace' }}
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
                      onChange={(e) => handleChange("githubToken", e.target.value)}
                      onBlur={() => handleBlur("githubToken")}
                      required
                      className={`h-9 pr-10 font-mono text-sm bg-[#0a0a0a] border-slate-800/70 text-white placeholder:text-slate-500 focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/40 ${errors.githubToken ? "border-red-500/50" : ""}`}
                      style={{
                        fontFamily: 'var(--font-geist-mono), ui-monospace, monospace',
                        boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
                      }}
                      aria-invalid={!!errors.githubToken}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowToken(!showToken)}
                    >
                      {showToken ? (
                        <EyeOff className="h-4 w-4 text-slate-500 hover:text-slate-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-slate-500 hover:text-slate-400" />
                      )}
                    </Button>
                  </div>
                  {errors.githubToken ? (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.githubToken}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-600 font-mono">
                      Required for creating branches and pull requests
                    </p>
                  )}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-10 text-sm gap-2 bg-white text-black hover:bg-white/95 uppercase font-mono tracking-wide"
                style={{
                  fontFamily: 'var(--font-geist-mono), ui-monospace, monospace',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                }}
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
                onClick={() => {
                  setIsRegister(!isRegister);
                  setErrors({});
                  setTouched({});
                  if (!isRegister) {
                    setFormData({ ...formData, githubToken: "" });
                  }
                }}
                className="text-xs text-slate-500 hover:text-slate-400 transition-colors font-mono"
                style={{ fontFamily: 'var(--font-geist-mono), ui-monospace, monospace' }}
              >
                {isRegister
                  ? "Already have an account? Sign in"
                  : "Don't have an account? Create one"}
              </button>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>

      <Footer maxWidth="max-w-6xl" variant="slate" />
    </div>
  );
}
