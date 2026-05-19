import fs from "node:fs";
import path from "node:path";
import { readYamlFile } from "@/lib/yaml";

const contentRoot = path.join(process.cwd(), "content");

type ContentRecord<T> = T & {
  slug: string;
};

function readCollection<T extends Record<string, unknown>>(collection: string): ContentRecord<T>[] {
  const collectionPath = path.join(contentRoot, collection);
  if (!fs.existsSync(collectionPath)) return [];

  return fs
    .readdirSync(collectionPath)
    .filter((file) => file.endsWith(".yaml") || file.endsWith(".yml"))
    .map((file) => {
      const slug = file.replace(/\.ya?ml$/, "");
      const data = readYamlFile<Partial<T>>(path.join(collectionPath, file), {});

      return {
        slug,
        ...data
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

export type ResearchItem = {
  slug: string;
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
      const records = readYamlFile<Record<string, unknown>[]>(path.join(collectionPath, file), []);
      if (!Array.isArray(records)) return [];

      return records.map((person, index) => {
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

export function getResearch() {
  return readCollection<ResearchItem>("research").sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
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
