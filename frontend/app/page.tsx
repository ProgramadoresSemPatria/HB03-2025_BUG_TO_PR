"use client";

import { Header, Footer } from "@/components/shared";
import { VideoBackground } from "@/components/features/hero";
import { HeroContent, TerminalPreview, ChangelogSection, CTASection, FloatingCards, PhoneAnimationSection } from "@/components/features/home";

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Header variant="landing" />

      <main className="relative z-10">
        <section className="relative w-full min-h-[70vh] overflow-hidden">
          <div className="absolute inset-0">
            <VideoBackground />
            <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to top, #03060B 0%, #03060B 8%, rgba(3, 6, 11, 0.7) 40%, rgba(3, 6, 11, 0.3) 70%, transparent 100%)' }} />
            <div className="absolute inset-0 z-10" style={{ background: 'radial-gradient(ellipse 80% 100% at 0% 100%, rgba(3, 6, 11, 0.8) 0%, rgba(3, 6, 11, 0.4) 40%, transparent 70%)' }} />
            <div className="absolute inset-0 z-10" style={{ background: 'radial-gradient(ellipse 80% 100% at 100% 100%, rgba(3, 6, 11, 0.8) 0%, rgba(3, 6, 11, 0.4) 40%, transparent 70%)' }} />
          </div>
          
          <div className="relative z-20 w-full max-w-6xl mx-auto px-6 pt-32 pb-20">
            <FloatingCards />
            <HeroContent />
            <TerminalPreview />
          </div>
        </section>

        <PhoneAnimationSection 
          firstImage="/images/code-review.png"
          secondImage="/images/pull-request.png"
        />
        <ChangelogSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
