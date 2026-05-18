import type { AgendaItem } from "@/components/ResearchAgenda";

export const researchAgenda: AgendaItem[] = [
  {
    number: "01",
    title: "Resilient AI",
    summary:
      "Architectures and learning methods that adapt under pressure, reason with missing evidence, and keep working when conditions shift.",
    visual: "Models that remain useful when the world refuses to be clean."
  },
  {
    number: "02",
    title: "Grounded sensing",
    summary:
      "AI grounded in the physics and limits of sensors, including radar, low-quality audio, imagery, and other difficult signals.",
    visual: "Perception shaped by the instruments that make evidence visible."
  },
  {
    number: "03",
    title: "Crisis response",
    summary:
      "Systems for unforgiving settings where information is incomplete, time is scarce, and people need reliable support.",
    visual: "Technology built for moments when every second changes the problem."
  },
  {
    number: "04",
    title: "End-user alignment",
    summary:
      "Research shaped by responders, operators, and policy constraints so prototypes fit real workflows and real risk.",
    visual: "Research loops that begin and end with the people relying on the system."
  }
];
