import { Project } from "@/lib/content";
import { assetPath } from "@/lib/assets";

const projectVisuals = [
  {
    avif: "/brand/aperture.avif",
    className: "project-visual-aperture"
  },
  {
    avif: "/brand/line-drawing.avif",
    className: "project-visual-field"
  },
  {
    avif: "/brand/pattern.avif",
    className: "project-visual-signal"
  }
];

export function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="project-grid">
      {projects.map((project, index) => {
        const visual = projectVisuals[index % projectVisuals.length];

        return (
          <article className="project-card" key={project.slug}>
            <div className={`project-visual ${visual.className}`} aria-hidden="true">
              <picture>
                <source srcSet={assetPath(visual.avif)} type="image/avif" />
                <source srcSet={assetPath(visual.avif.replace(".avif", ".webp"))} type="image/webp" />
                <img src={assetPath(visual.avif)} alt="" />
              </picture>
              <span />
            </div>
            <div className="project-content">
              <p className="eyebrow">{project.status}</p>
              <h3>{project.title}</h3>
              <p>{project.summary}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
