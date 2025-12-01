"use client";

import { useEffect, useRef } from "react";

interface VideoBackgroundProps {
  videoSrc?: string;
  posterSrc?: string;
  className?: string;
}

export function VideoBackground({
  videoSrc = "/videos/hero-clouds.mp4",
  posterSrc = "/videos/hero-clouds-poster.jpg",
  className = "",
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.log("Autoplay bloqueado:", error);
      });
    }
  }, []);

  return (
    <div className={`absolute inset-0 w-full h-full overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        poster={posterSrc}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          objectFit: "cover",
          width: "100vw",
          height: "100vh",
          minWidth: "100%",
          minHeight: "100%",
        }}
      >
        <source src={videoSrc} type="video/mp4" />
        Seu navegador não suporta vídeos HTML5.
      </video>
    </div>
  );
}
