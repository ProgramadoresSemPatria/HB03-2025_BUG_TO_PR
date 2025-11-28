"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";

export function CTASection() {
  return (
    <section className="w-full max-w-5xl mx-auto px-6 py-24">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative rounded-2xl border border-border/30 bg-gradient-to-b from-card/50 to-card/20 p-12 text-center overflow-hidden"
      >
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
  );
}

