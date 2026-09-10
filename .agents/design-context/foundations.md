# Foundations

## Tokens

Classification: Canonical

Two generated, read-only files are the token source of truth; never edit them by
hand (regenerate from Figma instead):

- `Conloca Design system/design tokens/primitives.css` — 150 variables from the
  Figma `Primitives` collection: Tailwind-familiar scales (zinc, red, slate,
  gray, neutral, stone, orange, teal, amber, cyan, lime, olive) plus
  `--color-absolute-white/black`.
- `Conloca Design system/design tokens/semantics.css` — 42 aliases (Light mode)
  that remain `var()` references into primitives, preserving Figma dependency
  chains.

Semantic roles actually used by the site:

| Role family | Tokens | Usage |
| --- | --- | --- |
| Surfaces | `bg-surface` (white), `bg-elevated` (stone-100), `bg-sunken` (stone-100) | page background, cards/table groups, terminal + plan card wells |
| Primary action | `bg-primary-initial/hovered/pressed/disabled` (stone-800/700/950/500) | buttons, footer panel |
| Accent | `bg-accent-*` (lime-300/400/500), `fg-accent-*` (lime-700/600/800) | badges, featured plan, progress |
| Foreground | `fg-strong/soft/softer-default-*`, `fg-strong-inverted-*` | headings, body, captions, text on imagery |
| Strokes | `stroke-softer/soft/strong/stronger/accent` (stone-50→800) | card borders, table rules, focus rings, carousel track |
| Overlay | `bg-overlay-darken-*` (stone-950 at 20/30/40%) | transparent-header hover states |

`docs/figma-homepage-variables.json` records the full alias chains. Binding rule
from the homepage ledger: foreground, surface, accent, stroke, sunken, and primary
colors bind to semantic variables; lime primitive bindings stay primitive; black
overlays are exact untokenized values.

Known artifacts: `--color-background-buttn` (export artifact),
`--color-zinc-700` == `--color-zinc-600` (Figma source duplicate).

## Typography

Classification: Canonical

Fonts are self-hosted in `public/fonts/` and declared via `@font-face` in
`src/homepage.css` (plus per-page Medium in `blog.css`/`article-page.css`):

- **Inter** variable 100–900 (+ italic) — UI, body, buttons. `:root` sets
  `font-family: Inter, sans-serif`.
- **Inter Display** Bold 700, Black 900, Medium 500 — headlines only.
- **Roboto Mono Variable** (`@fontsource-variable/roboto-mono`, imported by
  `src/index.css` and the blog/article CSS) — eyebrows, breadcrumbs, metadata,
  step numbers, the `link` button variant, terminal commands.

### Type scale observed across pages

| Role | Font | Desktop | ≤1280 | ≤1023 | ≤639 |
| --- | --- | --- | --- | --- | --- |
| Page hero h1 (pricing, article, hiw) | Inter Display 700 | 76px/1.2, −1.5px | 60px | 52px/1.05 | 40px |
| Section display (capabilities, assistant) | Inter Display 900/700 | 72px | — | 56px | 32px |
| Section h2 (features, pricing, bento, layers) | Inter Display 700 | 48px/48px | — | 40px | 32px/38px |
| Card title (bento, blog) | Inter 700 / Inter Display 500 | 20–32px | — | — | 16–24px |
| Body / supporting | Inter 400 *italic* | 16px/1.7 | — | — | 14px/22px (hiw) |
| Feature-list items | Inter 500 *italic* | 16px/27px | — | — | — |
| Eyebrow / metadata | Roboto Mono 400 uppercase | 12px | — | — | 12px |

Rules:

- Supporting copy is *italic* almost everywhere (`font-style: italic` appears in
  hero, feature, pricing, blog, article descriptions). Upright body text is the
  exception (bento descriptions, steps, article prose paragraphs are upright).
- Display line-height equals font-size at 48px and below (`48px/48px`); larger
  sizes use 1.2 or 1.05.
- Negative letter-spacing only on display sizes ≥40px.
- `font-synthesis: none` on `:root` — never fake bold/italic.

## Spacing and sizing logic

Classification: Recurring

There is no spacing token scale in the token files; values come from Figma
measurements and cluster on a loose 4px grid:

- Gaps: 8, 12, 16, 24, 32, 48px (48px = major column gap, 24px = copy stack,
  12px = card grid, 8px = tight clusters).
- Section padding-block: 72, 96, 120, 132, 148, 196px depending on page rhythm
  (see `page-patterns.md`).
- Content caps: 432px (hero copy), 440–472px (feature copy), 520–600px (CTA
  copy), 650–800px (page-hero copy), 832px (article prose measure),
  1376px (feature inner), 1424px (footer/CTA/cards), 1440px (page container).

## Radii

Classification: Canonical

Stepped by breakpoint, larger for larger surfaces:

| Element | Desktop | ≤1023 | ≤639 |
| --- | --- | --- | --- |
| Full-width imagery panels (feature, CTA, blog card) | 28px | 24px | 20px |
| Cards (bento, plan) | 24–26px | 24px | 20px |
| Plan summary well | 18px | 18px | 12px |
| Dialog / terminal | 16px | 16px | 16px |
| Segmented control | 14px | — | — |
| Badge (astro) | 12px | — | — |
| Buttons | 8px (12px on pricing plan CTAs via override) | — | — |
| Pills (progress track, play button) | 1000px | — | — |

## Borders and shadows

Classification: Recurring

- Hairline structure: `1px solid var(--color-stroke-strong)` (stone-200) on
  feature panels, comparison table cells, step lists; `stroke-soft` for the
  mobile menu divider; `stroke-softer/soft` barely-there separators. Article
  rules use `box-shadow: inset 0 -1px 0 …` / `inset 0 -0.56px 0 …` instead of
  border (keeps box-model height untouched).
- Shadows are rare and always untokenized Figma values: hero video
  `0 4px 6px #10182808, 0 12px 16px #10182814, 0 4px 64px #00000026`; plan
  summary `0 6.4872px 9.7308px #10182808`; featured-plan glow
  `0 -13px 48px -10px var(--color-lime-50)`; featured comparison column
  `inset 0 8px 30px -20px var(--color-lime-400)`.

## Focus

Classification: Canonical

`:focus-visible` outline, never ring shadows: 2px `stroke-accent` (stone-800)
with 2–4px offset on light surfaces; 3px `bg-accent-initial` (lime) with −6px
inset offset on imagery cards (blog, related) and +6px offset on the hero video.
On dark/transparent contexts the outline flips to inverted foreground.

## Global resets and quirks

- `src/homepage.css` zeroes `h1–h3, p` margins and `body` margin; `.page-wrapper`
  gets `overflow-x: clip` (article pages override: `html:has(.article-page)`
  clips instead so the sticky TOC works).
- `-webkit-tap-highlight-color: transparent` on links/buttons.
- `.skip-link` fixed, translated offscreen until focus.
