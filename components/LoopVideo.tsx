"use client";

import { useEffect, useRef } from "react";
import { assetPath } from "@/lib/assets";

export function LoopVideo({ src, poster, progress = false }: { src: string; poster?: string; progress?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const line = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    function sync() {
      if (!video) return;
      if (reduced.matches || !visible || document.hidden) video.pause();
      else video.play().catch(() => { /* A blocked autoplay leaves the poster visible. */ });
    }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(video);
    reduced.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      video.pause();
      observer.disconnect();
      reduced.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return <>
    <video ref={ref} loop muted playsInline preload="metadata" aria-hidden="true" poster={poster ? assetPath(poster) : undefined}
      onTimeUpdate={() => {
        const video = ref.current;
        if (video?.duration && line.current) line.current.style.transform = `scaleX(${video.currentTime / video.duration})`;
      }}>
      <source src={assetPath(src)} type="video/mp4" />
    </video>
    {progress ? <div ref={line} className="film-line" aria-hidden="true" /> : null}
  </>;
}
