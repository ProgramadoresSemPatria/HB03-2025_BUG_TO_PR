"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";

export function HeroContentEnhanced() {
  const containerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadGSAP = async () => {
      const gsap = (await import("gsap")).default;
      const ScrollTrigger = (await import("gsap/ScrollTrigger")).default;
      
      gsap.registerPlugin(ScrollTrigger);

      if (!containerRef.current) return;

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        if (badgeRef.current) {
          gsap.set(badgeRef.current, { opacity: 0, y: -20 });
          tl.to(badgeRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.8,
          });
        }

        if (titleRef.current) {
          const blockSpans = titleRef.current.querySelectorAll("span.block");
          gsap.set(blockSpans, { opacity: 0, y: 50 });
          
          tl.to(blockSpans, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: {
              amount: 0.4,
              from: "start",
            },
            ease: "back.out(1.2)",
          }, "-=0.4");
        }

        if (subtitleRef.current) {
          gsap.set(subtitleRef.current, { opacity: 0, y: 20 });
          tl.to(subtitleRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.8,
          }, "-=0.3");
        }

        if (buttonsRef.current) {
          const buttons = buttonsRef.current.querySelectorAll("a");
          gsap.set(buttons, { opacity: 0, y: 30, scale: 0.9 });
          tl.to(buttons, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.4)",
          }, "-=0.2");
        }

        const magneticElements = document.querySelectorAll(".magnetic");
        magneticElements.forEach((el) => {
          const element = el as HTMLElement;
          
          element.addEventListener("mousemove", (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(element, {
              x: x * 0.3,
              y: y * 0.3,
              duration: 0.5,
              ease: "power2.out",
            });
          });

          element.addEventListener("mouseleave", () => {
            gsap.to(element, {
              x: 0,
              y: 0,
              duration: 0.5,
              ease: "power2.out",
            });
          });
        });
      }, containerRef);

      return () => ctx.revert();
    };

    loadGSAP();
  }, []);

  return (
    <div ref={containerRef} className="text-center relative z-10">
      <div
        ref={badgeRef}
        className="inline-flex items-center gap-2 pl-1.5 pr-4 py-1.5 rounded-md bg-white/10 backdrop-blur-sm border border-white/20 mb-2"
      >
        <Image 
          src="/raio.gif" 
          alt="Lightning" 
          width={48}
          height={48}
          className="object-cover"
        />
        <span className="text-xs font-medium text-white/90 uppercase tracking-wider">
          Automated Bug Fixes
        </span>
      </div>

      <h1
        ref={titleRef}
        className="text-5xl sm:text-6xl lg:text-7xl tracking-tight mb-6 leading-[1.05]"
        style={{ fontFamily: '"Lyondisplay App", Georgia, serif', fontWeight: 300 }}
      >
        <span className="block">
          From{" "}
          <span className="relative inline-block">
            <span className="relative z-10">Stack Trace</span>
          </span>
        </span>
        <span className="block mt-2">
          to{" "}
          <span className="relative inline-block">
            <span className="relative z-10 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              Pull Request
            </span>
          </span>
        </span>
      </h1>

      <p
        ref={subtitleRef}
        className="text-lg sm:text-xl text-white max-w-2xl mx-auto mb-10 leading-relaxed tracking-tight"
        style={{ fontFamily: '"Suisseintl", sans-serif', fontWeight: 300 }}
      >
        Paste your error, let AI fix it, get a PR.{" "}
        <span className="text-white/90 font-medium">That simple.</span>
      </p>

      <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-3 justify-center items-center">
        <Link href={ROUTES.DASHBOARD} className="cursor-pointer magnetic">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-primary/60 to-primary rounded-lg blur-md opacity-40 group-hover:opacity-60 transition-opacity" />
            <Button
              size="lg"
              className="relative h-12 px-8 gap-2 text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200 bg-white text-black hover:bg-white/90 cursor-pointer uppercase tracking-normal"
            >
              Start Fixing Bugs
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </div>
        </Link>
        <Link href={ROUTES.LOGIN} className="cursor-pointer magnetic">
          <Button
            variant="outline"
            size="lg"
            className="h-12 px-8 text-sm font-medium !border-white/40 !text-white !bg-white/10 backdrop-blur-md dark:!bg-white/10 dark:!border-white/40 hover:!bg-white/20 hover:!text-white hover:!border-white/60 transition-all duration-200 cursor-pointer uppercase tracking-normal"
          >
            Create Account
          </Button>
        </Link>
      </div>
    </div>
  );
}

