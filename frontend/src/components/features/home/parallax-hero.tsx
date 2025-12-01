"use client";

import { useEffect, useRef } from "react";

export function ParallaxHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const layer3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadGSAP = async () => {
      const gsap = (await import("gsap")).default;
      const ScrollTrigger = (await import("gsap/ScrollTrigger")).default;
      
      gsap.registerPlugin(ScrollTrigger);

      if (!containerRef.current) return;

      const ctx = gsap.context(() => {
        if (layer1Ref.current) {
          gsap.to(layer1Ref.current, {
            y: "-=100",
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          });
        }

        if (layer2Ref.current) {
          gsap.to(layer2Ref.current, {
            y: "-=50",
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.5,
            },
          });
        }

        if (layer3Ref.current) {
          gsap.to(layer3Ref.current, {
            y: "-=30",
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 2,
            },
          });
        }
      }, containerRef);

      return () => ctx.revert();
    };

    loadGSAP();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        ref={layer1Ref}
        className="absolute inset-0 opacity-30"
        style={{
          background: "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)",
        }}
      />
      <div
        ref={layer2Ref}
        className="absolute inset-0 opacity-20"
        style={{
          background: "radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)",
        }}
      />
      <div
        ref={layer3Ref}
        className="absolute inset-0 opacity-10"
        style={{
          background: "radial-gradient(circle at 50% 20%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)",
        }}
      />
    </div>
  );
}

