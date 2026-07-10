# Architecture

## Overview

Pokédex is a modern, single-page application (SPA) built with SvelteKit that consumes the public PokeAPI. The application is statically built and deployed to GitHub Pages.

## Tech Stack

- **Framework:** SvelteKit 2.63 with Svelte 5 (runes)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 + hand-written CSS
- **Icons:** @lucide/svelte
- **Validation:** Zod schemas for all API responses
- **State Management:** Svelte 5 runes + stores (favorites, theme)
- **Testing:** Vitest (unit) + Playwright (e2e)
- **Linting:** oxlint + oxfmt via ultracite
- **Git Hooks:** lefthook
- **Deployment:** GitHub Pages with SvelteKit static adapter

## Project Structure

```
src/
├── lib/
│   ├── api/
│   │   ├── cache.ts          # In-memory URL-based cache
│   │   ├── schemas.ts        # Zod schemas for PokeAPI shapes
│   │   └── fetcher.ts        # API fetch functions with caching
│   ├── stores.ts             # Svelte stores (theme, favorites)
│   └── assets/               # Favicons, images
├── routes/
│   ├── +layout.svelte        # Root layout with nav, theme toggle
│   ├── +error.svelte         # 404 error page
│   ├── +page.svelte          # Pokédex list (/)
│   ├── PokemonCard.svelte    # Reusable card component
│   ├── pokemon/
│   │   └── [name]/
│   │       └── +page.svelte  # Pokemon detail page
│   ├── berries/
│   │   ├── +page.svelte      # Berries list
│   │   └── [name]/
│   │       └── +page.svelte  # Berry detail
│   └── favorites/
│       └── +page.svelte      # Favorites grid
└── app.html                  # HTML template

build/                         # Static output (adapter-static)
docs/
├── screenshots/              # Feature screenshots
├── ARCHITECTURE.md           # This file
└── DECISIONS.md              # Design decisions
```

## Data Flow

### API Layer

1. **Fetcher** (`src/lib/api/fetcher.ts`): Entry point for all API calls
2. **Cache** (`src/lib/api/cache.ts`): Simple Map-based cache keyed by URL
3. **Schemas** (`src/lib/api/schemas.ts`): Zod validation for all responses

```
Component → Fetcher → Cache (hit?) → API (miss)
                         ↓
                    Validate with Schema
                         ↓
                    Cache & Return
```

### State Management

**Stores** (`src/lib/stores.ts`):
- `theme`: light/dark persisted to localStorage
- `favorites`: array of Pokémon IDs persisted to localStorage

**Reactive Runes**: Svelte 5 runes manage component-level state (filters, search, pagination).

## Key Features

### 1. Pokédex List (`/`)

- **Infinite scroll** with 30 Pokémon per page (IntersectionObserver in the design, manual "Load More" implemented)
- **Search**: Debounced 250ms by name or ID
- **Filters**: 
  - **Type**: Multi-select from 18 types, client-side filtered
  - **Sort**: Dex number (default) or base-stat total
- **Cards**: Sprite, name, dex number, type badges (colored)
- **Favorites**: Heart button on each card

### 2. Pokémon Detail (`/pokemon/[name]`)

- **Artwork**: Official sprite (front/back, normal/shiny)
- **Cry**: Audio player (fetches OGG from raw GitHub)
- **Stats**: Animated bars (base stat → max 255)
- **Abilities**: Listed with hidden-ability tag
- **Evolution Chain**: Clickable links to evolutions
- **Type-colored badges** and gradient backgrounds

### 3. Berries (`/berries` + `/berries/[name]`)

- **List**: Paginated berry cards
- **Detail**: Firmness, size (mm), growth time (hours), flavor potency bars

### 4. Favorites (`/favorites`)

- **Persistence**: localStorage + Svelte store
- **Dynamic list**: Updates on add/remove
- **Grid display**: Same card layout as Pokédex

### 5. Global Features

- **Theme toggle**: Light/dark, persisted, affects all pages
- **Responsive nav**: Mobile-friendly layout
- **404 page**: Custom error fallback
- **Motion**: Respects `prefers-reduced-motion` CSS media query

## Performance & Caching

- **In-memory cache**: All API responses cached by URL for the session
- **Static build**: Pre-rendered shell, client-side data fetching
- **No loading states**: Skeleton loaders for paginated content
- **Minimal JS**: ~200KB gzipped (SvelteKit + dependencies)

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile-responsive (320px+)
- Keyboard navigation (focus states, semantic HTML)
- ARIA labels on interactive elements

## Deployment

**GitHub Pages** with static adapter:
- Build step: `npm run build` → `build/` directory
- Fallback: `404.html` for SPA routing
- Base path: `/pokedex-off-r1` (configured in vite.config.ts)
