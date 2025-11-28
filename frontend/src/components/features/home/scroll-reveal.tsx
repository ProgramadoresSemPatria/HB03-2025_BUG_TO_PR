"use client";

import { useEffect, useRef, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  duration?: number;
}

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  duration = 1,
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadGSAP = async () => {
      const gsap = (await import("gsap")).default;
      const ScrollTrigger = (await import("gsap/ScrollTrigger")).default;
      
      gsap.registerPlugin(ScrollTrigger);

      if (!elementRef.current) return;

      const element = elementRef.current;
      const directionMap = {
        up: { y: 60, x: 0 },
        down: { y: -60, x: 0 },
        left: { y: 0, x: 60 },
        right: { y: 0, x: -60 },
      };

      const { y, x } = directionMap[direction];

      gsap.set(element, {
        opacity: 0,
        y,
        x,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
          end: "top 50%",
          toggleActions: "play none none reverse",
        },
      });

      tl.to(element, {
        opacity: 1,
        y: 0,
        x: 0,
        duration,
        delay,
        ease: "power3.out",
      });
    };

    loadGSAP();
  }, [delay, direction, duration]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}

