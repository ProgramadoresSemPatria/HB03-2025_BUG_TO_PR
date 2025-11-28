"use client";

import { motion } from "framer-motion";
import { Sparkles, Check } from "lucide-react";
import { CHANGELOG } from "@/constants";
import { cn } from "@/lib/utils";

export function ChangelogSection() {
  return (
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
              {index < CHANGELOG.length - 1 && (
                <div className="absolute left-[15px] top-10 w-px h-[calc(100%-16px)] bg-border/50" />
              )}

              <div className="flex gap-6 py-6 hover:bg-muted/10 rounded-lg px-2 -mx-2 transition-colors">
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
  );
}

