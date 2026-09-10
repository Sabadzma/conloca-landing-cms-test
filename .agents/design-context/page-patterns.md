# Page composition patterns

Every page is assembled the same way in `src/pages/*.astro`:

```
SiteLayout (metadata, skip link, page-wrapper)
  ConlocaHeader (client:load)
  main#main-content
    …page sections…
  ConlocaFooter (static)
```

Pages import `src/index.css` (tokens + Tailwind + fonts) via the layout, then
their own page CSS. Content comes from a single `src/*-content.ts` module per
page, which also exports `metadata`, `headerContent`, and `footerContent`.
Interactive islands hydrate with `client:load`; everything else is static HTML.
`client:only` is forbidden; all sections render without a DOM.

## Homepage `/`

1. **Audience hero** — viewport-filling (see `section-patterns.md`).
2. **Pinned feature banners** — the scroll sequence doubles as the
   hero-to-body transition: the page goes from airy white hero straight into a
   full-viewport immersive panel.
3. **Capabilities** — return to flat white: display title art + artwork bento.
   196px of breathing room before pricing.
4. **Pricing** — flat white conversion block.
5. **Footer** — dark panel.

Pacing: immersive → flat → flat → dark. Text-heavy and visual sections strictly
alternate; the only adjacent visuals are hero → features, joined by the scroll
pin.

## How it works `/how-it-works`

1. Editorial eyebrow hero (flat).
2. Pinned step flow with showcase mock (immersive, but white-pinned).
3. Bento grid (flat white).
4. Layers diagram on a full-width `bg-elevated` band — the only full-bleed
   background-color section on the site.
5. Imagery CTA card with terminal.
6. Footer.

## Pricing `/pricing`

1. Full-bleed image hero with transparent header (the only page where the
   header overlays content; reverts to normal flow below 1024px).
2. Plans (reuses the homepage pricing section markup with page-specific CSS).
3. Comparison table.
4. Assistant CTA imagery card.
5. Footer.

The page shell (`.pricing-page-shell`) exists only to anchor the absolute header.

## Blog `/blog`

1. Editorial eyebrow hero (flat, compact — 330–406px).
2. Card deck listing.
3. Footer directly after the deck (the deck's negative margins make it read as
   a single tall visual object).

## Article `/blog/*`

1. Article hero (flat; date/breadcrumb meta row appears ≥1024px).
2. Cover image — the one element allowed to exceed the container (max 1600px).
3. Body: sticky TOC + prose.
4. Related stories on `bg-sunken` — background shifts to separate the appendix
   from the article.
5. Footer wrapped in `.article-footer-wrap` to keep the sunken background.

## Cross-page rules

- **Openings**: either a viewport-ish hero (homepage, pricing) or a compact
  editorial header (HIW, blog, article). Never a mid-page-style section first.
- **Endings**: conversion pages end with an imagery CTA card then the footer;
  content pages end with related content then the footer. The dark footer panel
  is always the final element and provides the page's only large dark surface.
- **CTA placement**: hero has paired primary+secondary CTAs; mid-page sections
  reuse the same pair (features) or a single secondary link ("Compare plans",
  "Read more stories"); page-final CTA cards hold the primary conversion ask.
- **Background alternation**: white surface is the default; `bg-elevated`
  (stone-100) and `bg-sunken` bands separate major conceptual shifts; imagery
  panels carry immersion. No page uses more than one elevated band.
- **Vertical rhythm**: desktop section padding-top clusters at 72px (standard),
  120–148px (after immersive sequences), 196px (homepage pricing). Mobile
  collapses to 24–72px.
- **Anchors**: `#how-it-works` on the homepage feature track, `#pricing`,
  `/pricing#comparison` — section ids are part of the nav contract
  (`src/homepage-content.ts` navigation).
