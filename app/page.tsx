import Link from "next/link";
import { Hero } from "@/components/Hero";
import { SignalField } from "@/components/SignalField";
import { PublicationCard } from "@/components/Publications";
import { ProgressiveImage } from "@/components/ProgressiveImage";
import { getPeople, getPublications } from "@/lib/content";

export default function Home() {
  const publications = getPublications().filter((paper) => paper.featured).slice(0, 2);
  const people = getPeople();
  const portraits = [...people.filter((person) => person.group === "pi"), ...people.filter((person) => person.group !== "pi")].filter((person) => person.image).slice(0, 4);
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
            <div className="portraits">
              {portraits.map((person) => person.image ? <ProgressiveImage asset={person.image} alt={person.name} sizes="(min-width: 2240px) 112px, (min-width: 1760px) 5vw, (min-width: 1500px) 88px, (max-width: 620px) 62px, 70px" key={person.slug} /> : null)}
            </div>
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
