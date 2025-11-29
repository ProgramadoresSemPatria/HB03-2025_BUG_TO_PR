"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bug, FileCode, Rocket, Sparkles, AlertCircle, Loader2 } from "lucide-react";
import { generatePRSchema } from "@/validators/analysis.validator";
import { useRepositories } from "@/hooks/use-repositories";
import type { AnalysisFormData } from "@/types";

interface AnalysisFormProps {
  formData: AnalysisFormData;
  onFormDataChange: (data: AnalysisFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
}

interface FieldErrors {
  owner?: string;
  repo?: string;
  branch?: string;
  stackTrace?: string;
}

export function AnalysisForm({
  formData,
  onFormDataChange,
  onSubmit,
  isSubmitting = false,
}: AnalysisFormProps) {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const { owners, repositoriesByOwner, isLoading: isLoadingRepos } = useRepositories();
  
  const cardRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fieldRefs = useRef<(HTMLDivElement | null)[]>([]);
  const glowRef = useRef<HTMLDivElement>(null);

  const validateField = (field: keyof AnalysisFormData, value: string | undefined) => {
    const result = generatePRSchema.safeParse({
      ...formData,
      [field]: value,
    });

    if (!result.success) {
      const fieldError = result.error.issues.find((e) => e.path.includes(field));
      return fieldError?.message;
    }
    return undefined;
  };

  const handleBlur = (field: keyof AnalysisFormData) => {
    setTouched({ ...touched, [field]: true });
    const error = validateField(field, formData[field]);
    setErrors({ ...errors, [field]: error });
  };

  const handleChange = (field: keyof AnalysisFormData, value: string | undefined) => {
    onFormDataChange({ ...formData, [field]: value });
    
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors({ ...errors, [field]: error });
    }
  };

  const handleInputChange = (field: keyof AnalysisFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(field, e.target.value);
  };

  const handleTextareaChange = (field: keyof AnalysisFormData) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleChange(field, e.target.value);
  };

  const handleOwnerChange = (owner: string) => {
    const newFormData = { ...formData, owner, repo: "", branch: "main" };
    onFormDataChange(newFormData);
    
    if (touched.owner) {
      const error = validateField("owner", owner);
      setErrors({ ...errors, owner: error, repo: undefined });
    }
  };

  const handleRepoChange = (repoName: string) => {
    const selectedRepo = repositoriesByOwner[formData.owner]?.find(
      (r) => r.name === repoName
    );
    
    const newFormData = {
      ...formData,
      repo: repoName,
      branch: selectedRepo?.defaultBranch || "main",
    };
    onFormDataChange(newFormData);
    
    if (touched.repo) {
      const error = validateField("repo", repoName);
      setErrors({ ...errors, repo: error });
    }
  };

  const availableRepos = formData.owner
    ? repositoriesByOwner[formData.owner] || []
    : [];

  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadGSAP = async () => {
      const gsap = (await import("gsap")).default;
      
      if (!cardRef.current || !formRef.current) return;

      const ctx = gsap.context(() => {
        // Card entrance animation
        gsap.fromTo(
          cardRef.current,
          {
            opacity: 0,
            scale: 0.96,
            y: 20,
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          }
        );

        // Staggered field animations
        fieldRefs.current.forEach((field, index) => {
          if (!field) return;
          gsap.fromTo(
            field,
            {
              opacity: 0,
              y: 15,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              delay: 0.1 + index * 0.08,
              ease: "power2.out",
            }
          );
        });

        // Animated glow effect - Warp style
        if (glowRef.current) {
          gsap.to(glowRef.current, {
            opacity: [0.15, 0.25, 0.15],
            scale: [1, 1.02, 1],
            duration: 6,
            repeat: -1,
            ease: "sine.inOut",
          });
        }
      }, cardRef);

      return () => ctx.revert();
    };

    loadGSAP();
  }, []);

  // Mouse move parallax effect
  useEffect(() => {
    if (!cardRef.current || !glowRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (typeof window === "undefined") return;
      
      const card = cardRef.current;
      const glow = glowRef.current;
      if (!card || !glow) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const moveX = (x - centerX) / 20;
      const moveY = (y - centerY) / 20;

      glow.style.transform = `translate(${moveX}px, ${moveY}px)`;
    };

    cardRef.current.addEventListener("mousemove", handleMouseMove);
    return () => {
      cardRef.current?.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <Card ref={cardRef} className="relative border-slate-800/60 bg-[#0a0a0a]/95 backdrop-blur-xl overflow-hidden" style={{ 
      boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.08), 0 8px 32px rgba(0, 0, 0, 0.5)',
    }}>
      {/* Animated glow background - Warp style */}
      <div
        ref={glowRef}
        className="absolute inset-0 pointer-events-none opacity-15"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(34, 211, 238, 0.08) 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />
      <CardHeader className="pb-6 border-b border-slate-800/60">
        <div>
          <CardTitle className="text-xl font-normal tracking-tight mb-1.5 text-white" style={{ fontFamily: 'var(--font-geist-mono), ui-monospace, monospace', fontWeight: 400, letterSpacing: '-0.01em' }}>
            Generate Pull Request
          </CardTitle>
          <CardDescription className="text-slate-400 text-xs" style={{ fontFamily: 'var(--font-geist-mono), ui-monospace, monospace', fontWeight: 400 }}>
            Paste your stack trace and let AI fix the bug
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 pt-6">
        <form ref={formRef} onSubmit={onSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-3 gap-4">
            <div ref={(el) => { fieldRefs.current[0] = el; }} className="space-y-1.5">
              <Label htmlFor="owner" className="text-xs font-normal text-slate-400 uppercase tracking-wider" style={{ fontFamily: 'var(--font-geist-mono), ui-monospace, monospace' }}>
                Owner
              </Label>
              {isLoadingRepos ? (
                <div className="h-10 flex items-center justify-center border border-slate-700/50 rounded-lg bg-slate-900/30">
                  <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                </div>
              ) : (
                <Select
                  id="owner"
                  value={formData.owner}
                  onChange={(e) => handleOwnerChange(e.target.value)}
                  onBlur={() => handleBlur("owner")}
                  required
                  error={!!errors.owner}
                  disabled={isSubmitting || isLoadingRepos}
                  aria-invalid={!!errors.owner}
                >
                  <option value="" className="bg-slate-900 text-white">
                    Select Owner
                  </option>
                  {owners.map((owner) => (
                    <option key={owner} value={owner} className="bg-slate-900 text-white">
                      {owner}
                    </option>
                  ))}
                </Select>
              )}
              {errors.owner && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.owner}
                </p>
              )}
            </div>

            <div ref={(el) => { fieldRefs.current[1] = el; }} className="space-y-1.5">
              <Label htmlFor="repo" className="text-xs font-normal text-slate-400 uppercase tracking-wider" style={{ fontFamily: 'var(--font-geist-mono), ui-monospace, monospace' }}>
                Repository
              </Label>
              {isLoadingRepos ? (
                <div className="h-10 flex items-center justify-center border border-slate-700/50 rounded-lg bg-slate-900/30">
                  <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                </div>
              ) : (
                <Select
                  id="repo"
                  value={formData.repo}
                  onChange={(e) => handleRepoChange(e.target.value)}
                  onBlur={() => handleBlur("repo")}
                  required
                  error={!!errors.repo}
                  disabled={!formData.owner || isSubmitting || isLoadingRepos}
                  aria-invalid={!!errors.repo}
                >
                  <option value="" className="bg-slate-900 text-white">
                    {formData.owner ? "Select Repository" : "Select Owner first"}
                  </option>
                  {availableRepos.map((repo) => (
                    <option
                      key={repo.id}
                      value={repo.name}
                      className="bg-slate-900 text-white"
                    >
                      {repo.name}
                    </option>
                  ))}
                </Select>
              )}
              {errors.repo && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.repo}
                </p>
              )}
            </div>

            <div ref={(el) => { fieldRefs.current[2] = el; }} className="space-y-1.5">
              <Label htmlFor="branch" className="text-xs font-normal text-slate-400 uppercase tracking-wider" style={{ fontFamily: 'var(--font-geist-mono), ui-monospace, monospace' }}>
                Branch
              </Label>
              <Input
                id="branch"
                placeholder="main"
                value={formData.branch}
                onChange={handleInputChange("branch")}
                onBlur={() => handleBlur("branch")}
                required
                className={`h-9 bg-[#0a0a0a] border-slate-800/70 text-white placeholder:text-slate-500 focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/40 font-mono text-sm ${errors.branch ? "border-red-500/50" : ""}`}
                style={{
                  fontFamily: 'var(--font-geist-mono), ui-monospace, monospace',
                  boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
                }}
                disabled={isSubmitting}
                aria-invalid={!!errors.branch}
              />
              {errors.branch && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.branch}
                </p>
              )}
            </div>
          </div>

          <div ref={(el) => { fieldRefs.current[3] = el; }} className="space-y-1.5">
            <Label
              htmlFor="aiProvider"
              className="text-xs font-normal text-slate-400 uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: 'var(--font-geist-mono), ui-monospace, monospace' }}
            >
              <Sparkles className="h-3 w-3 text-slate-500" />
              LLM Provider
            </Label>
            <Select
              id="aiProvider"
              value={formData.aiProvider || ''}
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
                  aiProvider: e.target.value ? (e.target.value as 'gemini' | 'openai') : undefined,
                })
              }
              disabled={isSubmitting}
            >
              <option value="" className="bg-slate-900 text-white">Select LLM Provider (Optional)</option>
              <option value="gemini" className="bg-slate-900 text-white">Gemini</option>
              <option value="openai" className="bg-slate-900 text-white">OpenAI</option>
            </Select>
            <p className="text-xs text-slate-500 font-mono">
              Choose the AI provider to analyze the stack trace. Leave empty for default.
            </p>
          </div>

          <div ref={(el) => { fieldRefs.current[4] = el; }} className="space-y-1.5">
            <Label
              htmlFor="stackTrace"
              className="text-xs font-normal text-slate-400 uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: 'var(--font-geist-mono), ui-monospace, monospace' }}
            >
              <FileCode className="h-3 w-3 text-slate-500" />
              Stack Trace
            </Label>
            <Textarea
              id="stackTrace"
              placeholder={`Paste your error stack trace here...

Example:
Error: Cannot read property 'map' of undefined
    at UserList.render (src/components/UserList.tsx:24:18)
    at processChild (node_modules/react-dom/...)
    at ...`}
              value={formData.stackTrace}
              onChange={handleTextareaChange("stackTrace")}
              onBlur={() => handleBlur("stackTrace")}
              required
              className={`min-h-[240px] code-textarea resize-none bg-[#0a0a0a] border-slate-800/70 text-white placeholder:text-slate-500 focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/40 font-mono text-sm ${errors.stackTrace ? "border-red-500/50" : ""}`}
              style={{
                fontFamily: 'var(--font-geist-mono), ui-monospace, monospace',
                boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
                lineHeight: '1.6',
              }}
              disabled={isSubmitting}
              aria-invalid={!!errors.stackTrace}
            />
            {errors.stackTrace ? (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.stackTrace}
              </p>
            ) : (
              <p className="text-xs text-slate-500 font-mono">
                The AI will analyze the error and generate a fix automatically
              </p>
            )}
          </div>

          <div ref={(el) => { fieldRefs.current[5] = el; }}>
            <Button
              type="submit"
              className="w-full h-10 text-sm gap-2 bg-white text-black hover:bg-white/95 uppercase relative overflow-hidden group font-mono tracking-wide"
              style={{
                fontFamily: 'var(--font-geist-mono), ui-monospace, monospace',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              }}
              disabled={isSubmitting}
            >
              {/* Animated shine effect */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <Rocket className="h-4 w-4 relative z-10" />
              <span className="relative z-10">Generate Pull Request</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

