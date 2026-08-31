import fs from "node:fs";
import path from "node:path";
import { readYamlFile } from "@/lib/yaml";

export type CourseSlide = {
  title: string | null;
  href: string | null;
};

export type CourseReading = {
  type: string;
  authors: string;
  title: string;
  publication: string;
  href: string | null;
};

export type CourseAssignment = {
  title: string;
  due: string;
  weight: number;
  description: string;
};

export type CourseSession = {
  week?: string;
  dates?: string;
  unit?: string;
  topic: string;
  work?: string;
  readings?: CourseReading[];
  assignment?: string | null;
  slides?: CourseSlide | null;
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
  assignmentsHeading?: string;
  assignmentsNote?: string;
  assignments?: CourseAssignment[];
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
