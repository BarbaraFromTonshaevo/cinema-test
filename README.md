# cinema-test — online cinema showcase on Nuxt 3

**English** | [Русский](README.ru.md)

The home page of an online cinema: a grid of cards with a title, description, image, genres and labels. Data comes from a CMS API, and references to lookup tables (`genre:6`, `label:4`) are replaced with the objects themselves. Nuxt 3, TypeScript, Pinia, Tailwind CSS, SSR.

**Live demo:** https://cinema-test-chi.vercel.app/

<p>
  <img src="./screenshots/desktop-1440.webp" alt="Showcase on desktop, 1440 px" width="68%">
  <img src="./screenshots/mobile-390.webp" alt="Showcase on mobile, 390 px" width="24%">
</p>

## Context

This is a take-home test task from **Just Work** for a front-end developer position. I received the brief on January 23, 2026, and the interview was scheduled for January 30. The original solution is the first four commits of this repository (January 28–30).

The brief ("Task 3"):

- create a Nuxt 3 + Pinia project and render the showcase data from `https://cms.test.ksfr.tech/api/v1/showcases/showcases/mainpage/web/`;
- replace references to other objects such as `"genre:6"` (not limited to genres) with the objects themselves, taken from the API lookup tables ([swagger](https://cms.test.ksfr.tech/api/swagger/));
- show the title, description, image, list of genres and list of labels;
- lay the items out as a grid of cards that adapts to mobile and desktop;
- the solution should be "production-grade", as if it were the start of a large cinema project: it should work for all lookup tables, for any page, and in SSR/SSG and SPA modes.

## Features

- Server-side rendered home page: data is loaded on the server with `useAsyncData`, so the browser receives ready HTML.
- Genres and labels are loaded once into Pinia stores and kept as an `oid → object` dictionary. The mapper replaces references in the slides with these objects and drops references that are missing from the lookup table.
- The API response and the page model are separated: dedicated DTO types and domain types (`Banner`, `Genre`, `Label`, `MainPage`), with `oid` values typed as template literal types (`` `genre:${string}` ``).
- Responsive card grid in Tailwind: 1 column on mobile, 2 on tablet, 3 on desktop. Long descriptions are clamped to three lines.

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
CMS API ──► services/api.ts ──► stores/genres.ts, stores/labels.ts   (lookup tables: oid → object)
   │         (falls back to                      │
   │          data/snapshot/)                    ▼
   └──────► pages/index.vue ──► services/mappers/main-page.mapper.ts ──► components/card/banner.vue
            useAsyncData          DTO → MainPage, references → objects     card in the grid
```

1. [app.vue](app.vue) loads the lookup tables on startup: `fetchGenres()` and `fetchLabels()`.
2. The stores [stores/genres.ts](stores/genres.ts) and [stores/labels.ts](stores/labels.ts) put them into a dictionary keyed by `oid` and expose `getGenre(oid)` / `getLabel(oid)`. The `loaded` / `loading` flags prevent loading a table twice, and the Pinia state is transferred from the server to the browser, so the client makes no repeat requests.
3. [pages/index.vue](pages/index.vue) requests the showcase with `useAsyncData` and passes the raw response to the mapper.
4. [services/mappers/main-page.mapper.ts](services/mappers/main-page.mapper.ts) turns each `BannerDTO` into a `Banner`: it takes the title and synopsis, picks the image and replaces genre and label `oid`s with objects from the stores.
5. [components/card/banner.vue](components/card/banner.vue) renders a card from the domain model and knows nothing about the API format.

All requests go through [services/api.ts](services/api.ts) (see the next section).

## Keeping the demo alive: API snapshot

The API belongs to the company's test environment: it can respond unreliably or disappear altogether. Something similar happened in my [vue2-project](https://github.com/BarbaraFromTonshaevo/vue2-project), where the course API was shut down and I reproduced its contract. This time I added a safety net in advance.

- [data/snapshot/](data/snapshot/) holds real responses from the three endpoints: `mainpage`, `genres`, `labels`. Banner images are downloaded to [public/snapshot/](public/snapshot/) (webp, about 0.5 MB), and `resize_url` in the snapshot points to them. All other fields match the API response.
- `fetchApi(path)` in [services/api.ts](services/api.ts) calls the API with a timeout. If the server does not respond or returns an error, the data comes from the snapshot and a warning is written to the server log. The snapshot is loaded with a dynamic import, so it does not end up in the main bundle.
- The `NUXT_PUBLIC_API_SNAPSHOT=true` flag forces the snapshot without calling the API.
- `npm run snapshot:update` captures the responses and images again while the server is up.

There is one more reason for the snapshot: the API sends a CORS header only for `https://test.ksfr.tech`, so browsers on any other domain (localhost, Vercel) block requests to it. This does not affect SSR, because the server makes the requests. In SPA mode on another domain, though, the page is rendered from the snapshot.

Checked in all three modes from the brief: SSR (`nuxt build`), SSG (`nuxt generate`) and SPA (`ssr: false`). In each case all 12 cards render with images, including when the API is unavailable.

## Key decisions

- **DTOs separate from the page model.** Components work with `Banner`, not with the API response. If the API format changes, only the mapper needs updating.
- **Lookup tables normalized in Pinia.** Each table is loaded once and stored as a dictionary keyed by `oid`, so resolving a reference is a key lookup rather than a search through an array.
- **A separate mapping layer** (`services/mappers/`). Data transformation is kept apart from requests and templates.
- **SSR with `useAsyncData`.** The page arrives with its data, and the store state moves to the client through the payload.

## Changed after the interview

I list everything I changed after January 30, so it is clear which parts are the original solution and which were added later.

- **Images were not displayed.** The card used a non-existent `<NuxtImage>` component instead of `<NuxtImg>`. On top of that, `resize_url` from the API is a template containing `{w}x{h}`, and without a size the image server returns an error. The mapper now picks the asset of type `Banner` (previously it took the first one, which could be a screenshot or a poster) and substitutes the size `800x450`. The field name in the type was fixed as well: `asset_type` instead of `assets_type`.
- **API snapshot and fallback** (see the section above); the API URL and timeout moved to `runtimeConfig`.
- The `lint`, `lint:fix` and `snapshot:update` scripts, `.env.example`, this README and the screenshots.

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

Environment variables are optional; defaults are set in [nuxt.config.ts](nuxt.config.ts), and an example is in [.env.example](.env.example):

| Variable | Default | Purpose |
| --- | --- | --- |
| `NUXT_PUBLIC_API_BASE` | `https://cms.test.ksfr.tech/api/v1/` | API base URL |
| `NUXT_PUBLIC_API_SNAPSHOT` | `false` | `true` — always use the snapshot |
| `NUXT_PUBLIC_API_TIMEOUT` | `3000` | how many milliseconds to wait for the API before falling back |

## Deployment

The app is deployed on Vercel in SSR mode (the Nitro preset for Vercel is picked up automatically). The build is the standard `nuxt build` with no extra configuration.

## What I would improve with more time

The brief asked for a solution that works "for all lookup tables and any page". Right now it works for the home page and the two lookup tables that appear on it. Here is what I would do next:

- **A universal reference resolver.** The API has eight lookup tables (`genres`, `labels`, `countries`, `studios`, `jobs`, `kind`, `rewards`, `seo`). Instead of one store per table: a single `metadata` store that loads a table by the `oid` prefix, and a recursive resolver that walks any response and replaces `type:id` strings with objects. Then a new page or a new lookup table would not require changes to the mapper.
- **An API proxy through Nitro server routes** (`/api/**` → the test server). This fixes CORS in SPA mode, hides the upstream URL and allows caching lookup tables on the server.
- **Error and loading states.** Show `error` from `useAsyncData` and reset `loading` in the stores with `try/finally`. At the moment, if a lookup request fails without reaching the fallback, the store stays in the `loading` state.
- **Parallel loading of lookup tables** with `Promise.all` instead of two sequential `await`s.
- **Strict typing in the mapper.** It currently accepts `any`, so TypeScript did not catch that `Banner.url` is never filled and that `filter(Boolean)` leaves `null` in the type.
- **Card links.** The API response includes the movie or series `url`, but every card links to `/`. Content pages are needed.
- **Gradient labels.** The API provides `left_color` / `center_color` / `right_color` for labels, but they are currently rendered with a plain border.
- **Styles.** `assets/css/main.css` uses Tailwind 4 syntax (`@import "tailwindcss"`) while Tailwind 3 is installed, and the file is not included anywhere. The `w-250` / `h-200` classes exist only in Tailwind 4, so they have no effect on the layout.
- **SEO and accessibility.** `<title>`, `lang`, meta description.
- **Tests.** Unit tests for the mapper and stores using the snapshot data.
