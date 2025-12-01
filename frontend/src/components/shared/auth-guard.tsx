"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth";
import { ROUTES } from "@/constants/routes";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      setIsChecking(false);

      if (!authenticated) {
        window.location.href = ROUTES.LOGIN;
      }
    };

    checkAuth();
  }, [router]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center relative overflow-hidden">
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
        <div className="flex flex-col items-center gap-4 relative z-10">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
          <p className="text-sm text-slate-400 font-mono" style={{ fontFamily: 'var(--font-geist-mono), ui-monospace, monospace' }}>
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center relative overflow-hidden">
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
        <div className="flex flex-col items-center gap-4 relative z-10">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
          <p className="text-sm text-slate-400 font-mono" style={{ fontFamily: 'var(--font-geist-mono), ui-monospace, monospace' }}>
            Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

