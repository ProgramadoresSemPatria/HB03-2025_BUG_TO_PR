"use client";

import { Header, Footer } from "@/components/shared";
import { VideoBackground } from "@/components/features/hero";
import { HeroContent, TerminalPreview, ChangelogSection, CTASection, FloatingCards } from "@/components/features/home";

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Header variant="landing" />

      <main className="relative z-10">
        <section className="relative w-full min-h-screen overflow-hidden">
          <div className="absolute inset-0">
            <VideoBackground />
          </div>
          
          <div className="relative z-20 w-full max-w-6xl mx-auto px-6 pt-32 pb-20">
            <FloatingCards />
            <HeroContent />
            <TerminalPreview />
          </div>
        </section>

        <ChangelogSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
