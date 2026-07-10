# Build Journal: Pokédex

Tracking progress, rework, confusion, anomalies, and surprises during autonomous build.

- **2026-07-10 00:00** Session start: git init, scaffolding SvelteKit with TypeScript, Tailwind v4, vitest, playwright, adapter-static
- **2026-07-10 01:00** Created lib/api/cache.ts, lib/api/schemas.ts (full PokeAPI shapes with zod), lib/api/fetcher.ts
- **2026-07-10 02:00** Stores setup (theme + favorites with localStorage), layout component with nav/theme toggle
- **2026-07-10 03:00** Main Pokédex page with search (debounced 250ms), type filters, sort, load more. PokemonCard component with favorites heart
- **2026-07-10 04:00** Pokémon detail page: sprites, stat bars, abilities, evolution chain, cry audio player
- **2026-07-10 05:00** Berries list and detail pages; favorites page; 404 error page. Fixed import order in fetcher.
- **2026-07-10 06:00** Fixed CSS syntax in +layout.svelte, a11y labels. Updated vite.config.ts with adapter config and paths.base. Build succeeds.
- **2026-07-10 07:00** Dev server running on port 5174. Tested: home page (light/dark), berries list, pokemon detail page, favorites. All pages loading correctly. Screenshots captured to docs/screenshots/.
- **2026-07-10 08:00** Set up lefthook with pre-commit (lint, format, typecheck) and pre-push (unit tests). Configured GitHub Actions CI/CD with Node 18 & 20 matrix. Created ARCHITECTURE.md and DECISIONS.md. Portfolio-quality README with badges and screenshots. Initial commit pushed to GitHub. GitHub Pages deployment should trigger automatically.
- **2026-07-10 09:00** Fixed linting issues (empty file, unused vars, unused expressions). All builds pass locally. GitHub Actions should now deploy successfully. Live URL: https://azagatti.github.io/pokedex-off-r1/ Build status pending.
