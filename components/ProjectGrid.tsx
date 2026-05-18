import { Project } from "@/lib/content";
import { assetPath } from "@/lib/assets";

const projectVisuals = [
  {
    image: "/brand/aperture.png",
    className: "project-visual-aperture"
  },
  {
    image: "/brand/line-drawing.png",
    className: "project-visual-field"
  },
  {
    image: "/brand/pattern.png",
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
              <img src={assetPath(visual.image)} alt="" />
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
