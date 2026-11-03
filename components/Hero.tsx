import { LoopVideo } from "@/components/LoopVideo";

export function Hero() {
  return (
    <section className="hero" aria-label="About RAGS Lab">
      <LoopVideo src="/brand/rags-lab-hero.mp4" poster="/brand/hero-poster.webp" progress />
      <div className="hero-copy wrap">
        <h1>Resilient AI and<br />Grounded Sensing Lab</h1>
        <p>We study perception, reasoning, and learning in uncertain, changing environments.</p>
      </div>
    </section>
  );
}
