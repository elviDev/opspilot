# OpsPilot — Frontend

Next.js 16 (App Router, Cache Components) · React 19 · TypeScript · Tailwind CSS v4 · TanStack Query · Zustand · Zod

## Getting started

```bash
cp .env.local.example .env.local
npm install
npm run dev
```

| Script              | Purpose                                  |
| ------------------- | ---------------------------------------- |
| `npm run dev`       | Dev server (Turbopack)                   |
| `npm run build`     | Production build                         |
| `npm run lint`      | ESLint (flat config, `next/core-web-vitals`) |
| `npm run typecheck` | Generate route types, then `tsc --noEmit` |

### Environment

| Variable               | Scope  | Notes |
| ---------------------- | ------ | ----- |
| `API_URL`              | server | FastAPI base URL. Only the Next.js server calls it. Falls back to `NEXT_PUBLIC_API_URL`. |
| `NEXT_PUBLIC_SITE_URL` | public | Canonical origin for metadata, sitemap, robots, llms.txt, JSON-LD. **Inlined at build time.** Falls back to Vercel's production URL. |
| `AUTH_SECRET`          | server | ≥ 32 chars. Set together with `DASHBOARD_PASSWORD` to require sign-in. |
| `DASHBOARD_PASSWORD`   | server | ≥ 8 chars. Leave both empty for public (demo) mode. |

All variables are validated with Zod at startup (`src/lib/env`).

## Architecture

```
src/
├── app/                  # Routing only: pages, route handlers, metadata files
│   ├── api/              # BFF endpoints (dashboard, chat)
│   ├── login/
│   ├── llms.txt/         # llms.txt route
│   └── robots.ts, sitemap.ts, manifest.ts, opengraph-image.tsx
├── components/
│   ├── ui/               # Design-system primitives (Button, Card, Badge, …)
│   ├── layout/           # App chrome (header, footer, container)
│   └── seo/              # <JsonLd />
├── features/             # Vertical slices — each owns schemas, UI, hooks, server code
│   ├── auth/             # Session tokens, DAL, login/logout actions
│   ├── dashboard/        # Aggregated snapshot, server prefetch, live sections
│   ├── services/         # Service types, health rules, cards
│   ├── incidents/        # Incident types, list/cards
│   └── chat/             # AI assistant: stores, mutation, components
├── lib/                  # Framework-agnostic infrastructure (env, http, query, seo, utils)
├── config/site.ts        # Single source of truth for brand/SEO copy
└── proxy.ts              # Optimistic auth gate + sliding session refresh
```

Conventions:

- **Zod schemas are the source of truth for types.** Every network response is parsed (`lib/http/fetch-json.ts`); types are `z.infer`-ed.
- **`server/` folders import `server-only`**, so server code can't leak into client bundles.
- **Features depend on `lib`/`components`, never the other way around.** `app/` composes features.

### Data flow & caching

```
Browser ──poll 30s──▶ /api/dashboard ──▶ getDashboard() ["use cache", 15s] ──▶ FastAPI
   ▲                                          ▲
   └── TanStack Query cache ◀── HydrationBoundary ◀── server prefetch (first paint)
```

1. **Static shell (PPR).** Headings, layout and the chat panel are prerendered; live sections stream in behind `<Suspense>`.
2. **Server data cache.** `getDashboard()` fetches services, incidents and uptimes in parallel and caches the aggregate for 15 s (`cacheLife("monitoring")` in `next.config.ts`), so concurrent viewers share one set of backend calls. Failures are never cached.
3. **Client cache.** The server prefetch is dehydrated into TanStack Query, so the first paint has data. After that the client polls every 30 s (paused in background tabs), refetches on focus, and keeps the last good data if the backend blips.
4. **CDN.** In public mode `/api/dashboard` sends `s-maxage=15, stale-while-revalidate=30`.

### Sessions

- Signed HS256 JWT (`jose`) in an `httpOnly`, `SameSite=Lax`, `Secure` (prod) cookie; 7-day lifetime with sliding refresh.
- `proxy.ts` does the optimistic redirect. The **DAL** (`features/auth/server/dal.ts`) re-verifies inside every page section and route handler that touches data.
- Login is a progressively enhanced Server Action (works without JS). Password compare is constant-time, and the `next` redirect is restricted to same-origin paths.

Client-side session state lives in Zustand: the conversation in `sessionStorage` (per tab session) and the language preference in `localStorage`. Both are schema-validated on rehydrate.

### SEO

Metadata API (title template, canonical, Open Graph, Twitter), JSON-LD `@graph` (`WebSite`, `SoftwareApplication`, `Person`, `WebPage`), `robots.txt`, `sitemap.xml`, `manifest.webmanifest`, a generated OG image, and [`/llms.txt`](https://llmstxt.org).
