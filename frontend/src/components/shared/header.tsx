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
  const { scrolled } = useScroll({ threshold: 20 });
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
      initial={{ opacity: 0, y: -20 }}
      animate={{
        opacity: scrolled ? 0 : 1,
        y: scrolled ? -60 : 0,
        pointerEvents: scrolled ? "none" : "auto",
      }}
      transition={{ duration: 0.3 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-3xl px-4"
    >
      <div className="flex items-center justify-between w-full px-6 py-3 rounded-lg bg-card/60 backdrop-blur-md border border-border/40">
        <Link href={ROUTES.HOME} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Terminal className="h-5 w-5 text-foreground" />
          <span className="font-semibold">bug-to-pr</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#changelog" className="hover:text-foreground transition-colors">
            Changelog
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Link href={ROUTES.LOGIN}>
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href={ROUTES.DASHBOARD}>
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}

