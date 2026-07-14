import { Person } from "@/lib/content";
import { ProgressiveImage } from "@/components/ProgressiveImage";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function safeEmail(email: string) {
  const [name, domain = ""] = email.split("@");
  return `${name} [at] ${domain.replace(/\./g, " [dot] ")}`;
}

export function PeopleGrid({
  people,
  prioritizeFirst = false
}: {
  people: Person[];
  prioritizeFirst?: boolean;
}) {
  return (
    <div className="grid-list">
      {people.map((person, index) => (
        <article className="person-card" key={person.slug}>
          {person.image ? (
            <ProgressiveImage
              asset={person.image}
              className="avatar avatar-image"
              alt=""
              sizes="72px"
              loading={prioritizeFirst && index === 0 ? "eager" : "lazy"}
              fetchPriority={prioritizeFirst && index === 0 ? "high" : "auto"}
              objectFit="cover"
            />
          ) : (
            <span className="avatar" aria-hidden="true">
              {initials(person.name)}
            </span>
          )}
          <div>
            <h3>
              {person.website ? (
                <a className="person-name-link" href={person.website}>
                  {person.name}
                </a>
              ) : (
                person.name
              )}
            </h3>
            <p>{person.description}</p>
            {person.email ? (
              <span className="safe-email" aria-label="Email address">
                {safeEmail(person.email)}
              </span>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}
