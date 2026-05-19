import Link from "next/link";
import { Hero } from "@/components/Hero";
import { ResearchGrid } from "@/components/ResearchGrid";
import { getResearch } from "@/lib/content";

export default function Home() {
  const research = getResearch().filter((item) => item.featured).slice(0, 4);

  return (
    <>
      <Hero />

      <section className="section">
        <div className="section-header section-header-compact">
          <div>
            <p className="eyebrow">Current research</p>
            <h2 className="sr-only">Current research</h2>
          </div>
        </div>
        <ResearchGrid items={research} />
      </section>

      <section className="section callout">
        <p className="eyebrow">Partner with the lab</p>
        <h2>Bring hard problems from the field.</h2>
        <p className="body-copy">
          We collaborate with first responders, emergency managers, public
          safety teams, humanitarian operators, students, and researchers who
          want technology to work in the environments where it will be used.
        </p>
        <div className="button-row">
          <Link className="button" href="/collaborate">
            Start a collaboration
          </Link>
        </div>
      </section>
    </>
  );
}
