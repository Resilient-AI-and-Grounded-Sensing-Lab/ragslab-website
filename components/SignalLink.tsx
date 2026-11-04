"use client";

import Link from "next/link";
import { useEffect, useRef, type ComponentProps } from "react";
import { signalNoise, smooth } from "@/lib/signal";

/** Navigation-only motion; the original link remains the accessible hit target. */
export function SignalLink({ children, ...props }: ComponentProps<typeof Link>) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const control = ref.current;
    if (!control) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let surface: HTMLSpanElement | null = null;

    function reset() {
      cancelAnimationFrame(frame);
      control?.classList.remove("signal-active");
      surface?.remove();
      surface = null;
    }

    function run() {
      if (!control || reduced.matches || surface || document.hidden) return;
      const style = getComputedStyle(control);
      const { width, height } = control.getBoundingClientRect();
      if (!width || !height) return;
      const label = control.querySelector(".signal-label")?.textContent ?? "";
      const padding = 12;
      const extent = width + padding * 2;
      const duration = parseFloat(style.getPropertyValue("--motion-denoise")) || 1250;
      const layer = document.createElement("span");
      layer.className = "signal-surface";
      layer.setAttribute("aria-hidden", "true");
      layer.style.left = `${-padding - parseFloat(style.borderLeftWidth)}px`;
      layer.style.top = `${-padding - parseFloat(style.borderTopWidth)}px`;
      layer.style.width = `${extent}px`;
      layer.style.height = `${height + padding * 2}px`;
      const pieces: Array<{ element: HTMLSpanElement; x: number; y: number }> = [];

      // CSS clipping and transforms work on HTML in Safari without an SVG filter.
      // Each strip paints the same button, including its background and border.
      for (let x = 0; x < extent; x += 2) {
        const clip = document.createElement("span");
        clip.className = "signal-strip";
        clip.style.left = `${x}px`;
        clip.style.width = `${Math.min(2, extent - x)}px`;
        const copy = document.createElement("span");
        copy.className = "signal-copy";
        copy.textContent = label;
        Object.assign(copy.style, {
          left: `${padding - x}px`,
          top: `${padding}px`,
          width: `${width}px`,
          height: `${height}px`,
          font: style.font,
          letterSpacing: style.letterSpacing,
          color: style.color,
          backgroundColor: style.backgroundColor,
          border: style.border,
          borderRadius: style.borderRadius
        });
        clip.append(copy);
        layer.append(clip);
        const u = (x - padding + 1) / width;
        pieces.push({
          element: copy,
          x: 2 * Math.sin(u * 11 + 4.65),
          y: 5 * signalNoise(u, 1.5, 0) / .056
        });
      }

      // Prepare the replacement before hiding the original paint. Text and the
      // anchor stay in the accessibility tree; the decorative copies do not.
      control.append(layer);
      surface = layer;
      control.classList.add("signal-active");
      const started = performance.now();
      function settle(now: number) {
        const progress = Math.min(1, (now - started) / duration);
        const amount = progress < .16 ? smooth(progress / .16) : 1 - smooth((progress - .16) / .84);
        for (const piece of pieces) {
          piece.element.style.transform = `translate(${piece.x * amount}px, ${piece.y * amount}px)`;
        }
        if (progress < 1 && !reduced.matches && !document.hidden) frame = requestAnimationFrame(settle);
        else reset();
      }
      frame = requestAnimationFrame(settle);
    }

    control.addEventListener("pointerenter", run);
    control.addEventListener("focus", run);
    control.addEventListener("click", reset);
    reduced.addEventListener("change", reset);
    window.addEventListener("resize", reset);
    document.addEventListener("visibilitychange", reset);
    return () => {
      reset();
      control.removeEventListener("pointerenter", run);
      control.removeEventListener("focus", run);
      control.removeEventListener("click", reset);
      reduced.removeEventListener("change", reset);
      window.removeEventListener("resize", reset);
      document.removeEventListener("visibilitychange", reset);
    };
  }, []);

  return <Link {...props} ref={ref}><span className="signal-label">{children}</span></Link>;
}
