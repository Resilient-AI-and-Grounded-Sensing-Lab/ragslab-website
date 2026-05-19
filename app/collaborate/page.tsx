import { assetPath } from "@/lib/assets";
import { CompactIntroHeading } from "@/components/CompactIntroHeading";
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
      "We work with end-users to understand where existing AI breaks in the field, and what the operational constraints are."
  },
  {
    title: "Evaluation and training",
    copy:
      "Once we understand where things break, we build detailed evaluations and test protocols to pressure-test future research developments."
  },
  {
    title: "Data and sensing interpretation",
    copy:
      "Collecting datasets and grounding modeling in the physics of specific sensors is often necessary, and we work with you to create high-fidelity datasets."
  },
  {
    title: "Field-informed prototypes",
    copy:
      "We can translate operational constraints into evaluations, V&V, and research prototypes."
  },
  {
    title: "Student and research partnerships",
    copy:
      "We collaborate broadly with students, researchers, and companies to find novel solutions to problems and to scale our research."
  },
  {
    title: "Grant and program development",
    copy:
      "Field-focused work requires targeted funding, so we work with partners to fundraise around promising areas of inquiry."
  }
];

export default function CollaboratePage() {
  return (
    <div className="page-shell">
      <section className="compact-page-intro collab-hero">
        <div className="collab-hero-copy">
          <CompactIntroHeading title="Collaborate" />
          <p className="lede">
            We work with partners who have real constraints, messy signals, and
            operational stakes that standard AI demos ignore.
          </p>
        </div>
        <div className="collab-panel">
          <video
            autoPlay
            loop
            muted
            playsInline
            poster={assetPath("/brand/logo-no-text.svg")}
          >
            <source src={assetPath("/brand/collaborate.mp4")} type="video/mp4" />
          </video>
          <div className="collab-panel-caption">
            <p className="eyebrow">Field-grounded work</p>
            <p>
              As researchers, we prioritize field work to make sure we understand the problems faced by end users.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <div>
            <p className="eyebrow">How we work</p>
            <h2>Closing the research and deployment loop.</h2>
          </div>
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
    </div>
  );
}
