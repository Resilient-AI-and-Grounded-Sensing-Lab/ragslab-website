import Link from "next/link";
import { Hero } from "@/components/Hero";
import { SignalField } from "@/components/SignalField";
import { PublicationCard } from "@/components/Publications";
import { ProgressiveImage } from "@/components/ProgressiveImage";
import { getPeople, getPublications } from "@/lib/content";

export default function Home() {
  const publications = getPublications().filter((paper) => paper.featured).slice(0, 2);
  const people = getPeople();
  const portraits = [...people.filter((person) => person.group === "pi"), ...people.filter((person) => person.group !== "pi")].filter((person) => person.image);
  const columns = Math.ceil(Math.sqrt(portraits.length * 2));
  const rows = Math.ceil(portraits.length / columns);
  // Keep the footprint fixed; denser rosters use smaller, more overlapping bubbles.
  const portraitSize = Math.min(38, 53.5 / Math.pow(portraits.length, .4));
  return (
    <>
      <Hero />
      <section className="home-research" id="research" aria-labelledby="research-heading">
        <div className="wrap">
          <h2 id="research-heading">Research</h2>
          <div className="home-research-grid">
            <figure className="signal-drawing"><SignalField /></figure>
            <div className="research-publications">
              {publications.map((paper) => <PublicationCard publication={paper} compact key={paper.slug} />)}
              <Link className="button more-papers" href="/publications">See all publications</Link>
            </div>
          </div>
        </div>
      </section>
      <section className="home-community">
        <div className="wrap">
          <div>
            <h2>People</h2>
            <ul className="portrait-cloud" aria-label="Lab members">
              {portraits.map((person, index) => {
                if (!person.image) return null;
                const row = Math.floor(index / columns);
                const column = index % columns;
                const rowCount = Math.min(columns, portraits.length - row * columns);
                const x = 50 + (column - (rowCount - 1) / 2) * Math.min(23, 69 / Math.max(1, columns - 1));
                const y = 50 + (row - (rows - 1) / 2) * (38 / Math.max(1, rows - 1)) + Math.sin(index * 2.4) * 3;
                return (
                  <li key={person.slug} title={person.name} style={{
                    left: `${x}%`, top: `${y}%`, width: `${portraitSize}%`
                  }}>
                    <ProgressiveImage asset={person.image} alt={person.name} sizes={`(min-width: 1500px) ${Math.ceil(464 * portraitSize / 100)}px, (max-width: 620px) ${Math.ceil(portraitSize)}vw, ${Math.ceil(384 * portraitSize / 100)}px`} />
                  </li>
                );
              })}
            </ul>
            <Link className="button button-on-dark" href="/people">Meet the lab</Link>
          </div>
          <div className="joining">
            <h2>Work with us</h2>
            <p>We collaborate with students, researchers, and practitioners working with real-world constraints.</p>
            <Link className="button button-on-dark" href="/collaborate">Collaborate with the lab</Link>
          </div>
        </div>
      </section>
    </>
  );
}
