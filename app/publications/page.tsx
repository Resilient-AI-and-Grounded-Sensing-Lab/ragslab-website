import { PublicationsList } from "@/components/Publications";
import { getPublications } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export const metadata = {
  title: "Publications",
  description:
    "Browse RAGS Lab publications, preprints, and project reports.",
  alternates: {
    canonical: "/publications"
  },
  openGraph: {
    title: "Publications | RAGS Lab",
    description:
      "Browse RAGS Lab publications, preprints, and project reports.",
    url: "/publications",
    images: [siteConfig.ogImage]
  },
  twitter: {
    title: "Publications | RAGS Lab",
    description:
      "Browse RAGS Lab publications, preprints, and project reports.",
    images: [siteConfig.ogImage]
  }
};

export default function PublicationsPage() {
  const publications = getPublications();

  return (
    <div className="page-shell">
      <section className="compact-page-intro">
        <p className="eyebrow">Publications</p>
        <h1>Research outputs.</h1>
        <p className="lede">
          Publications, preprints, and project reports will be collected here as
          the lab grows.
        </p>
      </section>

      <section className="section">
        <p className="eyebrow">All publications</p>
        <PublicationsList publications={publications} />
      </section>
    </div>
  );
}
