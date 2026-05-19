import Link from "next/link";
import { assetPath } from "@/lib/assets";
import { siteConfig } from "@/lib/site";

export const metadata = {
  title: "Collaborate",
  description:
    "Partner with RAGS Lab on field-informed AI systems, sensing workflows, evaluation, and research programs.",
  alternates: {
    canonical: "/collaborate"
  },
  openGraph: {
    title: "Collaborate | RAGS Lab",
    description:
      "Partner with RAGS Lab on field-informed AI systems, sensing workflows, evaluation, and research programs.",
    url: "/collaborate",
    images: [siteConfig.ogImage]
  },
  twitter: {
    title: "Collaborate | RAGS Lab",
    description:
      "Partner with RAGS Lab on field-informed AI systems, sensing workflows, evaluation, and research programs.",
    images: [siteConfig.ogImage]
  }
};

const pathways = [
  {
    title: "Problem discovery",
    copy:
      "We work with end-users to understand what breaks in the field, what evidence is available, and where AI could responsibly help."
  },
  {
    title: "Field-informed prototypes",
    copy:
      "We can translate operational constraints into research prototypes, evaluation scenarios, and sensing workflows."
  },
  {
    title: "Data and sensing interpretation",
    copy:
      "We study radar, low-quality audio, imagery, and other difficult signals with attention to sensor physics and failure modes."
  },
  {
    title: "Evaluation and training",
    copy:
      "We can help pressure-test emerging systems, design realistic evaluation protocols, and brief teams on capabilities and limits."
  },
  {
    title: "Student and research partnerships",
    copy:
      "Prospective students and researchers can connect around open problems in resilient AI, grounded sensing, and deployment."
  },
  {
    title: "Grant and program development",
    copy:
      "We can partner on proposals where field needs, AI research, and responsible implementation need to move together."
  }
];

export default function CollaboratePage() {
  return (
    <div className="page-shell">
      <section className="compact-page-intro collab-hero">
        <div>
          <p className="eyebrow">Collaborate</p>
          <h1>Bring us the hard parts.</h1>
          <p className="lede">
            We collaborate with first responders, emergency managers, public
            safety teams, humanitarian operators, students, researchers, and
            technical partners who want AI systems shaped by real constraints.
          </p>
          <div className="button-row">
            <a className="button" href={siteConfig.collaborationHref}>
              Start a conversation
            </a>
            <Link className="button secondary" href="/publications">
              See publications
            </Link>
          </div>
        </div>
        <div className="collab-panel" aria-hidden="true">
          <span
            className="collab-pattern"
            style={{
              backgroundImage: `linear-gradient(90deg, transparent 0 48%, rgba(232, 93, 4, 0.28) 49% 51%, transparent 52%), url("${assetPath("/brand/line-drawing.png")}")`
            }}
          />
          <img src={assetPath("/brand/logo-no-text.svg")} alt="" />
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <div>
            <p className="eyebrow">How we work</p>
            <h2>Collaboration that starts with reality.</h2>
          </div>
          <p className="body-copy">
            This copy is intentionally provisional for v1. The structure is
            ready for field-specific language once the first partnerships and
            opportunities are finalized.
          </p>
        </div>
        <div className="grid-list">
          {pathways.map((pathway) => (
            <article className="collab-card" key={pathway.title}>
              <h3>{pathway.title}</h3>
              <p>{pathway.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="split-section">
        <div>
          <p className="eyebrow">What we can offer</p>
          <h2>Research capacity for operational questions.</h2>
        </div>
        <div>
          <p className="body-copy">
            The lab can support early technical scoping, model and sensor
            evaluation, prototype design, student research projects, proposal
            development, and evidence-centered discussions about what AI can and
            cannot do in crisis environments.
          </p>
          <p className="body-copy">
            The goal is not to force a tool into an operation. The goal is to
            understand the operation deeply enough that the research becomes
            useful.
          </p>
        </div>
      </section>
    </div>
  );
}
