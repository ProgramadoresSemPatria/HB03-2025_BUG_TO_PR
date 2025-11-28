"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";

export function HeroContent() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="text-center relative z-10"
    >
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

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="text-lg sm:text-xl text-white max-w-2xl mx-auto mb-10 leading-relaxed tracking-tight"
        style={{ fontFamily: '"Suisseintl", sans-serif', fontWeight: 300 }}
      >
        Paste your error, let AI fix it, get a PR.{" "}
        <span className="text-white/90 font-medium">That simple.</span>
      </motion.p>

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
              className="relative h-12 px-8 gap-2 text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200 bg-white text-black hover:bg-white/90 cursor-pointer uppercase tracking-normal"
            >
              Start Fixing Bugs
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </div>
        </Link>
        <Link href={ROUTES.LOGIN} className="cursor-pointer">
          <Button 
            variant="outline" 
            size="lg" 
            className="h-12 px-8 text-sm font-medium !border-white/40 !text-white !bg-white/10 backdrop-blur-md dark:!bg-white/10 dark:!border-white/40 hover:!bg-white/20 hover:!text-white hover:!border-white/60 transition-all duration-200 cursor-pointer uppercase tracking-normal"
          >
            Create Account
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  );
}

