"use client";

import { ResearchItem } from "@/lib/content";

export function ResearchGrid({ items }: { items: ResearchItem[] }) {
  return (
    <div className="research-grid">
      {items.map((item, index) => (
        <article className="research-column" key={item.slug}>
          <span className="research-column-number">{String(index + 1).padStart(2, "0")}</span>
          <div className="research-column-copy">
            <h3>{item.title}</h3>
            <p>{item.summary}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
