# Section patterns

Section families that actually recur, with their composition rules. Content for
all of them comes from typed `src/*-content.ts` modules; sections receive one
serializable `content` prop.

## Audience hero (homepage)

Classification: Local (one page, but the site's primary reference)

Viewport-filling grid hero: 8 columns, copy spanning 3 (audience segmented
control → 48px Inter Display h1 → "Built for Astro" badge → two button CTAs →
rotating italic message carousel with progress rail), media spanning 5. Media is
a layered composition: rounded background image panel → clip container → rotated
(−1.5°) dark video card (radius 20px, ambient shadow) that peeks out of the
background window. Height `clamp(755px, 100svh − 80px, 880px)`.

Below 1024px it inverts: the *copy* moves onto the imagery (centered white 52px
Black heading inside a 955px rounded panel), the video card detaches and overlaps
the panel's bottom edge (rotated +2.089°), and the carousel drops below the
panel. Audience switching swaps all background images via CSS variables on
`.audience-sections[data-audience]`.

## Scroll-pinned feature banners

Classification: Local (homepage)

Three full-width rounded imagery panels stacked in a 400vh sticky track; scroll
crossfades them (opacity 240ms). Each banner: audience control top-center
(43px rail, desktop only), bottom-anchored copy column (440px or 50%) with
48px Inter Display h2 + italic 16px description + two CTAs, and
breakpoint-specific absolute Figma artwork. The third banner (history) flips to
a vertical layout with copy in a bottom row.

## Display-heading + bento (capabilities)

Classification: Recurring (homepage; HIW bento is a sibling)

A centered 72px Inter Display Black two-line heading (second line lime) wrapped
in "title art" — absolute-positioned Figma decorations (Git/Astro marks, file
labels) that bleed outside the text. Followed by the artwork bento grid
(described in `layout-patterns.md`). The HIW page uses the same grid idea with
icon cards and an in-grid heading instead of title art.

## Pricing cards + billing toggle

Classification: Recurring (homepage and `/pricing`)

Header row: 48px Inter Display h2 (max 572px) bottom-aligned with a
Monthly/Annual segmented control at the opposite end. Below: three plan cards in
a row (12px gaps), then a centered "Compare plans" secondary link. Featured plan
gets the lime-ring treatment and a "Best value" badge. Annual billing multiplies
price × 12 (no discount). At 1024–1280px the intro becomes a sticky 440px column
beside vertically stacked cards; below that everything stacks.

## Image hero with transparent header (pricing page)

Classification: Local (`/pricing`, pattern reusable for campaign pages)

612px full-bleed imagery band with 10% black overlay; the site header overlays
it transparently (absolute, inverted). Inside the 1440px container: mono
uppercase breadcrumbs ("PRICING / PLANS"), bottom-anchored row with 76px
negative-tracked h1 + italic description (max 650px) and the billing toggle at
the far end. Below 1024px the band becomes a rounded floating panel and the
header returns to the surface.

## Editorial eyebrow hero (how-it-works, blog)

Classification: Recurring

Flat white opening: Roboto Mono uppercase eyebrow/breadcrumbs, then the split
two-column intro (display heading left, italic description right, bottom
aligned). HIW uses 76px; blog uses 48px with a mobile-specific alternate
heading (`heading` vs `mobileHeading` in content). The blog adds a "dispatch"
line with a lime dot at 640–1023px.

## Scroll-pinned step flow (how-it-works)

Classification: Local

400vh track; pinned viewport split into an upper hero zone and a bottom step
list. Steps are a top-bordered row of equal columns (mono number, bold title,
gray description); the active step gets `bg-elevated` plus a 2px lime top
border, and a full-width lime progress bar scales across the top. The upper zone
carries the editor mock artwork over imagery. On mobile the flow becomes a
compact horizontal step list.

## Comparison table

Classification: Local (`/pricing`)

Bordered, fixed-layout plan-comparison table in a rounded scroll frame
(details in `layout-patterns.md`). Intro row reuses the split-intro pattern with
a mono eyebrow ("COMPARE PLANS") and billing toggle.

## Imagery CTA card

Classification: Recurring (HIW CTA, pricing assistant, footer is the dark cousin)

Page-closing rounded imagery panel (28px radius, 8px gutters): bottom-anchored
inverted copy — 60–72px display heading + 20px italic description — beside an
action cluster. HIW puts the terminal there; pricing puts a 2×2 grid of
icon-labeled action cards (ChatGPT/Claude/Gemini/Grok/mail, 80px tall, 24px
radius). Mobile: stacks, radii shrink to 20px.

## Card deck listing (blog)

Classification: Local (`/blog`)

Articles as large imagery cards with mono metadata (read time / date). Desktop
(≥1024): alternating `full` (image behind, grid copy) and `split` (copy left,
image right) layouts at 1424/572 aspect. Below 1024 the listing becomes a
**stacked deck**: cards overlap with negative margins (−600px/−390px) and each
successive card scales down (×0.99, ×0.9801, ×0.970299) and shrinks, so card
edges peek out like a physical stack. All deck metrics multiply by a per-card
`--blog-stack-scale` variable. Verified rendered at 390px.

## Long-form article

Classification: Local (`/blog/*`)

Hero (76px h1, meta grid with date + breadcrumbs, italic description, author
byline) → cover image (max 1600px, 1424/632 aspect, 28px radius, 10% scrim) →
body split: sticky TOC (max 320px, mono numbered links, top 72px) + prose column
(max 832px; 20px/1.7 paragraphs; 32px h2 with −1.05px tracking; mono block
labels; numbered step lists and definition-list benefits separated by inset
hairlines) → "related stories" reusing the blog split card on a sunken
background → footer.

## What does NOT exist

No testimonial, logo-cloud, FAQ, stats, or newsletter sections. Do not invent
them from generic SaaS habits; if a design needs one, derive it from the
patterns above (surface card, display h2, italic description, SectionLink CTAs).
