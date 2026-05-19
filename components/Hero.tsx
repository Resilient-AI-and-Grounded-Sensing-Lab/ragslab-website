import Link from "next/link";
import { assetPath } from "@/lib/assets";
import { HeroCursorPattern } from "@/components/HeroCursorPattern";

export function Hero() {
  return (
    <section className="hero pattern-field">
      <HeroCursorPattern />
      <div className="hero-copy">
        <div className="hero-title">
          <p className="eyebrow">Resilient AI and Grounded Sensing Lab</p>
          <h1>AI for chaos.</h1>
        </div>
        <div className="hero-summary">
          <p className="lede">
            The RAGS Lab develops foundational methods for perception, reasoning, and learning
            in AI systems that must operate under uncertainty, adapt to changing conditions,
            and remain reliable in high-stakes real-world environments.
          </p>
          <div className="button-row">
            <Link className="button" href="/publications">
              Publications
            </Link>
            <Link className="button secondary" href="/collaborate">
              Collaborate
            </Link>
          </div>
        </div>
      </div>
      <div className="hero-art" aria-hidden="true">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={assetPath("/brand/logo-no-text.svg")}
        >
          <source src={assetPath("/brand/rags-lab-hero.mp4")} type="video/mp4" />
        </video>
      </div>
    </section>
  );
}
