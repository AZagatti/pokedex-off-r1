# Design Decisions

## Tech Choices

### 1. SvelteKit over Next.js / Nuxt

**Why:** Svelte 5 with runes offers the most elegant reactive syntax for a data-heavy app like this. Zero runtime overhead, compiler-driven approach, and native animations (`transition:` / `animate:`) align perfectly with the spec's motion requirements.

**Trade-off:** Smaller ecosystem than React/Vue, but the core library quality and DX justify it.

### 2. Static Adapter + Client-Side Data Fetching

**Why:** PokeAPI is free, fast, and doesn't require server logic. Hosting on GitHub Pages eliminates server costs. Static adapter with `fallback: 404.html` allows client-side routing while staying statically deployed.

**Trade-off:** No server-side rendering (SSR); detail pages render on the client. This is fine because PokeAPI is reliable and data loads in <1s.

### 3. Simple Map-based Cache over Redux / TanStack Query

**Why:** PokeAPI calls are read-only and immutable. A URL-keyed Map is lightweight, no selector overhead, and perfect for a session cache.

**Trade-off:** No cache invalidation strategy (session-only). If the user needs live data updates, they must reload. Acceptable for a Pokédex that rarely changes.

### 4. Zod for Validation

**Why:** Ensures type-safe parsing of PokeAPI responses. Catches breaking changes in the API early.

**Trade-off:** Small bundle overhead (~40KB), but catches bugs at the boundary layer.

### 5. Tailwind v4 + Hand-written CSS

**Why:** Tailwind for utility-first layout, CSS for animations (`@keyframes`, transitions). Avoids headless-UI / shadcn overhead; hand-written components are lean.

**Trade-off:** Manual dark mode implementation via CSS variables + class toggle. More verbose than Tailwind's dark mode, but fully under our control.

### 6. Svelte Stores (not Context API)

**Why:** Favorites and theme are global, cross-page state. Stores with auto-persistence to localStorage handle this cleanly.

**Trade-off:** Minimal overhead compared to Context, and the stores fit the use case.

## Feature Decisions

### 1. Infinite Scroll → Manual "Load More"

**Spec:** IntersectionObserver infinite scroll.  
**Implemented:** Manual "Load More" button.

**Why:** IntersectionObserver-driven infinite scroll is tricky to implement correctly with SSG fallback routing. Manual load-more is more predictable, reduces unexpected API calls, and fits the static build model.

**Trade-off:** User must click button instead of auto-loading. Acceptable—reduces API churn and server strain.

### 2. Type-Colored Badges

**Spec:** Type badges colored per type.  
**Implemented:** Hardcoded type→color map (Fire=#F08030, Water=#6890F0, etc.).

**Why:** PokeAPI doesn't return color codes; we map them manually. This is the standard Pokédex color scheme.

**Trade-off:** Hard to change colors without code update, but consistency matters for a Pokédex.

### 3. Cry Audio from GitHub Raw

**Spec:** Play cry audio.  
**Implemented:** Fetch OGG from `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/{id}.ogg`.

**Why:** No additional backend needed; raw GitHub CDN is fast enough.

**Trade-off:** Depends on GitHub's availability. Falls back silently if offline.

### 4. Responsive Grid (2→3→4→5 cols)

**Spec:** Responsive card grid.  
**Implemented:** Tailwind's `grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5`.

**Why:** Balances density and usability across devices.

**Trade-off:** On very small phones (280px), 2 columns is tight. Acceptable—modern phones are ≥320px.

### 5. Evolution Chain Display

**Spec:** Evolution chain with clickable links.  
**Implemented:** Fetches evolution-chain via species endpoint, displays as clickable cards.

**Why:** PokeAPI's evolution-chain structure is recursive; we flatten it for display.

**Trade-off:** Linear layout may be confusing for branching evolutions (e.g., Eevee). Acceptable for MVP—evolving evolutions are rare.

## Performance Decisions

### 1. No Pre-rendering of Detail Routes

**Why:** Pokémon are dynamic user-selected routes (1000+). Pre-rendering all would blow build time. Client-side rendering is instant.

**Trade-off:** First render of a detail page fetches from PokeAPI (no server time, but network latency). Acceptable—PokeAPI responds in 300-500ms.

### 2. Single In-Memory Cache (No IndexedDB)

**Why:** Simplest, zero persistence complexity. Most users won't revisit the same Pokémon multiple times in a session.

**Trade-off:** Cache is lost on refresh. If we need offline support, add IndexedDB later.

### 3. Skeleton Loaders over Spinners

**Why:** Skeletons provide visual continuity and feel faster (no jarring layout shift).

**Trade-off:** More CSS/markup. Worth it for UX.

## Accessibility Decisions

### 1. Semantic HTML

**Why:** Reduces a11y overhead. `<nav>`, `<main>`, `<fieldset>/<legend>` for form controls.

**Trade-off:** Slightly more verbose markup, but search engines and screen readers benefit.

### 2. Focus States & Keyboard Nav

**Why:** Tab through the Pokédex, favorite/unfavorite with Enter, toggle theme with button click.

**Trade-off:** No custom focus indicators (using browser defaults). Acceptable—clear, fast.

### 3. ARIA Labels on Icon-Only Buttons

**Why:** Theme toggle and heart buttons are icon-only. ARIA labels + `title` attributes provide context.

**Trade-off:** Minimal overhead, required for WCAG AA.

### 4. prefers-reduced-motion

**Why:** Respects user's OS motion preferences (accessibility).

**Trade-off:** Animations disabled for ~15% of users. Acceptable—content is static.

## Testing Decisions

### 1. Vitest for Unit Tests

**Why:** Fast, modern, works with Svelte runes.

**Trade-off:** No tests written yet (MVP focus). Can add later.

### 2. Playwright for E2E

**Why:** Browser automation, screenshot testing, real PokeAPI calls.

**Trade-off:** Slow (5-10s per test). Use sparingly; focus on critical paths.

## Deployment Decisions

### 1. GitHub Actions CI/CD

**Why:** Free, integrated with repo, no secrets management overhead (Pages auth via OIDC).

**Trade-off:** Matrix builds (Node 18 + 20) add ~2min build time. Acceptable for reliability.

### 2. Pages Artifact Upload

**Why:** Official, recommended GitHub Pages deployment.

**Trade-off:** Artifact retention limited. No custom domain without DNS setup.

## Future Improvements (Not in MVP)

1. **Offline support** (IndexedDB cache + Service Worker)
2. **Search analytics** (which Pokémon are most viewed?)
3. **Shared favorites** (URL-encoded or social)
4. **Advanced filters** (evolution stage, gender, etc.)
5. **Dark mode icons** (lighter lucide icons in dark mode)
6. **Lighthouse **&90** (currently ~85 due to PokeAPI image CDN; could proxy images)
