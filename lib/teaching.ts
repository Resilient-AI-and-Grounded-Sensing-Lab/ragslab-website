import fs from "node:fs";
import path from "node:path";
import { readYamlFile } from "@/lib/yaml";

export type CourseSlide = {
  title: string;
  href: string;
};

export type CourseSession = {
  week: string;
  topic: string;
  work: string;
  slides?: CourseSlide;
};

export type Course = {
  slug: string;
  code: string;
  term: string;
  title: string;
  summary: string;
  format: string;
  meetingTime: string;
  location: string;
  instructor: string;
  officeHours: string;
  ta?: {
    name: string;
    officeHours: string;
  };
  descriptionHeading: string;
  description: string[];
  syllabusHeading: string;
  syllabusNote: string;
  syllabus: CourseSession[];
};

const coursesRoot = path.join(process.cwd(), "content", "courses");

function readCourseFile(file: string) {
  return readYamlFile<Course>(path.join(coursesRoot, file), {} as Course);
}

export function getCourses() {
  if (!fs.existsSync(coursesRoot)) return [];

  return fs
    .readdirSync(coursesRoot)
    .filter((file) => file.endsWith(".yaml") || file.endsWith(".yml"))
    .map(readCourseFile)
    .sort((a, b) => b.term.localeCompare(a.term) || a.title.localeCompare(b.title));
}

export function getCourse(slug: string) {
  return getCourses().find((course) => course.slug === slug);
}
