# Sneha Islam — Portfolio

Personal portfolio: Nanotechnology Engineering (Nano-Electronics) at the University of Waterloo, with work in software, applied AI, embedded systems and device fabrication.

Built with [Astro](https://astro.build) + React + TypeScript as a fully static site. Until the cutover, `/` serves the frozen original page (`legacy/index.html`, never edited) and the new game page grows at the hidden `/next`.

## Development

Requires Node 26.x and npm 11. The scripts in `tools/` need Python ≥3.12 (standard library only).

```sh
npm ci            # install exact locked dependencies
npm run dev       # local dev server
npm run build     # static build into dist/
npm run preview   # serve dist/ locally
npm run check     # astro check (types + diagnostics)
python tools/compare_legacy_text.py legacy/index.html dist/index.html   # built / must match the legacy text
```

Files served as-is (the résumé PDF, character art) live in `public/`.

## Deploy

Vercel builds from `main` using `vercel.json` (Astro framework, `npm run build`, output `dist/`). If a Preview doesn't build, set Project → Settings → Build & Deployment → Framework Preset = **Astro** (one-time).

- GitHub: [github.com/snehaislamm](https://github.com/snehaislamm)
- LinkedIn: [linkedin.com/in/SnehaIslam](https://www.linkedin.com/in/SnehaIslam)
