import fs from "node:fs";
import path from "node:path";

const contentRoot = path.join(process.cwd(), "content");

type Primitive = string | number | boolean | string[];

function parseValue(value: string): Primitive {
  const trimmed = value.trim();

  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (/^\d+$/.test(trimmed)) return Number(trimmed);
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    return trimmed
      .slice(1, -1)
      .split(",")
      .map((item) => item.trim().replace(/^["']|["']$/g, ""))
      .filter(Boolean);
  }

  return trimmed.replace(/^["']|["']$/g, "");
}

function parseFrontmatter<T extends Record<string, Primitive>>(raw: string) {
  if (!raw.startsWith("---")) {
    return { data: {} as Partial<T>, body: raw.trim() };
  }

  const closing = raw.indexOf("\n---", 3);
  if (closing === -1) {
    return { data: {} as Partial<T>, body: raw.trim() };
  }

  const frontmatter = raw.slice(3, closing).trim();
  const body = raw.slice(closing + 4).trim();
  const data = frontmatter.split("\n").reduce<Record<string, Primitive>>((acc, line) => {
    const separator = line.indexOf(":");
    if (separator === -1) return acc;

    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1);
    acc[key] = parseValue(value);
    return acc;
  }, {});

  return { data: data as Partial<T>, body };
}

type ContentRecord<T> = T & {
  slug: string;
  body: string;
};

function readCollection<T extends Record<string, Primitive>>(collection: string): ContentRecord<T>[] {
  const collectionPath = path.join(contentRoot, collection);
  if (!fs.existsSync(collectionPath)) return [];

  return fs
    .readdirSync(collectionPath)
    .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx?$/, "");
      const raw = fs.readFileSync(path.join(collectionPath, file), "utf8");
      const parsed = parseFrontmatter<T>(raw);

      return {
        slug,
        body: parsed.body,
        ...parsed.data
      } as ContentRecord<T>;
    });
}

export type Person = {
  slug: string;
  group: string;
  name: string;
  description: string;
  email?: string;
  website?: string;
  image?: string;
};

export type Project = {
  slug: string;
  body: string;
  title: string;
  summary: string;
  status: string;
  areas: string[];
  lead: string;
  featured: boolean;
  order: number;
};

export type Publication = {
  slug: string;
  body: string;
  title: string;
  authors: string;
  venue: string;
  year: number;
  links: string[];
  tags: string[];
  featured: boolean;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseYamlScalar(value: string): Primitive {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (/^\d+$/.test(trimmed)) return Number(trimmed);
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    return trimmed
      .slice(1, -1)
      .split(",")
      .map((item) => item.trim().replace(/^["']|["']$/g, ""))
      .filter(Boolean);
  }

  return trimmed.replace(/^["']|["']$/g, "");
}

function parsePeopleYaml(raw: string) {
  const people: Record<string, Primitive>[] = [];
  let current: Record<string, Primitive> | null = null;

  raw.split("\n").forEach((rawLine) => {
    const withoutComment = rawLine.replace(/\s+#.*$/, "");
    const line = withoutComment.trim();
    if (!line) return;

    if (line.startsWith("- ")) {
      if (current) people.push(current);
      current = {};
      const remainder = line.slice(2);
      if (!remainder) return;

      const separator = remainder.indexOf(":");
      if (separator === -1) return;
      current[remainder.slice(0, separator).trim()] = parseYamlScalar(remainder.slice(separator + 1));
      return;
    }

    if (!current) return;
    const separator = line.indexOf(":");
    if (separator === -1) return;
    current[line.slice(0, separator).trim()] = parseYamlScalar(line.slice(separator + 1));
  });

  if (current) people.push(current);
  return people;
}

function peopleGroupFromFilename(file: string) {
  return file.replace(/\.ya?ml$/, "");
}

function lastName(name: string) {
  const parts = name.trim().split(/\s+/);
  return parts.at(-1) ?? name;
}

function comparePeopleByLastName(a: Person, b: Person) {
  const last = lastName(a.name).localeCompare(lastName(b.name));
  if (last !== 0) return last;
  return a.name.localeCompare(b.name);
}

function resolvePeopleImagePath(image: string) {
  if (!image) return "";
  if (image.startsWith("http://") || image.startsWith("https://") || image.startsWith("/")) return image;
  return `/people/${image}`;
}

function readPeopleYaml() {
  const collectionPath = path.join(contentRoot, "people");
  if (!fs.existsSync(collectionPath)) return [];

  return fs
    .readdirSync(collectionPath)
    .filter((file) => file.endsWith(".yaml") || file.endsWith(".yml"))
    .flatMap((file) => {
      const group = peopleGroupFromFilename(file);
      const raw = fs.readFileSync(path.join(collectionPath, file), "utf8");

      return parsePeopleYaml(raw).map((person, index) => {
        const name = String(person.name ?? "");
        return {
          slug: slugify(name || `${group}-${index + 1}`),
          group,
          name,
          description: String(person.description ?? ""),
          email: String(person.email ?? ""),
          website: String(person.website ?? ""),
          image: resolvePeopleImagePath(String(person.image ?? ""))
        } satisfies Person;
      });
    });
}

export function getPeople() {
  return readPeopleYaml().sort(comparePeopleByLastName);
}

export function getProjects() {
  return readCollection<Project>("projects").sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

export function getPublications() {
  return readCollection<Publication>("publications").sort((a, b) => {
    if ((b.year ?? 0) !== (a.year ?? 0)) return (b.year ?? 0) - (a.year ?? 0);
    return a.title.localeCompare(b.title);
  });
}

export function groupPublicationsByYear(publications: Publication[]) {
  return publications.reduce<Record<number, Publication[]>>((groups, publication) => {
    const year = publication.year;
    groups[year] = groups[year] ?? [];
    groups[year].push(publication);
    return groups;
  }, {});
}
