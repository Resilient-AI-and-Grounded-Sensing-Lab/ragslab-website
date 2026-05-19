export const siteConfig = {
  name: "RAGS Lab",
  title: "RAGS Lab",
  description:
    "Resilient AI and Grounded Sensing Lab builds AI and sensing systems for chaotic environments.",
  url: "https://ragslab.ai",
  ogImage: "/og-image.png",
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
      label: "Twitter",
      href: "https://x.com/Ritwik_G",
      icon: "x-twitter"
    }
  ],
} as const;

export type SocialIconName = "github" | "linkedin" | "x-twitter";
