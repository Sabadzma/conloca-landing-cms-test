# Visual language

## Character

Classification: Canonical

Restrained, typography-led, product-oriented. The default canvas is flat white
(`--color-bg-surface-initial`) with stone-gray text and hairline stone strokes.
There are no shadows on ordinary surfaces, no gradients on ordinary surfaces, and
no decorative shapes except inside the capabilities title art.

Evidence: `src/homepage.css` `:root`, `.bento-card`, `.pricing`; rendered `/`.

## The signature move: textured panels

Classification: Canonical

Visual energy is concentrated in large, fully rounded rectangular panels filled
with warm, painterly gradient imagery (blue→orange "space" textures), always
darkened by an exact black overlay and carrying inverted (white) italic/display
copy. Panels appear at: homepage hero visual + three feature banners, pricing-page
hero, how-it-works showcase + closing CTA, pricing assistant card, blog cards,
article covers.

Rules that hold across all of them:

- Overlay is an untokenized exact alpha: `linear-gradient(#0003, #0003)` (20%)
  on most homepage/blog panels, `#00000033` (20%) on how-it-works, `#0000001a`
  (10%) on pricing hero/assistant and wide blog cards.
- Text on panels is `var(--color-fg-strong-inverted-initial)`.
- Panels float inside small outer gutters (8px desktop, 4px mobile), producing a
  "card floating on the page" effect rather than full-bleed bands.
- Radii step 28px (desktop) → 24px (tablet) → 20px (mobile).

Evidence: `.hero-main-copy`, `.feature`, `.hiw-showcase`, `.hiw-cta__card`,
`.pricing-page-hero`, `.pricing-assistant-inner`, `.blog-card__link`,
`.article-cover__frame`; rendered `/`, `/pricing`, `/how-it-works`, `/blog`.

Exceptions: the content-editor audience variant drops the hero overlay
(`linear-gradient(transparent, transparent)` in
`.audience-sections[data-audience="editors"]`) because its Figma artwork is light.

## Accent discipline

Classification: Canonical

Lime (`--color-lime-*`) is the only hue used expressively, and it is rationed:
the "Built for Astro" badge, the "Best value" plan badge, the featured plan's
gradient ring, scroll progress bars, active terminal tab, and focus rings.
Neutral actions use stone-800 (`--color-bg-primary-initial`), not lime. Olive
(`--color-olive-50/700`) appears only as a soft tint behind the featured pricing
plan and one bento icon.

Evidence: `semantics.css` accent roles; `.astro-badge`, `.plan-badge`,
`.plan-pro::before`, `.hiw-steps__progress`, `.hiw-terminal__tab--active`.

## Typography as identity

Classification: Canonical

- Headlines: Inter Display, Bold (700) or Black (900), tight leading (1.0–1.2),
  negative letter-spacing on the largest sizes (−1.4px to −2.66px).
- Supporting copy: *italic* Inter 16px/1.7 — an unusual, immediately recognizable
  choice applied to hero messages, feature descriptions, page descriptions, and
  card descriptions site-wide. The first sentence is often bold.
- Labels/eyebrows/metadata: Roboto Mono, 12px, uppercase — the technical
  counterpoint (breadcrumbs, step numbers, plan groups, article TOC).

Evidence: `src/homepage.css` `.hero h1`, `.hero-message`, `.feature p`;
`src/how-it-works-page.css` `.hiw-hero__eyebrow`; `src/blog.css`
`.blog-hero__breadcrumbs`; rendered pages.

## Depth

Classification: Canonical

Flat by default. Elevation is reserved for: the hero video card (triple
un tokenized `#101828` shadow + 64px ambient blur), pricing plan summaries
(single soft `#10182808` shadow), and the featured plan's glow
(`0 -13px 48px -10px var(--color-lime-50)`). Interactive affordance comes from
background-color changes, not shadows.

## Density and pacing

Classification: Recurring

Spacious. Desktop section padding runs 72–196px; the homepage alternates
full-viewport immersive sequences (pinned feature banners) with airy flat
sections (capabilities bento, pricing). Content columns are narrow (432–600px)
even when the canvas is 1440px.
