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
