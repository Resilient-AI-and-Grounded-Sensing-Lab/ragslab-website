"use client";

import Link from "next/link";
import { useEffect, useId, useRef, type ComponentProps } from "react";
import { signalNoise, smooth } from "@/lib/signal";

/** Opt-in motion for navigation only. Ordinary .button links stay static. */
export function SignalLink(props: ComponentProps<typeof Link>) {
  const ref = useRef<HTMLAnchorElement>(null);
  const filterId = `signal-${useId().replace(/:/g, "")}`;

  useEffect(() => {
    const control = ref.current;
    if (!control) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.classList.add("signal-filter-definitions");
    svg.setAttribute("aria-hidden", "true");
    const defs = document.createElementNS(ns, "defs");
    const filter = document.createElementNS(ns, "filter");
    filter.id = filterId;
    filter.setAttribute("filterUnits", "userSpaceOnUse");
    filter.setAttribute("color-interpolation-filters", "sRGB");
    const map = document.createElementNS(ns, "feImage");
    map.setAttribute("result", "signal-map");
    map.setAttribute("preserveAspectRatio", "none");
    const displacement = document.createElementNS(ns, "feDisplacementMap");
    displacement.setAttribute("in", "SourceGraphic");
    displacement.setAttribute("in2", "signal-map");
    displacement.setAttribute("xChannelSelector", "R");
    displacement.setAttribute("yChannelSelector", "G");
    displacement.setAttribute("scale", "0");
    filter.append(map, displacement);
    defs.append(filter);
    svg.append(defs);
    document.body.append(svg);
    let frame = 0, active = false;

    function reset() {
      cancelAnimationFrame(frame);
      control?.style.removeProperty("filter");
      displacement.setAttribute("scale", "0");
      active = false;
    }

    function run() {
      if (!control || reduced.matches || active) return;
      const rect = control.getBoundingClientRect();
      const padding = 12, width = Math.ceil(rect.width) + padding * 2, height = Math.ceil(rect.height) + padding * 2;
      for (const node of [filter, map]) {
        node.setAttribute("x", String(-padding));
        node.setAttribute("y", String(-padding));
        node.setAttribute("width", String(width));
        node.setAttribute("height", String(height));
      }
      const field = document.createElement("canvas");
      field.width = width;
      field.height = height;
      const context = field.getContext("2d");
      if (!context) return;
      const pixels = context.createImageData(width, height);
      for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
        const u = (x - padding) / rect.width, row = (y - padding) / rect.height * 3, offset = (y * width + x) * 4;
        pixels.data[offset] = 128 + 45 * Math.sin(row * 3.1 + u * 11);
        pixels.data[offset + 1] = 128 + 127 * signalNoise(u, row, 0) / .056;
        pixels.data[offset + 2] = 128;
        pixels.data[offset + 3] = 255;
      }
      context.putImageData(pixels, 0, 0);
      map.setAttribute("href", field.toDataURL());
      const duration = parseFloat(getComputedStyle(control).getPropertyValue("--motion-denoise")) || 1250;
      const started = performance.now();
      active = true;
      control.style.filter = `url(#${filterId})`;
      function settle(now: number) {
        const progress = Math.min(1, (now - started) / duration);
        const amount = progress < .16 ? smooth(progress / .16) : 1 - smooth((progress - .16) / .84);
        displacement.setAttribute("scale", String(10 * amount));
        if (progress < 1 && !reduced.matches) frame = requestAnimationFrame(settle);
        else reset();
      }
      frame = requestAnimationFrame(settle);
    }

    control.addEventListener("pointerenter", run);
    control.addEventListener("focus", run);
    reduced.addEventListener("change", reset);
    return () => {
      reset();
      svg.remove();
      control.removeEventListener("pointerenter", run);
      control.removeEventListener("focus", run);
      reduced.removeEventListener("change", reset);
    };
  }, [filterId]);

  return <Link {...props} ref={ref} />;
}
