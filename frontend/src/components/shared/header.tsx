"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LogOut, History, Terminal } from "lucide-react";
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
  const logoRef1 = useRef<HTMLImageElement>(null);
  const logoRef2 = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const ensureGifLoop = (img: HTMLImageElement | null) => {
      if (!img) return () => {};
      
      // Configurar o GIF para fazer loop infinito
      img.style.imageRendering = "auto";
      img.style.display = "block";
      
      const restartGif = () => {
        if (!img.complete) return;
        
        const src = img.src;
        // Ocultar brevemente durante o restart para evitar flash do alt text
        img.style.visibility = "hidden";
        img.src = "";
        
        requestAnimationFrame(() => {
          img.src = src;
          img.style.visibility = "visible";
        });
      };

      img.addEventListener("load", () => {
        img.style.imageRendering = "auto";
        img.style.visibility = "visible";
      });

      // Reiniciar o GIF antes que ele termine completamente
      const intervalId = setInterval(() => {
        if (img.complete && img.naturalWidth > 0) {
          restartGif();
        }
      }, 2000); // Reiniciar a cada 2 segundos para evitar que o GIF pare
      
      return () => clearInterval(intervalId);
    };

    const cleanup1 = ensureGifLoop(logoRef1.current);
    const cleanup2 = ensureGifLoop(logoRef2.current);
    
    return () => {
      cleanup1();
      cleanup2();
    };
  }, []);

  if (variant === "app") {
    return (
      <header className="border-b border-border/40 bg-card/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="w-full max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href={ROUTES.HOME} className="flex items-center hover:opacity-80 transition-opacity -ml-4 sm:-ml-6">
            <img
              ref={logoRef1}
              src="/logo.gif"
              alt=""
              className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 object-contain"
              style={{ imageRendering: "auto" }}
            />
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
                <Terminal className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Button>
            </Link>
            <Link href={ROUTES.HISTORY}>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "gap-2",
                  pathname === ROUTES.HISTORY && "bg-muted"
                )}
              >
                <History className="h-4 w-4" />
                <span className="hidden sm:inline">History</span>
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
        className="absolute inset-0 bg-card/5 backdrop-blur-md shadow-sm border-b border-border/10 pointer-events-none"
      />
      
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
          className="absolute inset-0 flex items-center justify-between rounded-lg bg-card/5 backdrop-blur-md border border-border/10"
        />
        
        <div className="relative flex items-center justify-between h-full">
          <Link href={ROUTES.HOME} className="flex items-center hover:opacity-80 transition-opacity -ml-4 sm:-ml-6">
            <img
              ref={logoRef2}
              src="/logo.gif"
              alt=""
              className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 object-contain"
              style={{ imageRendering: "auto" }}
            />
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
            <a 
              href="#changelog"
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById("changelog");
                if (element) {
                  const headerHeight = 80;
                  const startPosition = window.pageYOffset;
                  const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
                  const targetPosition = elementPosition - headerHeight;
                  const distance = targetPosition - startPosition;
                  const duration = 1800;
                  let start: number | null = null;

                  const easeInOutCubic = (t: number): number => {
                    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
                  };

                  const animateScroll = (timestamp: number) => {
                    if (!start) start = timestamp;
                    const progress = timestamp - start;
                    const progressRatio = Math.min(progress / duration, 1);
                    const easedProgress = easeInOutCubic(progressRatio);
                    
                    window.scrollTo(0, startPosition + distance * easedProgress);
                    
                    if (progress < duration) {
                      requestAnimationFrame(animateScroll);
                    }
                  };

                  requestAnimationFrame(animateScroll);
                }
              }}
              className="inline-flex items-center gap-2 h-8 px-4 rounded-md bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-medium text-white/90 uppercase tracking-normal hover:bg-white/20 transition-colors"
            >
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

