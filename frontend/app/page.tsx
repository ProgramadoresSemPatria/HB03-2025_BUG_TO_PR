"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, GitPullRequest, Sparkles, Check, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header, Footer } from "@/components/shared";
import { CHANGELOG, DEMO_CODE_LINES, ROUTES } from "@/constants";
import { cn } from "@/lib/utils";

export default function Home() {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);

  useEffect(() => {
    DEMO_CODE_LINES.forEach((line, index) => {
      setTimeout(() => {
        setVisibleLines((prev) => [...prev, index]);
      }, line.delay * 1000);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Subtle grid background */}
      <div
        className="fixed inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255,255,255)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
        }}
      />

      <Header variant="landing" />

      {/* Hero Section */}
      <main className="relative z-10">
        <section className="w-full max-w-5xl mx-auto px-6 pt-32 pb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
              From Stack Trace
              <br />
              to{" "}
              <span className="text-primary">Pull Request</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
              Paste your error, let AI fix it, get a PR. That simple.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href={ROUTES.DASHBOARD}>
                <Button size="lg" className="h-12 px-8 gap-2 text-base">
                  <Rocket className="h-4 w-4" />
                  Start Fixing Bugs
                </Button>
              </Link>
              <Link href={ROUTES.LOGIN}>
                <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                  Create Account
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Animated Terminal Preview */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-16 w-full"
          >
            <div className="rounded-xl border border-border/50 bg-[#0d1117] overflow-hidden shadow-2xl">
              {/* Terminal Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/20 bg-[#161b22]">
                <div className="flex items-center gap-2">
                  <div className="flex gap-2">
                    <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                    <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                    <div className="h-3 w-3 rounded-full bg-[#27ca40]" />
                  </div>
                  <span className="text-xs text-muted-foreground font-mono ml-3">
                    bug-to-pr — ~/acme/app
                  </span>
                </div>
              </div>

              {/* Terminal Content */}
              <div className="p-6 font-mono text-sm min-h-[320px]">
                <AnimatePresence>
                  {DEMO_CODE_LINES.map((line, index) => (
                    visibleLines.includes(index) && (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className={cn(
                          "leading-relaxed",
                          line.type === "error" && "text-red-400",
                          line.type === "trace" && "text-muted-foreground/60",
                          line.type === "step" && "text-muted-foreground",
                          line.type === "success" && "text-emerald-400",
                          line.type === "link" && "text-primary",
                          line.type === "empty" && "h-4"
                        )}
                      >
                        {line.text}
                      </motion.div>
                    )
                  ))}
                </AnimatePresence>
                
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
            className="rounded-2xl border border-border/30 bg-gradient-to-b from-card/50 to-card/20 p-12 text-center"
          >
            <h2 className="text-3xl font-bold mb-4">
              Ready to automate?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
              Stop wasting time debugging. Let AI create Pull Requests for you.
            </p>
            <Link href={ROUTES.DASHBOARD}>
              <Button size="lg" className="h-12 px-8 text-base gap-2">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
