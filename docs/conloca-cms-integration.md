# Conloca CMS integration

The site runs the Conloca CMS: content lives in `content/` (Git-backed), editors work
in the Puck-based editor at `/__cms` during `bun run dev`, and the production build
prerenders every page from that content.

## Dependencies and Astro config

`@conloca/astro-cms@0.1.16` provides the integration, editor SPA, and content API;
`@astrojs/node` (standalone) serves the editor/API runtime; `@puckeditor/core` and
`zod` back the block configs and editor schemas.

`@puckeditor/core` must stay on `^0.21.2`, matching `@conloca/cms-spa`. If two copies
of Puck resolve into the editor page (for example a stale nested copy under
`node_modules/@conloca/*/node_modules`), each carries its own `@dnd-kit` module
instances and the canvas crashes with "AutoScroller plugin depends on Scroller
plugin". After changing the range, verify only one copy exists
(`bun pm ls | grep puckeditor`) and delete any stale nested directories.

`astro.config.ts` uses `output: "server"` with the node adapter and one
`conlocaCMS({ ... })` integration call: `contentRoot`, `puckConfigPath`,
`schemasPath`, `assetsPath`, `componentPaths: ["src/puck"]`, `siteStyles` (all page
CSS, used for the editor canvas), `routing`, and `templates`.

### Routing constraints (astro-cms 0.1.16)

- Use a **single** route: `pattern: "/[...slug]"`, `collection: "pages"`. The shared
  page handler emits every configured route's entries from one `getStaticPaths`, so
  multiple routes receive foreign entries and crash (`Missing parameter`) or emit
  wrong URLs. Blog posts therefore live in `content/default/pages/blog/` and keep
  their `/blog/*` URLs; the blog listing's `dataBindings.pages` prefix `/blog/`
  filters them back out.
- The catch-all parameter **must be named `slug`**: the page handler always returns
  `params.slug`. Any other name silently collapses every page to `/`.

## Content model

```
content/sites.json                              # site + locales
content/default/pages/*.vxjson                  # pages: index, pricing, blog, ...
content/default/pages/blog/*.vxjson             # blog posts (pathname /blog/<slug>)
content/data/navigation/main.en.json            # header nav, buttons, skip label
content/data/footer/main.en.json                # footer nav + action
```

`.vxjson` files hold `{ id, meta: { title, description }, content: { puckData } }`.
Every block inside `puckData.content` (and `zones`) **must carry a unique
`props.id`**; without ids the editor canvas cannot key draggables and renders every
block as the last one. Puck assigns ids to blocks added through the editor; only
hand-written content must include them.

Data entries (`content/data/<collection>/<name>.<locale>.json`) are plain JSON with
`{ id, type: "json", meta, data }`. The `id` must be **unique across all data
collections** — the content API's data index keys entries by id alone, and a
collision silently drops the whole collection from Astro's collection registry.

## Blocks and sections

`src/puck/blocks/*.tsx` contains seventeen blocks. Nine hydratable ones are
named after their block key (hero-section.tsx → `HeroSection`,
features-section.tsx → `FeaturesSection`, capabilities-section.tsx →
`CapabilitiesSection`, pricing-section.tsx → `PricingSection`,
pricing-page-hero.tsx → `PricingPageHero`, pricing-page-plans.tsx →
`PricingPagePlans`, pricing-page-comparison.tsx → `PricingPageComparison`,
how-it-works-steps.tsx → `HowItWorksSteps`, how-it-works-cta.tsx →
`HowItWorksCta`); the eight static ones keep the `-block` suffix (terms,
blog-hero, blog-listing, article-page, pricing-page-assistant,
how-it-works-hero, how-it-works-layers, how-it-works-bento). Each exports a
Puck `ComponentConfig` with `fields` (editor form), `defaultProps` (canonical
copy), and `render`. Flat editor props are converted to the section content
contracts by exported `map<Name>Props` functions; unit tests build fixtures from
`defaultProps` plus those mappers, so tests exercise the same copy editors see.

Cross-block interactivity uses shared external stores, not React context: a
page composes blocks as separately hydrated islands, so
`src/sections/audience.ts` (hero ↔ feature cards) and
`src/sections/billing.ts` (pricing hero ↔ plan cards ↔ comparison table) hold
the selection behind `useSyncExternalStore`. All islands import the same module
instance, so toggles stay synchronized across block boundaries. The stores
outlive individual mounts; unit tests call `resetAudience()`/`resetBilling()`
in `beforeEach`.

Hydratable blocks wrap `render` in `withHydration(<fn>, "load")` **inside the
block file**. The CMS scanner keys the client registry by file name
(`deriveComponentName`), while the prerendered marker carries the Puck block key
— the two must match, which is why hydratable block files are named after their
block key. Renaming either side breaks hydration silently (the runtime logs
"Unknown component" and the section stays server-rendered). The layout injects a
small script that imports `virtual:conloca-hydration-entry` only when the page
contains `[data-hydrate]` markers, so fully static pages never load react-dom.

Sections in `src/sections/` stay framework-free: no Astro, Puck, or CMS imports.
Types shared across sections live in `src/lib/content.ts`.

`src/puck.config.tsx` registers the blocks, their editor categories, and the
`PuckComponents` interface. Block keys are stored in content files — never rename
them. Page templates (`landing`, `article`) are configured on the integration, not
in the Puck config.

## Layout contract

CMS routes render `src/layouts/site-layout.astro` with `LayoutProps`
(`title`, `description?`) and slot content. The layout loads the `navigation` and
`footer` collections via `getCollection`, parses them with the zod schemas in
`src/schemas/data.ts` (also the editor's data-entry forms), and derives header
variants (transparent pricing header, article/terms wrappers) from the pathname.
Zod optionals carry `| undefined`; `stripAbsentNewTab` drops absent `newTab` keys so
parsed items satisfy the design system contracts under
`exactOptionalPropertyTypes`.

## Editor workflow

`bun run dev` serves the site and the editor at `/__cms` (dashboard, pages, media,
data). Saving writes the `.vxjson`/`.json` files in `content/`; commit them through
the dashboard's Git controls or ordinary Git. The editor's canvas scratch directory
`conloca-canvas/` is gitignored. `bun run build` prerenders all pages to
`dist/client/` and emits the node server to `dist/server/`; `bun run preview` serves
the production build including the prerendered pages.

## Deploying to Vercel

Vercel cannot run the node standalone bundle, so `astro.config.ts` switches to
`@astrojs/vercel` when `process.env.VERCEL` is set (Vercel defines `VERCEL=1`
during builds). Prerendered pages deploy as static files; the few non-prerendered
routes (`/404`, preview/test routes) run in a serverless function. Local builds
and `bun run preview` are unaffected and keep using the node adapter.

## Re-seeding from scratch

The one-time seed script was deleted after producing `content/`. To recreate
content, copy block `defaultProps` into `puckData.content` entries with unique
`props.id`s, write the data entries with unique ids, and keep
`content/sites.json` as-is.
