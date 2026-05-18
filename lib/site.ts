export const siteConfig = {
  name: "RAGS Lab",
  title: "RAGS Lab",
  description:
    "Resilient AI and Grounded Sensing Lab builds AI and sensing systems for chaotic environments.",
  nav: [
    { href: "/", label: "Home" },
    { href: "/people", label: "People" },
    { href: "/publications", label: "Publications" },
    { href: "/collaborate", label: "Collaborate" }
  ],
  socials: [
    {
      label: "GitHub",
      href: "https://github.com/Resilient-AI-and-Grounded-Sensing-Lab/",
      icon: "github"
    },
    {
      label: "X/Twitter",
      href: "https://www.linkedin.com/company/rags-lab",
      icon: "x-twitter"
    }
  ],
  collaborationHref: "https://www.linkedin.com/company/rags-lab"
} as const;

export type SocialIconName = "github" | "linkedin" | "x-twitter";
