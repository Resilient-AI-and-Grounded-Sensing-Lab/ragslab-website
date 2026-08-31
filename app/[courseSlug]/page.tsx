import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { getCourse, getCourses } from "@/lib/teaching";
import { siteConfig } from "@/lib/site";

type CoursePageProps = {
  params: Promise<{
    courseSlug: string;
  }>;
};

function CourseLongform({ text }: { text: string }) {
  const content: ReactNode[] = [];
  let paragraphLines: string[] = [];
  let numberedItems: Array<{ number: number; text: string }> = [];

  const flushParagraph = () => {
    if (!paragraphLines.length) return;

    content.push(<p key={`paragraph-${content.length}`}>{paragraphLines.join(" ")}</p>);
    paragraphLines = [];
  };

  const flushNumberedItems = () => {
    if (!numberedItems.length) return;

    const items = numberedItems;
    content.push(
      <ol key={`list-${content.length}`} start={items[0].number}>
        {items.map((item) => (
          <li key={`${item.number}-${item.text}`} value={item.number}>
            {item.text}
          </li>
        ))}
      </ol>
    );
    numberedItems = [];
  };

  text.trim().split("\n").forEach((rawLine) => {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      return;
    }

    const numberedLine = line.match(/^(\d+)\.\s+(.+)$/);

    if (numberedLine) {
      flushParagraph();
      numberedItems.push({
        number: Number(numberedLine[1]),
        text: numberedLine[2]
      });
      return;
    }

    flushNumberedItems();
    paragraphLines.push(line);
  });

  flushParagraph();
  flushNumberedItems();
  return content;
}

const readingTypeOrder = ["technical", "policy", "bridge", "standard"];

function ReadingTypePill({ type }: { type: string }) {
  const normalizedType = type.trim().toLowerCase();

  return (
    <abbr className="reading-type" data-reading-type={normalizedType} title={type}>
      {type.trim().charAt(0).toUpperCase()}
    </abbr>
  );
}

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

  const readingTypes = Array.from(
    new Set(course.syllabus.flatMap((session) => session.readings?.map((reading) => reading.type) ?? []))
  ).sort((a, b) => {
    const aIndex = readingTypeOrder.indexOf(a.toLowerCase());
    const bIndex = readingTypeOrder.indexOf(b.toLowerCase());
    return (aIndex === -1 ? readingTypeOrder.length : aIndex) -
      (bIndex === -1 ? readingTypeOrder.length : bIndex) || a.localeCompare(b);
  });

  return (
    <div className="page-shell">
      <section className="compact-page-intro course-hero">
        <div>
          <span className="course-hero-label">{course.code} / {course.term}</span>
          <h1 className="intro-title">{course.title}</h1>
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
          <h2>{course.descriptionHeading}</h2>
        </div>
        <div className="course-copy">
          {course.description.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      {course.assignments?.length ? (
        <section className="section course-assignments">
          <div className="section-header">
            <div>
              <h2>{course.assignmentsHeading ?? "Assignments"}</h2>
            </div>
            {course.assignmentsNote ? <p className="body-copy">{course.assignmentsNote}</p> : null}
          </div>
          <div className="assignment-list">
            {course.assignments.map((assignment) => (
              <article className="assignment-item" key={assignment.title}>
                <div className="assignment-heading">
                  <h3>{assignment.title}</h3>
                  <dl className="assignment-meta">
                    <div>
                      <dt>Due</dt>
                      <dd>{assignment.due}</dd>
                    </div>
                    <div>
                      <dt>Weight</dt>
                      <dd>{assignment.weight}%</dd>
                    </div>
                  </dl>
                </div>
                <div className="assignment-description">
                  <CourseLongform text={assignment.description} />
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="section">
        <div className="section-header">
          <div>
            <h2>Syllabus</h2>
          </div>
          <p className="body-copy">{course.syllabusNote}</p>
        </div>
        {readingTypes.length ? (
          <aside className="reading-legend" aria-label="Reading type legend">
            <span className="reading-legend-title">Reading types</span>
            <ul>
              {readingTypes.map((type) => (
                <li key={type}>
                  <ReadingTypePill type={type} />
                  <span>{type}</span>
                </li>
              ))}
            </ul>
          </aside>
        ) : null}
        <div className="syllabus-list">
          {course.syllabus.map((session) => (
            <article className="syllabus-item" key={`${session.dates ?? session.week}-${session.topic}`}>
              <span className="publication-year">{session.dates ?? session.week}</span>
              <div>
                {session.unit ? <p className="syllabus-unit">{session.unit}</p> : null}
                <h3>{session.topic}</h3>
                {session.work ? <p>{session.work}</p> : null}
                {session.readings?.length ? (
                  <div className="session-block">
                    <h4>Readings</h4>
                    <ul className="reading-list">
                      {session.readings.map((reading) => (
                        <li key={`${reading.authors}-${reading.title}`}>
                          <ReadingTypePill type={reading.type} />
                          <div>
                            <span className="reading-authors">{reading.authors}</span>
                            {reading.href ? (
                              <a className="reading-title" href={reading.href}>
                                {reading.title}
                              </a>
                            ) : (
                              <span className="reading-title">{reading.title}</span>
                            )}
                            <span className="reading-publication">{reading.publication}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {session.assignment ? (
                  <p className="session-assignment">
                    <span className="session-resource-label">Assignment</span>
                    <span>{session.assignment}</span>
                  </p>
                ) : null}
                <div className="session-slides">
                  <span className="session-resource-label">Slides</span>
                  {session.slides?.href ? (
                    <a
                      className="text-link"
                      href={session.slides.href}
                      aria-label={`Slides for ${session.topic}`}
                    >
                      {session.slides.title ?? "Slides"}
                    </a>
                  ) : (
                    <span className="empty-note">{session.slides?.title ?? "Posted after class"}</span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
