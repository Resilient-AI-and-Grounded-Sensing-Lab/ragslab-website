export type AgendaItem = {
  number: string;
  title: string;
  summary: string;
  visual: string;
};

type ResearchAgendaProps = {
  items: AgendaItem[];
};

export function ResearchAgenda({ items }: ResearchAgendaProps) {
  return (
    <div className="interactive-agenda">
      <div className="agenda-list">
        {items.map((item) => (
          <article className="research-card" key={item.title}>
            <span className="research-number">{item.number}</span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
