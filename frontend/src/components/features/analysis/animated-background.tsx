"use client";

import { useEffect, useRef } from "react";

export function AnimatedBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    const loadGSAP = async () => {
      const gsap = (await import("gsap")).default;
      
      const particles: HTMLDivElement[] = [];
      const particleCount = 20;

      // Create particles
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div");
        particle.className = "absolute rounded-full";
        particle.style.width = `${Math.random() * 4 + 2}px`;
        particle.style.height = particle.style.width;
        particle.style.background = `rgba(34, 211, 238, ${Math.random() * 0.3 + 0.1})`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.filter = "blur(1px)";
        containerRef.current?.appendChild(particle);
        particles.push(particle);
      }

      // Animate particles
      particles.forEach((particle, index) => {
        const duration = Math.random() * 10 + 10;
        const delay = index * 0.2;

        gsap.to(particle, {
          y: `+=${Math.random() * 200 + 100}`,
          x: `+=${Math.random() * 100 - 50}`,
          opacity: [0.2, 0.6, 0.2],
          scale: [1, 1.5, 1],
          duration,
          delay,
          repeat: -1,
          ease: "sine.inOut",
        });
      });

      return () => {
        particles.forEach(particle => particle.remove());
      };
    };

    loadGSAP();
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

