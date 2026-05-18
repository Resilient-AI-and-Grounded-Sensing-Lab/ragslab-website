import Link from "next/link";
import { Hero } from "@/components/Hero";
import { ProjectGrid } from "@/components/ProjectGrid";
import { ResearchAgenda } from "@/components/ResearchAgenda";
import { getProjects } from "@/lib/content";
import { researchAgenda } from "@/lib/research";

export default function Home() {
  const projects = getProjects();
  const featuredProjects = projects.filter((project) => project.featured).slice(0, 3);

  return (
    <>
      <Hero />

      <section className="section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Problems we work on</p>
            <h2>Grounded systems for unforgiving conditions.</h2>
          </div>
          <p className="body-copy">
            Our research brings together machine learning, sensing, policy, and
            end-user input to build AI that sees through noise, reasons under
            uncertainty, and endures outside ideal conditions.
          </p>
        </div>
        <ResearchAgenda items={researchAgenda} />
      </section>

      <section className="section featured-projects-section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Featured projects</p>
            <h2>From sensor physics to field use.</h2>
          </div>
          <p className="body-copy">
            Current work turns imperfect field signals into AI systems that can
            reason with uncertainty, operational context, and real constraints.
          </p>
        </div>
        <ProjectGrid projects={featuredProjects} />
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
