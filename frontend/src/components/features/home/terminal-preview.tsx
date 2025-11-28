"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DEMO_CODE_LINES } from "@/constants";
import { cn } from "@/lib/utils";

export function TerminalPreview() {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);

  useEffect(() => {
    DEMO_CODE_LINES.forEach((line, index) => {
      setTimeout(() => {
        setVisibleLines((prev) => [...prev, index]);
      }, line.delay * 1000);
    });
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
      className="mt-20 w-full relative"
    >
      <div className="relative rounded-xl border border-gray-300 bg-white overflow-hidden shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/[0.02] via-transparent to-gray-900/[0.04] pointer-events-none z-10" />
        
        <div className="relative z-20 flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50/30">
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

        <div className="relative z-20 p-8 font-mono text-sm min-h-[320px] bg-white">
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,_rgba(0,0,0,0.015)_0%,_transparent_50%,_rgba(0,0,0,0.015)_100%)] pointer-events-none z-0" />
          
          <div className="relative z-10 space-y-1">
            <AnimatePresence>
              {DEMO_CODE_LINES.map((line, index) => (
                visibleLines.includes(index) && (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "leading-tight",
                      line.type === "error" && "text-red-500",
                      line.type === "trace" && "text-gray-500",
                      line.type === "step" && "text-gray-600",
                      line.type === "success" && "text-emerald-500",
                      line.type === "link" && "text-primary",
                      line.type === "empty" && "h-4"
                    )}
                  >
                    {line.text}
                  </motion.div>
                )
              ))}
            </AnimatePresence>
          </div>
          
          {visibleLines.length === DEMO_CODE_LINES.length && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="inline-block w-2 h-4 bg-primary ml-1 align-middle"
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}

