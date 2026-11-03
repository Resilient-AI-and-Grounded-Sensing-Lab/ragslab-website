# RAGS Lab Website

Static-export Next.js site for the Resilient AI and Grounded Sensing Lab.

## Development

```bash
npm install
npm run dev
```

Local development runs at `http://localhost:3000`.

## Verification

```bash
npm run lint
npm run typecheck
npm run build
```

`npm run build` exports the static site to `out/`.

## GitHub Pages

Production builds default to the `/ragslab-website` base path for a GitHub
Pages project site. Override it with:

```bash
NEXT_PUBLIC_BASE_PATH=/your-base-path npm run build
```

For a custom domain at the root, use:

```bash
NEXT_PUBLIC_BASE_PATH= npm run build
```

## Design system

All pages use `app/globals.css`, imported once by the root layout. The stylesheet
contains brand colors, neutral surfaces, spacing, typography, buttons, the shared
header/footer, page layouts, and responsive rules. Host Grotesk Bold is used for
headings, Host Grotesk Light for section titles, and Lora for prose. Avoid eyebrows,
oversized display copy, decorative arrows, gradients outside the video scrim,
and enclosing cards where a divider is sufficient.

- Use `.wrap` or `.page-shell` for the shared content width and gutters.
  Above 1500px, that grid grows with the viewport up to 1760px; imagery scales
  with it while long prose retains a readable line length.
- Use `.button` on navigation links that should look like buttons. Add
  `.button-on-dark` on dark surfaces. These actions have no motion effect.
- `SignalLink` opts navigation into the denoising effect. `SignalField` shares
  its noise function from `lib/signal.ts`; the drawing cycles over 18 seconds.
- `LoopVideo` pauses when offscreen, in a hidden tab, or when reduced motion is
  requested. Video posters keep the still presentation useful.
- `PublicationCard` has a compact homepage form and a full archive form. Set
  `featured: true` on two publication YAML entries to choose the homepage papers.
- People, publications, teaching, collaboration, and every course page inherit
  the same type scale, border rules, spacing, and responsive breakpoints.

Keep presentation in the shared stylesheet and content in the existing YAML
collections. Animation code belongs in the opt-in React components rather than
in page-specific stylesheets.
