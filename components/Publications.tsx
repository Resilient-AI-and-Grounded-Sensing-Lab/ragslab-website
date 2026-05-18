import { groupPublicationsByYear, Publication } from "@/lib/content";

export function PublicationsList({ publications }: { publications: Publication[] }) {
  const grouped = groupPublicationsByYear(publications);
  const years = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="publication-list">
      {years.map((year) =>
        grouped[year].map((publication) => (
          <article className="publication-card" key={publication.slug}>
            <span className="publication-year">{year}</span>
            <div>
              <h3>{publication.title}</h3>
              <p>{publication.authors}</p>
              <p>
                <strong>{publication.venue}</strong>
              </p>
            </div>
          </article>
        ))
      )}
    </div>
  );
}
