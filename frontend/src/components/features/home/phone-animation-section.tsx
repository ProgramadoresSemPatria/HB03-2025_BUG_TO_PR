"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface PhoneAnimationSectionProps {
  firstImage?: string;
  secondImage?: string;
}

export function PhoneAnimationSection({ 
  firstImage = "/images/IMG_7507.png",
  secondImage = "/images/IMG_7507.png" 
}: PhoneAnimationSectionProps) {
  const phoneRef = useRef<HTMLDivElement>(null);
  const screenContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let scrollTriggerInstance: ReturnType<typeof import("gsap/ScrollTrigger").ScrollTrigger.create> | null = null;

    const loadGSAP = async () => {
      const gsap = (await import("gsap")).default;
      const ScrollTrigger = (await import("gsap/ScrollTrigger")).default;
      
      gsap.registerPlugin(ScrollTrigger);

      if (!phoneRef.current || !screenContainerRef.current || !sectionRef.current) return;

      const phone = phoneRef.current;
      const screenContainer = screenContainerRef.current;
      const section = sectionRef.current;

      gsap.set(phone, {
        rotationY: -90,
        rotationX: 15,
        scale: 0.8,
        transformOrigin: "center center",
        transformStyle: "preserve-3d",
      });

      const phoneHeight = 560;
      
      gsap.set(screenContainer, {
        y: 0,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 60%",
          end: "bottom 20%",
          scrub: 1.5,
          pin: false,
          anticipatePin: 1,
        },
      });

      scrollTriggerInstance = tl.scrollTrigger || null;

      tl.to(phone, {
        rotationY: 0,
        rotationX: 0,
        scale: 1,
        duration: 0.5,
        ease: "power2.inOut",
      })
      .to(screenContainer, {
        y: -phoneHeight,
        duration: 0.5,
        ease: "power2.inOut",
      }, "-=0.2");
    };

    loadGSAP();

    return () => {
      if (scrollTriggerInstance) {
        scrollTriggerInstance.kill();
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-background py-32 flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="w-full max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6 leading-tight"
            style={{ fontFamily: '"Lyondisplay App", Georgia, serif', fontWeight: 300 }}
          >
            Fix issue by your phone,
            <br />
            let AI do it review and fix
          </h2>
          <p
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto"
            style={{ fontFamily: '"Suisseintl", sans-serif', fontWeight: 300 }}
          >
            Our AI agent analyzes your error, creates a fix, and opens a pull request—all from your mobile device.
          </p>
        </motion.div>

        <div className="relative flex items-center justify-center min-h-[700px]" style={{ perspective: "1000px" }}>
          <div
            ref={phoneRef}
            className="relative w-[280px] h-[560px] mx-auto"
            style={{
              transformStyle: "preserve-3d",
            }}
          >
             <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-950 rounded-[2.5rem] p-[6px] shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
               <div className="w-full h-full rounded-[2rem] overflow-hidden relative bg-black">
                 <div
                   ref={screenContainerRef}
                   className="absolute inset-0 w-full h-full"
                   style={{
                     height: "200%",
                   }}
                 >
                   <div
                     className="absolute top-0 left-0 w-full h-full"
                     style={{
                       height: "50%",
                       backgroundImage: `url('${firstImage}')`,
                       backgroundSize: "cover",
                       backgroundPosition: "top center",
                       backgroundRepeat: "no-repeat",
                     }}
                   />
                   <div
                     className="absolute top-[50%] left-0 w-full h-full"
                     style={{
                       height: "50%",
                       backgroundImage: `url('${secondImage}')`,
                       backgroundSize: "cover",
                       backgroundPosition: "top center",
                       backgroundRepeat: "no-repeat",
                     }}
                   />
                 </div>
                 <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20">
                   <div className="w-24 h-7 bg-black rounded-full shadow-lg" />
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

