"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, Sparkles, Check, Rocket, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header, Footer } from "@/components/shared";
import { VideoBackground } from "@/components/features/hero";
import { CHANGELOG, DEMO_CODE_LINES, ROUTES } from "@/constants";
import { cn } from "@/lib/utils";

export default function Home() {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 200 };
  const x = useSpring(useMotionValue(0), springConfig);
  const y = useSpring(useMotionValue(0), springConfig);

  useEffect(() => {
    DEMO_CODE_LINES.forEach((line, index) => {
      setTimeout(() => {
        setVisibleLines((prev) => [...prev, index]);
      }, line.delay * 1000);
    });
  }, []);

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
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Header variant="landing" />

      {/* Hero Section */}
      <main className="relative z-10">
        <section className="relative w-full min-h-screen overflow-hidden">
          {/* Video background - apenas na hero */}
          <div className="absolute inset-0">
            <VideoBackground />
          </div>
          
          {/* Conteúdo da Hero */}
          <div className="relative z-20 w-full max-w-6xl mx-auto px-6 pt-32 pb-20">
          {/* Floating cards */}
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

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center relative z-10"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-md bg-white/10 backdrop-blur-sm border border-white/20 mb-2"
            >
              <Zap className="h-3.5 w-3.5 text-white" />
              <span className="text-xs font-medium text-white/90 uppercase tracking-wider">
                Automated Bug Fixes
              </span>
            </motion.div>

            {/* Main Title with gradient */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl tracking-tight mb-6 leading-[1.05]" style={{ fontFamily: '"Lyondisplay App", Georgia, serif', fontWeight: 300 }}>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="block"
              >
                From{" "}
                <span className="relative inline-block">
                  <span className="relative z-10">Stack Trace</span>
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent blur-xl"
                    animate={{
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                    }}
                  />
                </span>
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="block mt-2"
              >
                to{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                    Pull Request
                  </span>
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-primary/30 to-primary/10 blur-2xl"
                    animate={{
                      opacity: [0.4, 0.7, 0.4],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                    }}
                  />
                </span>
              </motion.span>
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-lg sm:text-xl text-white max-w-2xl mx-auto mb-10 leading-relaxed"
              style={{ fontFamily: '"Suisseintl", sans-serif', fontWeight: 300 }}
            >
              Paste your error, let AI fix it, get a PR.{" "}
              <span className="text-white/90 font-medium">That simple.</span>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 justify-center items-center"
            >
              <Link href={ROUTES.DASHBOARD} className="cursor-pointer">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-primary/60 to-primary rounded-lg blur-md opacity-40 group-hover:opacity-60 transition-opacity" />
                  <Button 
                    size="lg" 
                    className="relative h-12 px-8 gap-2 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200 bg-white text-black hover:bg-white/90 cursor-pointer uppercase"
                  >
                    <Rocket className="h-5 w-5" />
                    Start Fixing Bugs
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </div>
              </Link>
              <Link href={ROUTES.LOGIN} className="cursor-pointer">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="h-12 px-8 text-base font-medium border-white/30 backdrop-blur-sm bg-white/20 hover:bg-white/30 text-white hover:text-white transition-all duration-200 cursor-pointer uppercase"
                  >
                    Create Account
                  </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Animated Terminal Preview */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-20 w-full relative"
          >
            <div className="relative rounded-xl border border-gray-300 bg-white overflow-hidden shadow-lg">
              {/* Overlay sutil para profundidade */}
              <div className="absolute inset-0 bg-gradient-to-b from-gray-900/[0.02] via-transparent to-gray-900/[0.04] pointer-events-none z-10" />
              
              {/* Terminal Header */}
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

              {/* Terminal Content */}
              <div className="relative z-20 p-8 font-mono text-sm min-h-[320px] bg-white">
                {/* Overlay muito sutil para contraste */}
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
                
                {/* Blinking cursor */}
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
          </div>
        </section>

        {/* Changelog Section */}
        <section id="changelog" className="w-full max-w-5xl mx-auto px-6 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-12">Changelog</h2>

            <div className="space-y-0">
              {CHANGELOG.map((item, index) => (
                <motion.div
                  key={item.version}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative"
                >
                  {/* Timeline line */}
                  {index < CHANGELOG.length - 1 && (
                    <div className="absolute left-[15px] top-10 w-px h-[calc(100%-16px)] bg-border/50" />
                  )}

                  <div className="flex gap-6 py-6 hover:bg-muted/10 rounded-lg px-2 -mx-2 transition-colors">
                    {/* Icon */}
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

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded-md">
                          {item.version}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {item.date}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="w-full max-w-5xl mx-auto px-6 py-24">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative rounded-2xl border border-border/30 bg-gradient-to-b from-card/50 to-card/20 p-12 text-center overflow-hidden"
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-50" />
            
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4">
                Ready to automate?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
                Stop wasting time debugging. Let AI create Pull Requests for you.
              </p>
              <Link href={ROUTES.DASHBOARD}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button size="default" className="h-10 px-6 text-sm font-medium gap-2">
                    Get Started
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
