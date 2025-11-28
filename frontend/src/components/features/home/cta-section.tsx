"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";

export function CTASection() {
  return (
    <section className="w-full max-w-6xl mx-auto px-6 py-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 
          className="text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6 leading-tight"
          style={{ fontFamily: '"Lyondisplay App", Georgia, serif', fontWeight: 300 }}
        >
          Ready to Transform Your Workflow?
        </h2>
        <p 
          className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed tracking-tight"
          style={{ fontFamily: '"Suisseintl", sans-serif', fontWeight: 300 }}
        >
          Stop wasting time debugging. Let AI analyze, fix, and create Pull Requests automatically—while you focus on building.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link href={ROUTES.DASHBOARD} className="cursor-pointer">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-primary/60 to-primary rounded-lg blur-md opacity-40 group-hover:opacity-60 transition-opacity" />
              <Button 
                size="lg" 
                className="relative h-12 px-8 gap-2 text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200 bg-white text-black hover:bg-white/90 cursor-pointer uppercase tracking-normal"
              >
                Get Started
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </div>
          </Link>
          <Link href={ROUTES.LOGIN} className="cursor-pointer">
            <Button 
              variant="outline" 
              size="lg" 
              className="h-12 px-8 text-sm font-medium border-border/40 text-foreground bg-card/50 backdrop-blur-sm hover:bg-card/80 hover:text-foreground transition-all duration-200 cursor-pointer uppercase tracking-normal"
            >
              Log In
            </Button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

