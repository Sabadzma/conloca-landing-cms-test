# Layout patterns

## Page container

Classification: Canonical

`max-width: 1440px; margin-inline: auto; padding-inline: 32px` is the shared
marketing container. Nearly every top-level section sets it on itself
(`.capabilities`, `.pricing`, `.hiw-hero`, `.hiw-bento`, `.blog-hero`,
`.blog-listing`, `.pricing-page-*`, `.article-*`). The header applies the same
cap internally (`max-w-[1440px]` with 32px padding at ≥1024px). There is no
single global wrapper class — each section owns its centering, which lets
individual sections break out (see below).

Gutter steps: 32px desktop → 24px at ≤1023 → 16px at ≤639 (text sections).
Artwork/panel sections use much tighter outer gutters: 8px desktop, 4px mobile.

Evidence: `src/homepage.css` `.capabilities`, `.pricing`; `src/blog.css`;
header `conloca-header.tsx` container classes.

## Floating-panel sections

Classification: Canonical

Immersive sections are not full-bleed: they sit inside the page with a small
outer padding (`.features` 72px 8px 8px; `.hiw-cta` 8px 8px 0;
`.pricing-assistant` 8px 8px 0; footer `p-[4px] sm:p-[8px]`; blog listing 8px;
pricing-page hero gains `margin-inline: 8px` + 24px radius below 1024px). The
rounded panel inside carries radius 28/24/20px by breakpoint. `.page-wrapper`
uses `overflow-x: clip` so overhanging artwork never scrolls horizontally.

## Inner content caps

Classification: Recurring

- 1376px: inner cap inside full-width feature banners (`.feature-content`).
- 1424px: footer, CTA cards, wide blog/article cards (1440 − 2×8px gutters).
- 832px: article prose measure.
- 432–472px: hero/feature copy columns.
- The footer cap of 1424px is an explicit user decision overriding Figma's
  1432px (see `docs/figma-homepage-layout.md`).

## The eight-column hero grid

Classification: Local (homepage hero)

Desktop hero is an 8-column grid (`repeat(8, minmax(0,1fr))`, 16px column gap):
copy spans columns 1–3, visual spans 4–8 across three rows. Height is
`clamp(755px, 100svh − 80px, 880px)` — the hero plus the 80px header fill the
viewport, clamped per Figma Frame 610. Copy is bottom-anchored: heading group at
top with 60px padding, carousel and actions at the bottom with 60px padding.

## Scroll-pinned sequences

Classification: Recurring (homepage features, how-it-works flow)

Two pages use the same scroll-track pattern: an outer track of `height: 400vh`
with an inner `position: sticky` pin filling the viewport (`100dvh − 16px` on
homepage, `100dvh` on HIW). Absolutely stacked children crossfade
(`.feature` opacity 240ms) or activate sequentially (`.hiw-step--active`), driven
by a scroll listener + `requestAnimationFrame` in React
(`src/sections/audience-sections.tsx`, `how-it-works-page-sections.tsx`). A 2px
lime progress bar (`.hiw-steps__progress`, `scaleX`) tops the HIW pin.

## Bottom-anchored copy on imagery

Classification: Canonical

On every imagery panel, copy sits at the bottom (`justify-content: flex-end`):
feature banners, HIW CTA card, pricing assistant, blog cards, related cards.
Desktop feature copy additionally aligns its text block to the bottom of the
panel while artwork fills the rest.

## Split two-column intros

Classification: Recurring

Editorial sections open with a 1fr/1fr, 48px-gap grid: heading left, italic
description bottom-aligned right (`align-self: end`). Used by HIW hero, HIW
layers intro, blog hero (≥1024), pricing comparison intro (with the billing
toggle bottom-right), article hero footer. Collapses to a single column with
24–32px row gap below 1024px.

## Bento grids

Classification: Recurring (two distinct families)

- **Homepage capabilities**: fixed-row artwork bento — 4 cols × 3 rows of
  326.667px, 12px gaps, cards with absolutely positioned Figma artwork, gradient
  scrim behind bottom-anchored copy. Reflows 4→3→2 cols, then a 1-col stack of
  372px cards on mobile. Artwork is repositioned with exact px per breakpoint.
- **HIW bento**: content bento — 3 cols, `minmax(250px, auto)` rows, icon top,
  copy bottom (`margin-top: auto`), heading spanning two grid cells. Reflows
  3→2→1 cols. Cards use `bg-elevated` instead of artwork.

## Tables

Classification: Local (pricing comparison)

Full-width fixed-layout table inside a 1px-stroked, 28px-radius scroll frame.
Group rows get `bg-elevated`; the featured column gets an olive-50 gradient and
inset lime glow; the label column is 27.365%. Rows: 168px header, 53px groups,
72px body, 108px footer. Below 1280px the frame scrolls horizontally with
`overscroll-behavior-x: contain`.

## Artwork positioning

Classification: Canonical (technique)

Illustrations are exact Figma exports placed absolutely with literal pixel
offsets (`left: calc(50% − 966.031px)` etc.) inside `overflow: hidden` panels,
respecified per breakpoint. The page never scales artwork fluidly; each
breakpoint composition has its own geometry. Artwork images use
`max-width: none` to escape container constraints and are `aria-hidden` with
empty `alt`.
