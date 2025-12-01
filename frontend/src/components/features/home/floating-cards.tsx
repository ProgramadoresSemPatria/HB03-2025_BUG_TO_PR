"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

export function FloatingCards() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 200 };
  const x = useSpring(useMotionValue(0), springConfig);
  const y = useSpring(useMotionValue(0), springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const unsubscribeX = mouseX.on("change", (latest) => {
      x.set(latest / 20);
    });
    const unsubscribeY = mouseY.on("change", (latest) => {
      y.set(latest / 20);
    });
    return () => {
      unsubscribeX();
      unsubscribeY();
    };
  }, [mouseX, mouseY, x, y]);

  return (
    <>
      <motion.div
        style={{ x, y }}
        className="absolute top-20 right-10 hidden lg:block"
      >
        <div className="relative w-32 h-32">
          <motion.div
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-xl border border-primary/20"
            animate={{
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </motion.div>

      <motion.div
        style={{ 
          x: useSpring(useMotionValue(0), springConfig), 
          y: useSpring(useMotionValue(0), springConfig) 
        }}
        className="absolute bottom-20 left-10 hidden lg:block"
      >
        <div className="relative w-24 h-24">
          <motion.div
            className="absolute inset-0 rounded-xl bg-gradient-to-br from-chart-2/20 to-chart-2/5 backdrop-blur-xl border border-chart-2/20"
            animate={{
              rotate: [0, -5, 5, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </motion.div>
    </>
  );
}

