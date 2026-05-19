import { PeopleGrid } from "@/components/PeopleGrid";
import { getPeople, Person } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export const metadata = {
  title: "People",
  description:
    "Meet the RAGS Lab researchers working on resilient AI, grounded sensing, and real-world deployment.",
  alternates: {
    canonical: "/people"
  },
  openGraph: {
    title: "People | RAGS Lab",
    description:
      "Meet the RAGS Lab researchers working on resilient AI, grounded sensing, and real-world deployment.",
    url: "/people",
    images: [siteConfig.ogImage]
  },
  twitter: {
    title: "People | RAGS Lab",
    description:
      "Meet the RAGS Lab researchers working on resilient AI, grounded sensing, and real-world deployment.",
    images: [siteConfig.ogImage]
  }
};

export default function PeoplePage() {
  const people = getPeople();
  const principalInvestigators = people.filter((person) => person.group === "pi");
  const postDocs = people.filter((person) => person.group === "post-docs");
  const phdStudents = people.filter((person) => person.group === "phd-students");

  return (
    <div className="page-shell">
      <section className="compact-page-intro">
        <p className="eyebrow">People</p>
        <h1>People</h1>
        <p className="body-copy">
          RAGS Lab brings together researchers interested in resilient AI,
          grounded sensing, operational constraints, and technologies that can
          survive contact with real conditions.
        </p>
      </section>

      <PeopleSection title="Principal Investigator" people={principalInvestigators} />
      <PeopleSection title="Post-Docs" people={postDocs} />
      <PeopleSection title="Ph.D. Students" people={phdStudents} />
    </div>
  );
}

function PeopleSection({
  title,
  people
}: {
  title: string;
  people: Person[];
}) {
  if (!people.length) return null;

  return (
    <section className="people-section">
      <h2>{title}</h2>
      <PeopleGrid people={people} />
    </section>
  );
}
