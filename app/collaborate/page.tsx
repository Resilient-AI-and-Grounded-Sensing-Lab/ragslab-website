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
      "We work with end-users to understand where existing AI breaks in the field, and what the operational constraints are."
  },
  {
    title: "Field-informed prototypes",
    copy:
      "We can translate operational constraints into evaluations, V&V, and research prototypes."
  },
  {
    title: "Data and sensing interpretation",
    copy:
      "We aim to model data that traditionally requires specialized expertise to understand with attention to sensor physics and failure modes."
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
            We collaborate with first responders, public
            safety teams, humanitarian operators, warfighters, researchers, and
            technical partners who need breakthroughs for their environments.
          </p>
        </div>
        <div className="collab-panel" aria-hidden="true">
          <video
            autoPlay
            loop
            muted
            playsInline
            poster={assetPath("/brand/logo-no-text.svg")}
          >
            <source src={assetPath("/brand/collaborate.mp4")} type="video/mp4" />
          </video>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <div>
            <p className="eyebrow">How we work</p>
            <h2>Collaboration that starts with reality.</h2>
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
