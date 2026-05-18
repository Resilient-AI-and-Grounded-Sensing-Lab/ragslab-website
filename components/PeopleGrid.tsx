import { Person } from "@/lib/content";
import { assetPath } from "@/lib/assets";

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

export function PeopleGrid({ people }: { people: Person[] }) {
  return (
    <div className="grid-list">
      {people.map((person) => (
        <article className="person-card" key={person.slug}>
          {person.image ? (
            <img className="avatar avatar-image" src={assetPath(person.image)} alt="" />
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
