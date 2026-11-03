"use client";

import { useEffect, useRef } from "react";
import { noiseAmount, signalNoise } from "@/lib/signal";

export function SignalField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0, height = 0, time = 0, last = 0, frame = 0, visible = false;
    const accent = getComputedStyle(canvas).getPropertyValue("--firecracker").trim();

    function draw(clock: number) {
      if (!context || !width || !height) return;
      context.clearRect(0, 0, width, height);
      const amount = noiseAmount(clock);
      for (let row = 0; row < 32; row++) {
        const depth = row / 31;
        context.beginPath();
        for (let i = 0; i <= 320; i++) {
          const u = i / 320;
          const peak = .145 * Math.exp(-Math.pow((u - (.3 + depth * .025)) / .12, 2));
          const second = .105 * Math.exp(-Math.pow((u - (.7 - depth * .025)) / .16, 2));
          const x = width * (.025 + u * .83 + depth * .13);
          const y = height * (.27 + depth * .5 - peak - second + amount * signalNoise(u, row, clock));
          if (i === 0) context.moveTo(x, y); else context.lineTo(x, y);
        }
        context.lineWidth = row === 14 ? 1.3 : .65;
        context.strokeStyle = row === 14 ? accent : `rgba(26,26,26,${.2 + row * .012})`;
        context.stroke();
      }
    }

    function tick(now: number) {
      time += last ? Math.min((now - last) / 1000, .05) : 0;
      last = now;
      draw(time);
      frame = requestAnimationFrame(tick);
    }

    function sync() {
      cancelAnimationFrame(frame);
      last = 0;
      if (reduced.matches) draw(8);
      else if (visible && !document.hidden) frame = requestAnimationFrame(tick);
    }

    const resize = new ResizeObserver(() => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const ratio = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw(reduced.matches ? 8 : time);
    });
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    resize.observe(canvas);
    intersection.observe(canvas);
    reduced.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      intersection.disconnect();
      reduced.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return <canvas ref={ref} role="img" aria-label="A signal field cycling between noise and a clean reconstruction">Signal reconstruction.</canvas>;
}
