# RAGS Lab Website

Static-export Next.js site for the Resilient AI and Grounded Sensing Lab.

## Development

Use Node.js 26 (see `.nvmrc`) and pnpm 10.17.1, pinned in `package.json`.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Local development runs at `http://localhost:3000`.

## Verification

```bash
pnpm lint
pnpm typecheck
pnpm build
```

Lint runs separately from the Next.js build; CI runs all three checks.

`pnpm build` exports the static site to `out/`.

## GitHub Pages

Production builds default to the `/ragslab-website` base path for a GitHub
Pages project site. Override it with:

```bash
NEXT_PUBLIC_BASE_PATH=/your-base-path pnpm build
```

For a custom domain at the root, use:

```bash
NEXT_PUBLIC_BASE_PATH= pnpm build
```
