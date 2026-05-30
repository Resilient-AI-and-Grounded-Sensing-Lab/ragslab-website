import { notFound } from "next/navigation";
import { CompactIntroHeading } from "@/components/CompactIntroHeading";
import { getCourse, getCourses } from "@/lib/teaching";
import { siteConfig } from "@/lib/site";

type CoursePageProps = {
  params: Promise<{
    courseSlug: string;
  }>;
};

export function generateStaticParams() {
  return getCourses().map((course) => ({
    courseSlug: course.slug
  }));
}

export async function generateMetadata({ params }: CoursePageProps) {
  const { courseSlug } = await params;
  const course = getCourse(courseSlug);

  if (!course) {
    return {
      title: "Course"
    };
  }

  return {
    title: course.title,
    description: course.summary,
    alternates: {
      canonical: `/${course.slug}`
    },
    openGraph: {
      title: `${course.title} | RAGS Lab`,
      description: course.summary,
      url: `/${course.slug}`,
      images: [siteConfig.ogImage]
    },
    twitter: {
      title: `${course.title} | RAGS Lab`,
      description: course.summary,
      images: [siteConfig.ogImage]
    }
  };
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { courseSlug } = await params;
  const course = getCourse(courseSlug);

  if (!course) notFound();

  return (
    <div className="page-shell">
      <section className="compact-page-intro course-hero">
        <div>
          <CompactIntroHeading title={course.title} meta={`${course.code} / ${course.term}`} />
        </div>
        <aside className="course-facts" aria-label="Course information">
          <dl>
            <div>
              <dt>Format</dt>
              <dd>{course.format}</dd>
            </div>
            <div>
              <dt>Meetings</dt>
              <dd>{course.meetingTime}</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>{course.location}</dd>
            </div>
            <div>
              <dt>Instructor</dt>
              <dd>{course.instructor}</dd>
            </div>
            <div>
              <dt>Office hours</dt>
              <dd>{course.officeHours}</dd>
            </div>
            {course.ta ? (
              <div>
                <dt>TA</dt>
                <dd>
                  {course.ta.name}
                  <br />
                  {course.ta.officeHours}
                </dd>
              </div>
            ) : null}
          </dl>
        </aside>
      </section>

      <section className="split-section course-section">
        <div>
          <p className="eyebrow">Course description</p>
          <h2>{course.descriptionHeading}</h2>
        </div>
        <div className="course-copy">
          {course.description.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Syllabus</p>
            <h2>{course.syllabusHeading}</h2>
          </div>
          <p className="body-copy">{course.syllabusNote}</p>
        </div>
        <div className="syllabus-list">
          {course.syllabus.map((session) => (
            <article className="syllabus-item" key={session.week}>
              <span className="publication-year">{session.week}</span>
              <div>
                <h3>{session.topic}</h3>
                <p>{session.work}</p>
                {session.slides ? (
                  <a className="text-link" href={session.slides.href} aria-label={`Slides for ${session.topic}`}>
                    {session.slides.title}
                  </a>
                ) : (
                  <span className="empty-note">Slides posted after class.</span>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
