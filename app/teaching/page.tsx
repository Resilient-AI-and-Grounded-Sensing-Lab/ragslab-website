import Link from "next/link";
import { CompactIntroHeading } from "@/components/CompactIntroHeading";
import { getCourses } from "@/lib/teaching";
import { siteConfig } from "@/lib/site";

export const metadata = {
  title: "Teaching",
  description:
    "Courses taught by RAGS Lab on resilient AI, grounded sensing, policy, and real-world deployment.",
  alternates: {
    canonical: "/teaching"
  },
  openGraph: {
    title: "Teaching | RAGS Lab",
    description:
      "Courses taught by RAGS Lab on resilient AI, grounded sensing, policy, and real-world deployment.",
    url: "/teaching",
    images: [siteConfig.ogImage]
  },
  twitter: {
    title: "Teaching | RAGS Lab",
    description:
      "Courses taught by RAGS Lab on resilient AI, grounded sensing, policy, and real-world deployment.",
    images: [siteConfig.ogImage]
  }
};

export default function TeachingPage() {
  const courses = getCourses();

  return (
    <div className="page-shell">
      <section className="compact-page-intro">
        <CompactIntroHeading title="Teaching" />
      </section>

      <section className="section teaching-list" aria-label="Courses">
        {courses.map((course) => (
          <article className="course-card" key={course.slug}>
            <div className="course-card-meta">
              <span>{course.term}</span>
              <span>{course.code}</span>
            </div>
            <div className="course-card-body">
              <h2>
                <Link className="course-title-link" href={`/${course.slug}`}>
                  {course.title}
                </Link>
              </h2>
              <p>{course.summary}</p>
              <div className="tag-list">
                <span className="tag">{course.format}</span>
                <span className="tag">{course.meetingTime}</span>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
