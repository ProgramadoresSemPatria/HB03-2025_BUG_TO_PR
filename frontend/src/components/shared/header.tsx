"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Terminal, LogOut, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScroll } from "@/hooks";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";

interface HeaderProps {
  variant?: "landing" | "app";
}

export function Header({ variant = "landing" }: HeaderProps) {
  const { scrolled, isMounted } = useScroll({ threshold: 20 });
  const pathname = usePathname();

  if (variant === "app") {
    return (
      <header className="border-b border-border/40 bg-card/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="w-full max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href={ROUTES.HOME} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Terminal className="h-5 w-5 text-foreground" />
            <span className="font-semibold">bug-to-pr</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link href={ROUTES.DASHBOARD}>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "gap-2",
                  pathname === ROUTES.DASHBOARD && "bg-muted"
                )}
              >
                <History className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Button>
            </Link>
            <Link href={ROUTES.LOGIN}>
              <Button variant="ghost" size="sm" className="gap-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <motion.header
      initial={{
        top: scrolled ? 0 : 16,
      }}
      animate={{
        top: scrolled ? 0 : 16,
      }}
      transition={isMounted ? { duration: 0.3, ease: [0.4, 0, 0.2, 1] } : { duration: 0 }}
      className="fixed left-0 right-0 z-50"
    >
      {/* Background layer - aparece quando scrolled */}
      <motion.div
        initial={{
          opacity: scrolled ? 1 : 0,
          borderBottomWidth: scrolled ? 1 : 0,
        }}
        animate={{
          opacity: scrolled ? 1 : 0,
          borderBottomWidth: scrolled ? 1 : 0,
        }}
        transition={isMounted ? { duration: 0.3, ease: [0.4, 0, 0.2, 1] } : { duration: 0 }}
        className="absolute inset-0 bg-card/10 backdrop-blur-md shadow-sm border-b border-border/10 pointer-events-none"
      />
      
      {/* Content container */}
      <motion.div
        initial={{
          height: scrolled ? 64 : 56,
          paddingTop: scrolled ? "0.75rem" : "0.5rem",
          paddingBottom: scrolled ? "0.75rem" : "0.5rem",
        }}
        animate={{
          height: scrolled ? 64 : 56,
          paddingTop: scrolled ? "0.75rem" : "0.5rem",
          paddingBottom: scrolled ? "0.75rem" : "0.5rem",
        }}
        transition={isMounted ? { duration: 0.3, ease: [0.4, 0, 0.2, 1] } : { duration: 0 }}
        className="relative w-full max-w-6xl mx-auto px-6"
      >
        {/* Inner container - desaparece quando scrolled */}
        <motion.div
          initial={{
            borderRadius: scrolled ? 0 : 8,
            paddingLeft: scrolled ? 0 : "1.5rem",
            paddingRight: scrolled ? 0 : "1.5rem",
            paddingTop: scrolled ? 0 : "0.5rem",
            paddingBottom: scrolled ? 0 : "0.5rem",
            opacity: scrolled ? 0 : 1,
            borderWidth: scrolled ? 0 : 1,
            pointerEvents: scrolled ? "none" : "auto",
          }}
          animate={{
            borderRadius: scrolled ? 0 : 8,
            paddingLeft: scrolled ? 0 : "1.5rem",
            paddingRight: scrolled ? 0 : "1.5rem",
            paddingTop: scrolled ? 0 : "0.5rem",
            paddingBottom: scrolled ? 0 : "0.5rem",
            opacity: scrolled ? 0 : 1,
            borderWidth: scrolled ? 0 : 1,
            pointerEvents: scrolled ? "none" : "auto",
          }}
          transition={isMounted ? { duration: 0.3, ease: [0.4, 0, 0.2, 1] } : { duration: 0 }}
          className="absolute inset-0 flex items-center justify-between rounded-lg bg-card/10 backdrop-blur-md border border-border/10"
        />
        
        {/* Content - sempre visível */}
        <div className="relative flex items-center justify-between h-full">
          <Link href={ROUTES.HOME} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Terminal className="h-5 w-5 text-foreground" />
            <span className="font-semibold text-sm">bug-to-pr</span>
          </Link>

          <motion.nav
            initial={{
              opacity: scrolled ? 0 : 1,
              pointerEvents: scrolled ? "none" : "auto",
            }}
            animate={{
              opacity: scrolled ? 0 : 1,
              pointerEvents: scrolled ? "none" : "auto",
            }}
            transition={isMounted ? { duration: 0.3, ease: [0.4, 0, 0.2, 1] } : { duration: 0 }}
            className="hidden sm:flex items-center absolute left-1/2 -translate-x-1/2"
          >
            <a href="#changelog" className="inline-flex items-center gap-2 h-8 px-4 rounded-md bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-medium text-white/90 uppercase tracking-normal hover:bg-white/20 transition-colors">
              Changelog
            </a>
          </motion.nav>

          <div className="flex items-center gap-2">
            <Link href={ROUTES.LOGIN}>
              <Button variant="ghost" size="sm" className="text-white hover:text-white/80 hover:bg-white/10 uppercase">
                Log In
              </Button>
            </Link>
            <Link href={ROUTES.DASHBOARD}>
              <Button size="default" className="h-10 px-6 bg-white text-black hover:bg-white/90 uppercase">Get Started</Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.header>
  );
}

