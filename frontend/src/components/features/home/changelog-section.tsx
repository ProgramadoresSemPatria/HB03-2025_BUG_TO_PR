"use client";

import { useEffect, useRef } from "react";
import { Sparkles, Check } from "lucide-react";
import { CHANGELOG } from "@/constants";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "./scroll-reveal";

export function ChangelogSection() {
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadGSAP = async () => {
      const gsap = (await import("gsap")).default;
      const ScrollTrigger = (await import("gsap/ScrollTrigger")).default;
      
      gsap.registerPlugin(ScrollTrigger);

      itemsRef.current.forEach((item, index) => {
        if (!item) return;

        gsap.fromTo(
          item,
          {
            opacity: 0,
            x: -50,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            delay: index * 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    };

    loadGSAP();
  }, []);

  return (
    <section id="changelog" className="w-full max-w-6xl mx-auto px-6 py-24">
      <ScrollReveal>
        <div className="text-center mb-16">
          <h2 
            className="text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-4 leading-tight"
            style={{ fontFamily: '"Lyondisplay App", Georgia, serif', fontWeight: 300 }}
          >
            Changelog
          </h2>
          <p 
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto"
            style={{ fontFamily: '"Suisseintl", sans-serif', fontWeight: 300 }}
          >
            See what&apos;s new and what we&apos;ve been building
          </p>
        </div>
      </ScrollReveal>

      <div className="space-y-0">
        {CHANGELOG.map((item, index) => (
          <div
            key={item.version}
            ref={(el) => {
              itemsRef.current[index] = el;
            }}
            className="group relative"
          >
              {index < CHANGELOG.length - 1 && (
                <div className="absolute left-[15px] top-12 w-px h-[calc(100%-24px)] bg-border/30" />
              )}

              <div className="flex gap-6 py-8 hover:bg-muted/5 rounded-lg px-4 -mx-4 transition-colors">
                <div className={cn(
                  "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                  item.type === "feature" 
                    ? "bg-primary/20 text-primary" 
                    : "bg-muted text-muted-foreground"
                )}>
                  {item.type === "feature" ? (
                    <Sparkles className="h-4 w-4" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="text-xs font-mono text-primary bg-primary/10 px-2.5 py-1 rounded-md uppercase tracking-wider">
                      {item.version}
                    </span>
                    <span 
                      className="text-sm text-muted-foreground"
                      style={{ fontFamily: '"Suisseintl", sans-serif', fontWeight: 300 }}
                    >
                      {item.date}
                    </span>
                  </div>
                  <h3 
                    className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors"
                    style={{ fontFamily: '"Suisseintl", sans-serif', fontWeight: 400 }}
                  >
                    {item.title}
                  </h3>
                  <p 
                    className="text-muted-foreground leading-relaxed"
                    style={{ fontFamily: '"Suisseintl", sans-serif', fontWeight: 300 }}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
    </section>
  );
}

