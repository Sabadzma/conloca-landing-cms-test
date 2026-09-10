# Conloca design context

Reverse-engineered design knowledge for the Conloca marketing site. The implemented
website is the source of truth; this directory interprets it so new pages can be
composed without rereading the whole repository.

## Design identity in one paragraph

Conloca is a **restrained, typography-led developer-tool marketing site** with one
expressive signature: large rounded panels filled with warm, textured gradient
imagery, darkened by an exact 20–33% black overlay so inverted (white) copy can sit
on top. Between those panels the site is flat, white, and quiet — Inter text on
white or stone-100 surfaces, thin stone borders, and a single lime accent
(`#BBF451` family) used sparingly for badges, progress, and the featured pricing
plan. Corners are consistently soft (20–28px panels, 8px controls), motion is
short and functional (110–320ms), and supporting copy is distinctively set in
*italic* Inter with a bold lead sentence.

## Stack

- Astro 7 static generation; `bun run build` emits `dist/`. No runtime server.
- React 19 islands: header, audience sections, pricing, how-it-works, pricing page
  hydrate with `client:load`; capabilities, blog, article, and footer are pure HTML.
- Tailwind CSS v4 (CSS-first, imported in `src/index.css`) is used **inside
  design-system components**; page sections are styled by hand-written per-page CSS
  files (`src/homepage.css`, `src/how-it-works-page.css`, `src/pricing-page.css`,
  `src/blog.css`, `src/article-page.css`).
- All editable text lives in typed, serializable `src/*-content.ts` modules.
  Sections take a single `content` prop.

## Authoritative design resources

| Resource | Path |
| --- | --- |
| Design tokens (generated from Figma, read-only) | `Conloca Design system/design tokens/{primitives,semantics,index}.css` |
| Token alias chains from Figma | `docs/figma-homepage-variables.json` |
| Homepage layout ledger (measured Figma rules + verification) | `docs/figma-homepage-layout.md` |
| Reusable components | `Conloca Design system/components/conloca-*` |
| Component contracts | each component's `component-contract.md` |
| Icons (1583 exact Figma SVGs) | `Conloca Design system/icons/` |
| Fonts | `public/fonts/` (Inter, Inter Display), `@fontsource-variable/roboto-mono` |
| Page styles | `src/*.css` |
| Section components | `src/sections/` |
| Storybook catalog | `bun run storybook` |

## Representative pages (inspected rendered + source)

| Route | Source | Role |
| --- | --- | --- |
| `/` | `src/pages/index.astro` | Primary marketing reference: hero, pinned features, bento, pricing |
| `/how-it-works` | `src/pages/how-it-works.astro` | Editorial/technical page: pinned step flow, diagram, terminal CTA |
| `/pricing` | `src/pages/pricing.astro` | Conversion page: image hero, plan cards, comparison table |
| `/blog` | `src/pages/blog.astro` | Listing page: stacked card deck, alternating card layouts |
| `/blog/one-change-across-three-systems` | `src/pages/blog/*.astro` | Long-form article: TOC, prose measure, related stories |

`src/pages/test-preview.astro` and `src/__canvas_preview__.tsx` are tooling-managed
dev artifacts, not design references.

## Document index

- `visual-language.md` — what makes the site look like Conloca
- `foundations.md` — tokens, typography, color roles, spacing, radii
- `layout-patterns.md` — containers, gutters, panels, grids, sticky regions
- `components.md` — design-system components and section-level building blocks
- `section-patterns.md` — recurring section families and their rules
- `page-patterns.md` — how complete pages are composed
- `responsive-patterns.md` — the four breakpoint compositions
- `content-style.md` — voice, capitalization, CTA wording, content model
- `interaction-motion.md` — transitions, scroll sequences, carousel, dialog

## Notable exceptions

- `--color-background-buttn: #FFFFFF` in `semantics.css` is a Figma export
  artifact; do not build on it.
- `--color-zinc-700` duplicates `--color-zinc-600` (#52525B) in the Figma source;
  preserved verbatim.
- Untokenized values are deliberate where Figma had none: black overlays
  (`#0003`, `#0000001a`, `#00000033`), artwork geometry, rotation, shadows, and the
  hero-video `#191919` frame.
- Footer max-width is 1424px by explicit user instruction, overriding both the
  1376px inner cap and the Figma node's own 1432px (see
  `docs/figma-homepage-layout.md` follow-up).

## Uncertainties

- `docs/figma-homepage-variables.json` alias chains were recorded 2026-09-07 and
  not re-verified against the current Figma file.
- Only the homepage has a recorded Figma ledger. The other four pages were
  extracted from their implementation alone; their Figma frames were not
  cross-checked in this pass.
