import Image from "next/image";
import { assetPath } from "@/lib/assets";
import { groupPublicationsByYear, Publication } from "@/lib/content";

export function PublicationsList({ publications }: { publications: Publication[] }) {
  const grouped = groupPublicationsByYear(publications);
  const years = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="publication-groups">
      {years.map((year) => (
        <section className="publication-year-section" aria-labelledby={`publications-${year}`} key={year}>
          <h2 id={`publications-${year}`}>{year}</h2>
          <div className="publication-list">
            {grouped[year].map((publication) => (
              <article className="publication-card" key={publication.slug}>
                <Image
                  className="publication-image"
                  src={assetPath(publication.image)}
                  alt=""
                  width={640}
                  height={480}
                  loading="lazy"
                />
                <div>
                  <h3>{publication.title}</h3>
                  <p>{publication.authors}</p>
                  <p>
                    <strong>{publication.venue}</strong>
                  </p>
                  <ul className="publication-links" aria-label="Publication resources">
                    {publication.links.map((link) => (
                      <li key={link.url}>
                        <a className="text-link" href={link.url}>
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
