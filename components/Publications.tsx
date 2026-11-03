import Image from "next/image";
import { assetPath } from "@/lib/assets";
import { groupPublicationsByYear, Publication } from "@/lib/content";

export function PublicationCard({ publication, compact = false }: { publication: Publication; compact?: boolean }) {
  const primary = publication.links.find((link) => link.label === "Paper") ?? publication.links[0];
  const figure = <Image className="publication-image" src={assetPath(publication.image)} alt="" width={640} height={480} loading="lazy" />;
  return (
    <article className={`publication-card${compact ? " publication-card-compact" : ""}`}>
      {primary ? <a className="publication-figure" href={primary.url} aria-label={`Read ${publication.title}`}>{figure}</a> : <div className="publication-figure">{figure}</div>}
      <div>
        <h3>{primary ? <a href={primary.url}>{publication.title}</a> : publication.title}</h3>
        {!compact ? <p className="publication-authors">{publication.authors}</p> : null}
        <p className="publication-meta">{publication.venue}{compact ? ` · ${publication.year}` : ""}</p>
        <ul className="publication-links" aria-label="Publication resources">
          {publication.links.map((link) => <li key={link.url}><a className="text-link" href={link.url}>{link.label}</a></li>)}
        </ul>
      </div>
    </article>
  );
}

export function PublicationsList({ publications }: { publications: Publication[] }) {
  const grouped = groupPublicationsByYear(publications);
  const years = Object.keys(grouped).map(Number).sort((a, b) => b - a);
  return (
    <div className="publication-groups">
      {years.map((year) => (
        <section className="publication-year-section" aria-labelledby={`publications-${year}`} key={year}>
          <h2 id={`publications-${year}`}>{year}</h2>
          <div className="publication-list">
            {grouped[year].map((publication) => <PublicationCard publication={publication} key={publication.slug} />)}
          </div>
        </section>
      ))}
    </div>
  );
}
