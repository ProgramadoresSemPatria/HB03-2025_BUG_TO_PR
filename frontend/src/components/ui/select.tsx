"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const internalRef = useRef<HTMLSelectElement>(null);
    const selectRef = (ref || internalRef) as React.RefObject<HTMLSelectElement>;

    useEffect(() => {
      if (typeof window === "undefined" || !containerRef.current) return;

      const loadGSAP = async () => {
        const gsap = (await import("gsap")).default;
        
        const select = selectRef.current || containerRef.current?.querySelector("select");
        if (!select) return;

        // Hover glow effect
        const handleMouseEnter = () => {
          if (glowRef.current) {
            gsap.to(glowRef.current, {
              opacity: 0.3,
              scale: 1.05,
              duration: 0.3,
              ease: "power2.out",
            });
          }
        };

        const handleMouseLeave = () => {
          if (glowRef.current) {
            gsap.to(glowRef.current, {
              opacity: 0,
              scale: 1,
              duration: 0.3,
              ease: "power2.out",
            });
          }
        };

        const handleFocus = () => {
          if (glowRef.current) {
            gsap.to(glowRef.current, {
              opacity: 0.4,
              scale: 1.08,
              duration: 0.3,
              ease: "power2.out",
            });
          }
        };

        const handleBlur = () => {
          if (glowRef.current) {
            gsap.to(glowRef.current, {
              opacity: 0,
              scale: 1,
              duration: 0.3,
              ease: "power2.out",
            });
          }
        };

        select.addEventListener("mouseenter", handleMouseEnter);
        select.addEventListener("mouseleave", handleMouseLeave);
        select.addEventListener("focus", handleFocus);
        select.addEventListener("blur", handleBlur);

        return () => {
          select.removeEventListener("mouseenter", handleMouseEnter);
          select.removeEventListener("mouseleave", handleMouseLeave);
          select.removeEventListener("focus", handleFocus);
          select.removeEventListener("blur", handleBlur);
        };
      };

      loadGSAP();
    }, []);

    return (
      <div ref={containerRef} className="relative">
        {/* Animated glow on hover/focus - Warp style */}
        <div
          ref={glowRef}
          className="absolute inset-0 rounded opacity-0 pointer-events-none"
          style={{
            background: "radial-gradient(circle at center, rgba(34, 211, 238, 0.15) 0%, transparent 70%)",
            filter: "blur(12px)",
            transition: "opacity 0.2s ease",
          }}
        />
        <select
          ref={selectRef}
          className={cn(
            "appearance-none h-9 w-full rounded border bg-[#0a0a0a] relative z-10",
            "px-3 py-2 text-sm text-white",
            "border-slate-800/70 focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/40",
            "transition-all duration-150",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "hover:border-slate-700/80",
            "font-mono",
            error && "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/30",
            className
          )}
          style={{
            fontFamily: 'var(--font-geist-mono), ui-monospace, monospace',
            boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
          }}
          {...props}
        >
          {children}
        </select>
        <ChevronDown 
          className="absolute right-3 top-1/2 h-4 w-4 text-slate-400 pointer-events-none transition-transform duration-200 z-20" 
          style={{ transform: 'translateY(-50%)' }}
        />
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };

