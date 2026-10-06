# Astro migration (superseded by the Conloca CMS integration)

This document records the original Astro 7 static migration. The CMS integration
it anticipated has since landed: the site now uses `output: "server"` with the
node adapter, content lives in `content/`, and the editor runs at `/__cms` in dev.
See `docs/conloca-cms-integration.md` for the current architecture; the sections
below are kept for the migration's tooling decisions and verification history.

## Structure and content

`src/layouts/site-layout.astro` owns document metadata, the skip link, global styles,
and the overflow wrapper. `src/pages/index.astro` owns composition and the main
landmark. Tokens and font styles load before homepage CSS.

| Section | Rendering | State |
| --- | --- | --- |
| ConlocaHeader | Static HTML plus `client:load` | Mobile navigation |
| AudienceSections | Static HTML plus `client:load` | Audience, carousel, video dialog |
| CapabilitiesSection | Static React HTML | None |
| PricingSection | Static HTML plus `client:load` | Monthly/annual interval |
| ConlocaFooter | Static React HTML with link props | None |

HeroSection and FeatureSection are reusable React children. Their owner passes
ordinary props and callbacks to keep all audience controls synchronized. The owner
also scopes audience CSS variables. There is no cross-island store or event bus.
All interactive content exists in generated HTML; no component uses `client:only`.

`src/homepage-content.ts` contains typed, serializable editorial data: metadata,
navigation, action text and destinations, audience copy, poster/video details,
capabilities, and pricing. Callback props live separately in the sections. React
sections accept only their required content and have no Astro or CMS dependency.
Existing copy (including spelling) and `/` destinations are deliberately preserved.

The lazy SVG catalog remains intact. ConlocaButton defers importing it until an
icon-bearing button renders, reserves the icon dimensions while loading, and waits
for the SVG during static rendering. This avoids loading the catalog for the
homepage's text actions. Public design-system props, refs, data slots, tokens, and
SVG artwork remain unchanged.

## Tooling and verification

Use Node 22.14.0 (`.nvmrc`) and Bun 1.3.14 (`packageManager`). Astro, its React
integration, Vitest, and Storybook resolve official Vite 8.2.2; plugin-react is
5.2.0. React and React DOM resolve to 19.2.8, and Storybook packages to 10.6.0.
The old Vite alias and forced overrides are removed. Bun initially retained that
alias beneath Vitest; removing and re-adding only Vitest through Bun cleared the
stale resolution without updating unrelated packages.

`tooling/vite.ts` provides space-safe aliases and fresh plugin factories. Astro
installs its own React transform. Storybook explicitly sets React, SVG, Tailwind,
and aliases through `viteFinal`; Vitest uses React, SVG, aliases, jsdom, and its
existing setup without loading Astro routes. Tailwind uses the Vite plugin.

```sh
bun install --frozen-lockfile
bun run deps:check
bun run lint
bun run typecheck
bun run test
bun run build
bun run build-storybook
bunx playwright install chromium
bun run test:e2e
```

`deps:check` checks the full installed dependency tree, peer compatibility, and
required framework resolutions. `typecheck` runs Astro diagnostics before TypeScript.
The application-verification workflow repeats these gates on ordinary push and pull
request events with read-only repository permissions. Privileged security workflows
are unchanged. Browser tests serve the production site and the static Storybook
catalog; they do not depend on a development server.

The optional migration visual suite compares a preserved static build with the
current build using the same Chromium version. It waits for fonts and images,
disables animations, and requires zero changed pixels. Audience selectors are
hidden below 1024px in the existing design, so the suite selects each audience at
1440px before resizing.

```sh
# Serve the preserved dist at port 4180 first.
SITE_URL=http://127.0.0.1:4180 VISUAL_BASELINE_DIR=/private/tmp/conloca-astro-baseline/screenshots bun run test:e2e tests/e2e/visual.spec.ts --update-snapshots --workers=2
# Run separately, after building the current site, to avoid shared report collisions.
VISUAL_BASELINE_DIR=/private/tmp/conloca-astro-baseline/screenshots bun run test:e2e tests/e2e/visual.spec.ts --workers=2
```

## Verification results

All gates passed: clean frozen installation, complete dependency/peer audit, zero-warning
lint, Astro diagnostics, TypeScript, 22 unit tests, both builds, and 24 browser tests.
All 58 screenshots match exactly across the requested widths and breakpoints.
Initial external JavaScript fell from 486,534 to 350,171 bytes (28.03%); reported
uncompressed transfer fell from 486,834 to 354,071 bytes (27.27%). Requests increased
from 1 to 13 as code is shared between islands. Identical static servers and cold
browser contexts were used; these numbers do not claim faster overall loading.

See `docs/astro-verification.json` for the final measured results and rollback
revision. The preserved revision, static artifact, screenshots, and logs are local
at `/private/tmp/conloca-astro-baseline/`. Keep or archive that directory before
system temporary-file cleanup if retaining it for deployment rollback.

The original 18 unit scenarios are retained, with content-driven rendering,
feature-to-hero synchronization/reset, and lazy SVG client/static-rendering coverage
added. Browser coverage includes all three hydration boundaries, assets and fonts,
navigation, audiences, carousel controls, pricing, video focus/Escape/cleanup,
ordinary links and default content without JavaScript, and seven Storybook catalogs.

The existing jsdom axe checks still pass. A full browser axe run identifies the
same two pre-existing contrast findings in both builds: `.astro-badge > span` and
`#capabilities-heading > span`. The browser test records these exact findings and
fails if additional findings appear. This migration does not alter Figma colors.
The external YouTube document is stubbed in regression tests; iframe URL, attributes,
focus containment, dismissal, and removal are tested, not third-party video delivery.

## Conloca integration (landed)

Completed: blocks are registered in `src/puck.config.tsx`, typed content lives in
`content/`, and the editor's server runtime runs through the node adapter. See
`docs/conloca-cms-integration.md`.

The plugin-react peer conflict noted above was resolved with a flat
`"overrides": { "@vitejs/plugin-react": "^5.2.0" }` in `package.json`: the CMS
declares `^4.0.0` but only uses `viteReact.preambleCode`, which plugin-react 5
still exports. `npm ls --all` (run by `scripts/check-dependencies.ts`) passes with
the override; Bun records it in `bun.lock` without warnings. Do not replace it
with a nested override — Bun ignores those.

Framework references: [Astro 7 changes](https://docs.astro.build/en/guides/upgrade-to/v7/),
[React framework components](https://docs.astro.build/en/guides/framework-components/),
[Astro TypeScript](https://docs.astro.build/en/guides/typescript/), and
[Storybook viteFinal](https://storybook.js.org/docs/api/main-config/main-config-vite-final).
