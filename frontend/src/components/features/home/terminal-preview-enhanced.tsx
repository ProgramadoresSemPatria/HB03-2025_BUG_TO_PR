"use client";

import { useEffect, useRef } from "react";
import { DEMO_CODE_LINES } from "@/constants";
import { cn } from "@/lib/utils";

export function TerminalPreviewEnhanced() {
  const containerRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<(HTMLDivElement | null)[]>([]);
  const cursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadGSAP = async () => {
      const gsap = (await import("gsap")).default;
      const ScrollTrigger = (await import("gsap/ScrollTrigger")).default;
      
      gsap.registerPlugin(ScrollTrigger);

      if (!containerRef.current || !terminalRef.current) return;

      const ctx = gsap.context(() => {
        const terminal = terminalRef.current;
        if (!terminal) return;

        gsap.set(terminal, {
          opacity: 0,
          y: 60,
          scale: 0.95,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });

        tl.to(terminal, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
        });

        DEMO_CODE_LINES.forEach((line, index) => {
          const lineElement = linesRef.current[index];
          if (!lineElement) return;

          const delay = line.delay;

          gsap.set(lineElement, {
            opacity: 0,
            x: -30,
            filter: "blur(4px)",
          });

          const lineTL = gsap.timeline({
            delay: delay + 0.5,
            defaults: { ease: "power2.out" },
          });

          if (line.type === "error") {
            lineTL
              .to(lineElement, {
                opacity: 1,
                x: 0,
                filter: "blur(0px)",
                duration: 0.4,
              })
              .to(
                lineElement,
                {
                  scale: 1.02,
                  duration: 0.1,
                },
                "-=0.2"
              )
              .to(
                lineElement,
                {
                  scale: 1,
                  duration: 0.1,
                },
                "-=0.1"
              );
          } else if (line.type === "success") {
            lineTL
              .to(lineElement, {
                opacity: 1,
                x: 0,
                filter: "blur(0px)",
                duration: 0.3,
              })
              .fromTo(
                lineElement.querySelector(".check-icon"),
                {
                  scale: 0,
                  rotation: -180,
                },
                {
                  scale: 1,
                  rotation: 0,
                  duration: 0.4,
                  ease: "back.out(1.5)",
                },
                "-=0.2"
              )
              .to(
                lineElement,
                {
                  backgroundColor: "rgba(16, 185, 129, 0.1)",
                  duration: 0.2,
                },
                "-=0.3"
              )
              .to(
                lineElement,
                {
                  backgroundColor: "transparent",
                  duration: 0.3,
                }
              );
          } else if (line.type === "link") {
            lineTL
              .to(lineElement, {
                opacity: 1,
                x: 0,
                filter: "blur(0px)",
                duration: 0.3,
              })
              .to(
                lineElement,
                {
                  scale: 1.01,
                  duration: 0.2,
                },
                "-=0.1"
              )
              .to(
                lineElement,
                {
                  scale: 1,
                  duration: 0.2,
                }
              );

            gsap.to(lineElement, {
              opacity: [1, 0.7, 1],
              duration: 2,
              repeat: -1,
              ease: "sine.inOut",
              delay: delay + 1,
            });
          } else {
            lineTL.to(lineElement, {
              opacity: 1,
              x: 0,
              filter: "blur(0px)",
              duration: 0.3,
            });
          }

          if (line.type === "step" || line.type === "success") {
            const checkIcon = lineElement.querySelector(".check-icon");
            if (checkIcon) {
              gsap.to(checkIcon, {
                opacity: [1, 0.6, 1],
                scale: [1, 1.1, 1],
                duration: 1.5,
                repeat: -1,
                ease: "sine.inOut",
                delay: delay + 1.5,
              });
            }
          }
        });

        const lastLineIndex = DEMO_CODE_LINES.length - 1;
        const lastLineDelay = DEMO_CODE_LINES[lastLineIndex]?.delay || 0;

        if (cursorRef.current) {
          gsap.set(cursorRef.current, { opacity: 0 });
          gsap.to(cursorRef.current, {
            opacity: 1,
            delay: lastLineDelay + 1,
            duration: 0.3,
          });

          gsap.to(cursorRef.current, {
            opacity: [1, 0],
            duration: 0.8,
            repeat: -1,
            ease: "power2.inOut",
            delay: lastLineDelay + 1.3,
          });
        }

        const scrollContainer = terminal.querySelector(".code-container");
        if (scrollContainer) {
          gsap.to(scrollContainer, {
            scrollTop: scrollContainer.scrollHeight,
            duration: 2,
            delay: lastLineDelay + 0.5,
            ease: "power2.inOut",
          });
        }
      }, containerRef);

      return () => ctx.revert();
    };

    loadGSAP();
  }, []);

  return (
    <div ref={containerRef} className="mt-20 w-full relative">
      <div
        ref={terminalRef}
        className="relative rounded-xl border border-gray-300 bg-gray-100 overflow-hidden shadow-lg"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/[0.02] via-transparent to-gray-900/[0.04] pointer-events-none z-10" />

        <div className="relative z-20 flex items-center justify-between px-5 py-3.5 border-b border-gray-200 bg-gray-100/50">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
              <div className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
              <div className="h-2.5 w-2.5 rounded-full bg-[#27ca40]" />
            </div>
            <span className="text-xs text-gray-500 font-mono">
              bug-to-pr — ~/acme/app
            </span>
          </div>
        </div>

        <div className="relative z-20 p-8 font-mono text-sm min-h-[320px] bg-gray-100 code-container overflow-y-auto max-h-[400px]">
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,_rgba(0,0,0,0.015)_0%,_transparent_50%,_rgba(0,0,0,0.015)_100%)] pointer-events-none z-0" />

          <div className="relative z-10 space-y-1">
            {DEMO_CODE_LINES.map((line, index) => (
              <div
                key={index}
                ref={(el) => {
                  linesRef.current[index] = el;
                }}
                className={cn(
                  "leading-tight px-2 py-0.5 rounded transition-all duration-300",
                  line.type === "error" && "text-red-500 font-semibold",
                  line.type === "trace" && "text-gray-500",
                  line.type === "step" && "text-gray-600",
                  line.type === "success" && "text-emerald-500 font-medium",
                  line.type === "link" && "text-primary cursor-pointer hover:underline",
                  line.type === "empty" && "h-4"
                )}
              >
                {line.type === "step" || line.type === "success" ? (
                  <>
                    <span className="check-icon inline-block mr-2">✓</span>
                    {line.text.replace("✓ ", "")}
                  </>
                ) : (
                  line.text
                )}
              </div>
            ))}

            <span
              ref={cursorRef}
              className="inline-block w-2 h-4 bg-primary ml-1 align-middle"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

