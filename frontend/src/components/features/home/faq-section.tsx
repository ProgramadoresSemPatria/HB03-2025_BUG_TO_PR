"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "./scroll-reveal";

const FAQS = [
  {
    question: "Does it really work just from your phone? No laptop needed?",
    answer: "YES! And this is what will change your life. You're on the subway, at a café, in line at the bank... a critical bug appears in production? Paste the stack trace on your phone, hit send, and our AI agent is already working. In minutes you get the notification: PR created, reviewed, and ready to merge. Zero need to open your computer. Zero stress. Zero wasted time.",
  },
  {
    question: "How do I know about the bug without my computer? Where does the stack trace come from?",
    answer: "Great question! Bugs find you everywhere—not just when you're coding. You get a Slack alert from Sentry about a production error. A teammate sends you a stack trace via WhatsApp. Your CI/CD pipeline fails and sends you an email. A user reports a bug and you screenshot the error. You're reviewing logs on your phone from your monitoring tool. The stack trace is already in your notifications, messages, or email—you just copy and paste it into our app. No need to be at your computer. The bug comes to you, and you fix it from anywhere.",
  },
  {
    question: "How much time do I save compared to the manual process?",
    answer: "Let's break down the numbers: manual process = 15-30 minutes analyzing the error + 20-40 minutes writing the fix + 10 minutes creating the PR + review time. Total: 45-80 minutes PER BUG. With our agent: you paste the error on your phone (10 seconds) and receive the ready PR in 2-5 minutes. Savings of 40-75 minutes PER BUG. If you have 5 bugs per week, that's 200-375 minutes saved. That's 3-6 hours of your life back every week.",
  },
  {
    question: "Does the AI agent really work autonomously? Won't it break my code?",
    answer: "Our AI agent doesn't just analyze the error—it UNDERSTANDS the context of your code, identifies the root cause, creates the fix following best practices from your codebase, and even opens a PR with detailed description. All while you drink your coffee. It learns from every fix and continuously improves. It's like having a senior developer working 24/7 just for you.",
  },
  {
    question: "Does it work with any language and framework?",
    answer: "Absolutely. JavaScript, TypeScript, Python, Java, Go, Rust, Ruby, PHP... it doesn't matter. Our AI agent understands stack traces from any language and framework. React, Vue, Angular, Django, Rails, Spring Boot—it's seen it all and knows how to fix it. And if it encounters something new? It learns on the spot. It's like having an expert in ALL technologies in the palm of your hand.",
  },
  {
    question: "What about security? Is my code safe?",
    answer: "Security is our #1 priority. All processing happens in isolated and encrypted environments. Your code is never permanently stored. We use GitHub OAuth authentication—you control exactly which repositories the agent can access. And best of all: you review every PR before merging. You're always in control. It's safer than letting a junior developer make direct commits to main.",
  },
  {
    question: "What if the agent can't fix a specific bug?",
    answer: "It happens. Complex bugs that require architectural decisions or deep changes may need human intervention. But here's the differentiator: even in these cases, the agent gives you a detailed analysis of the problem, suggests possible solutions, and documents everything perfectly. You don't start from zero—you start with a complete diagnosis and a correction roadmap. And with every bug it fixes, it gets smarter. It's an investment that only gets better over time.",
  },
  {
    question: "Is it really worth it? Isn't it just another tool that promises and doesn't deliver?",
    answer: "We understand your skepticism. That's why we offer a free trial—try it with real bugs from your project. See the agent create perfect PRs in minutes. Watch your productivity skyrocket. See how you can finally focus on what matters: building features, not putting out fires. Hundreds of developers have already transformed their workflow. You could be next. The only question is: how much more time will you waste debugging manually?",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadGSAP = async () => {
      const gsap = (await import("gsap")).default;
      const ScrollTrigger = (await import("gsap/ScrollTrigger")).default;
      
      gsap.registerPlugin(ScrollTrigger);

      itemsRef.current.forEach((item, index) => {
        if (!item) return;

        gsap.fromTo(
          item,
          {
            opacity: 0,
            y: 40,
            scale: 0.95,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            delay: index * 0.08,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    };

    loadGSAP();
  }, []);

  return (
    <section className="w-full max-w-5xl mx-auto px-6 py-24">
      <ScrollReveal>
        <div className="text-center mb-16">
          <h2 
            className="text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-4 leading-tight"
            style={{ fontFamily: '"Lyondisplay App", Georgia, serif', fontWeight: 300 }}
          >
            Questions Every Smart Developer Asks
          </h2>
          <p 
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto"
            style={{ fontFamily: '"Suisseintl", sans-serif', fontWeight: 300 }}
          >
            (And the answers that will make you want to start right now)
          </p>
        </div>
      </ScrollReveal>

      <div className="space-y-4">
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={index}
              ref={(el) => {
                itemsRef.current[index] = el;
              }}
              className="border border-border/50 rounded-xl overflow-hidden bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300"
            >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full px-6 py-5 flex items-start justify-between gap-4 text-left hover:bg-muted/30 transition-colors group"
                >
                  <h3 className={cn(
                    "text-lg font-semibold transition-colors flex-1 text-left",
                    isOpen ? "text-foreground" : "text-foreground/90 group-hover:text-foreground"
                  )}>
                    {faq.question}
                  </h3>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 mt-0.5",
                      isOpen && "rotate-180 text-primary"
                    )}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 pt-0">
                        <p className="text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
    </section>
  );
}

