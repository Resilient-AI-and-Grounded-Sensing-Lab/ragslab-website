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
  const fellows = people.filter((person) => person.group == "fellows")

  return (
    <div className="page-shell">
      <section className="compact-page-intro">
        <h1 className="intro-title">People</h1>
      </section>

      <PeopleSection title="Principal Investigator" people={principalInvestigators} prioritizeFirst />
      <PeopleSection title="Post-Docs" people={postDocs} />
      <PeopleSection title="Ph.D. Students" people={phdStudents} />
      <PeopleSection title="Fellows" people={fellows} />
    </div>
  );
}

function PeopleSection({
  title,
  people,
  prioritizeFirst = false
}: {
  title: string;
  people: Person[];
  prioritizeFirst?: boolean;
}) {
  if (!people.length) return null;

  return (
    <section className="people-section">
      <h2>{title}</h2>
      <PeopleGrid people={people} prioritizeFirst={prioritizeFirst} />
    </section>
  );
}
