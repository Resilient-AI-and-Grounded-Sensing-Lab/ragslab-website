import { PublicationsList } from "@/components/Publications";
import { getPublications } from "@/lib/content";

export const metadata = {
  title: "Publications | RAGS Lab"
};

export default function PublicationsPage() {
  const publications = getPublications();
  const featured = publications.filter((publication) => publication.featured);

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
