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
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#0a0e1a]">
      {/* Background with better contrast */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 opacity-50"
          style={{
            background: "radial-gradient(ellipse 100% 100% at 50% 0%, rgba(59, 130, 246, 0.12) 0%, transparent 50%)",
          }}
        />
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            background: "radial-gradient(ellipse 80% 80% at 100% 100%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)",
          }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent, transparent, rgba(10, 14, 26, 0.5))' }} />
      </div>

      <header className="relative z-10 border-b border-slate-800/60 bg-[#0a0e1a]/80 backdrop-blur-xl">
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
          {/* Enhanced glow effect */}
          <div 
            className="absolute -inset-1 rounded-xl opacity-40 blur-2xl"
            style={{
              background: "radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.15) 40%, transparent 70%)",
            }}
          />
          <Card className="relative z-10 w-full border-slate-700/70 shadow-2xl backdrop-blur-xl bg-[#111827]/95 dark:bg-[#111827]/95">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center">
              <img
                src="/logo.gif"
                alt=""
                className="h-14 w-14 object-contain"
                style={{ imageRendering: "auto" }}
              />
            </div>
            <CardTitle 
              className="text-3xl font-bold tracking-tight mb-2"
              style={{ fontFamily: '"Lyondisplay App", Georgia, serif', fontWeight: 300 }}
            >
              {isRegister ? "Create Account" : "Welcome Back"}
            </CardTitle>
            <CardDescription 
              className="text-slate-400"
              style={{ fontFamily: '"Suisseintl", sans-serif', fontWeight: 300 }}
            >
              {isRegister
                ? "Sign up to start fixing bugs"
                : "Sign in to continue"}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-slate-200">
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
                  className={`h-11 bg-[#1f2937]/80 border-slate-600/70 text-white placeholder:text-slate-400 focus:border-primary focus:ring-primary/40 focus:bg-[#1f2937] transition-colors ${errors.email ? "border-destructive" : ""}`}
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-slate-200">
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
                  className={`h-11 bg-[#1f2937]/80 border-slate-600/70 text-white placeholder:text-slate-400 focus:border-primary focus:ring-primary/40 focus:bg-[#1f2937] transition-colors ${errors.password ? "border-destructive" : ""}`}
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
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="githubToken" className="text-sm font-medium text-slate-200 flex items-center gap-2">
                      <Github className="h-4 w-4" />
                      GitHub Token
                    </Label>
                    <a
                      href={config.github.tokenUrl}
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
                      onChange={(e) => handleChange("githubToken", e.target.value)}
                      onBlur={() => handleBlur("githubToken")}
                      required
                      className={`h-11 pr-10 font-mono text-sm bg-[#1f2937]/80 border-slate-600/70 text-white placeholder:text-slate-400 focus:border-primary focus:ring-primary/40 focus:bg-[#1f2937] transition-colors ${errors.githubToken ? "border-destructive" : ""}`}
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
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {errors.githubToken ? (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.githubToken}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Required for creating branches and pull requests
                    </p>
                  )}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11 font-medium uppercase bg-white text-black hover:bg-white/90"
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
      </div>

      <Footer maxWidth="max-w-6xl" variant="slate" />
    </div>
  );
}
