# Online Cinema Showcase

**English** | [Русский](README.ru.md)

The home page of an online cinema built with Nuxt 3, TypeScript, Pinia and Tailwind CSS: a responsive grid of cards whose genre and label references (`genre:6`, `label:4`) are resolved from CMS lookup tables. The content comes from a Russian CMS, so titles and descriptions are in Russian.

> 💼 **Take-home assignment** · Just Work, front-end developer role · January 2026. The brief asked for a "production-grade" start of a large cinema project that works for any lookup table and page, in SSR/SSG and SPA modes. The original solution is the first four commits (January 28–30); everything added later is listed in [Changed afterwards](#changed-afterwards).

**Live demo:** https://cinema-test-chi.vercel.app/

<p>
  <img src="./screenshots/desktop-1440.webp" alt="Showcase on desktop, 1440 px" width="68%">
  <img src="./screenshots/mobile-390.webp" alt="Showcase on mobile, 390 px" width="24%">
</p>

## Highlights

- **DTOs separate from the page model.** Components work with domain types (`Banner`, `Genre`, `Label`, `MainPage`); only the mapper knows the API format.
- **Normalized lookup tables.** Genres and labels are loaded once into Pinia as `oid → object` dictionaries, so resolving a reference is a key lookup rather than a search through an array.
- **Works in SSR, SSG and SPA** — all three modes from the brief were checked, including with the API unavailable.
- **The demo survives the API going down.** A snapshot of real responses is used as a fallback, a lesson learned from [vue2-project](https://github.com/BarbaraFromTonshaevo/vue2-project), where the course API was shut down.

## Features

- Server-side rendered home page: the browser receives ready HTML with data.
- Cards show a title, a synopsis clamped to three lines, an image, genres and labels.
- References to missing lookup entries are dropped instead of breaking the card.
- Responsive grid: 1 column on mobile, 2 on tablet, 3 on desktop.

## Tech stack

| Area | Tools |
| --- | --- |
| Framework | Nuxt 3, Vue 3 (`<script setup>`), TypeScript |
| State | Pinia (setup stores) |
| Styles | Tailwind CSS 3 (`@nuxtjs/tailwindcss`) |
| Images | `@nuxt/image` |
| Code quality | ESLint (`@nuxt/eslint`) |
| Hosting | Vercel (SSR) |

## Architecture

```
CMS API ──► services/api.ts ──► stores/genres.ts, stores/labels.ts   (oid → object)
   │         (falls back to                      │
   │          data/snapshot/)                    ▼
   └──────► pages/index.vue ──► services/mappers/main-page.mapper.ts ──► components/card/banner.vue
            useAsyncData          DTO → MainPage, references → objects     card in the grid
```

1. [app.vue](app.vue) loads the lookup tables on startup: `fetchGenres()` and `fetchLabels()`.
2. [stores/genres.ts](stores/genres.ts) and [stores/labels.ts](stores/labels.ts) keep them as dictionaries keyed by `oid` and expose `getGenre(oid)` / `getLabel(oid)`. Pinia state is transferred from server to client, so there are no repeat requests.
3. [pages/index.vue](pages/index.vue) requests the showcase with `useAsyncData`.
4. [services/mappers/main-page.mapper.ts](services/mappers/main-page.mapper.ts) turns each `BannerDTO` into a `Banner`: picks the image and replaces genre and label `oid`s with objects from the stores.
5. [components/card/banner.vue](components/card/banner.vue) renders a card and knows nothing about the API.

### API snapshot

- [data/snapshot/](data/snapshot/) holds real responses from `mainpage`, `genres` and `labels`; banner images are in [public/snapshot/](public/snapshot/).
- `fetchApi(path)` in [services/api.ts](services/api.ts) calls the API with a timeout and falls back to the snapshot on error. The snapshot is loaded with a dynamic import, so it stays out of the main bundle.
- `NUXT_PUBLIC_API_SNAPSHOT=true` forces the snapshot; `npm run snapshot:update` refreshes it.
- The API sends CORS headers only for its own domain, so in SPA mode on another domain the page is rendered from the snapshot. SSR is not affected.

### Key decisions

- **A separate mapping layer** (`services/mappers/`): data transformation is kept apart from requests and templates.
- **SSR with `useAsyncData`:** the page arrives with its data, and store state moves to the client through the payload.
- **Typed references:** `oid` values are template literal types (`` `genre:${string}` ``).

## Changed afterwards

- **Images were not displayed:** `<NuxtImage>` → `<NuxtImg>`, the `{w}x{h}` size is substituted into `resize_url`, and the mapper picks the asset of type `Banner`.
- API snapshot and fallback; API URL and timeout moved to `runtimeConfig`.
- `lint`, `lint:fix` and `snapshot:update` scripts, `.env.example`, this README and the screenshots.

## Getting started

Requires Node.js 20+.

```bash
npm install
npm run dev          # http://localhost:3000
```

Other scripts:

```bash
npm run build            # SSR build into .output/
npm run preview          # run the built app
npm run generate         # static site generation (SSG)
npm run lint             # ESLint
npm run snapshot:update  # refresh the API and image snapshot
```

All variables are optional; defaults are in [nuxt.config.ts](nuxt.config.ts), an example is in [.env.example](.env.example).

| Variable | Default | Purpose |
| --- | --- | --- |
| `NUXT_PUBLIC_API_BASE` | `https://cms.test.ksfr.tech/api/v1/` | API base URL |
| `NUXT_PUBLIC_API_SNAPSHOT` | `false` | `true` — always use the snapshot |
| `NUXT_PUBLIC_API_TIMEOUT` | `3000` | ms to wait for the API before falling back |

## Deployment

Deployed on Vercel in SSR mode; the Nitro preset is picked up automatically.

## What I'd improve

The brief asked for a solution that works for all lookup tables and any page; right now it covers the home page and its two lookup tables.

- **A universal reference resolver.** The API has eight lookup tables; one `metadata` store plus a recursive resolver would handle any page without mapper changes.
- **An API proxy via Nitro server routes** to fix CORS in SPA mode and cache lookup tables.
- **Error and loading states** from `useAsyncData`, `try/finally` in the stores and parallel loading with `Promise.all`.
- **Strict typing in the mapper** instead of `any`.
- **Card links, gradient labels, SEO meta and unit tests** for the mapper and stores.
- **Styles cleanup:** `assets/css/main.css` uses Tailwind 4 syntax with Tailwind 3 installed and is not included anywhere.
