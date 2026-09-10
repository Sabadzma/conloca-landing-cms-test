# Responsive patterns

## Breakpoints

Classification: Canonical

Four compositions, confirmed by the Figma reference frames and the CSS:

| Name | Range | Reference width |
| --- | --- | --- |
| Mobile | <640px | 393px |
| Tablet | 640–1023px | 640px |
| Medium | 1024–1280px | 1024px |
| Desktop | >1280px | 1440px |

The header switches desktop ↔ mobile navigation at exactly 1024px (corrected
from 1025px during verification).

**Mixed strategy per file** — match the file you edit, do not normalize:
- `homepage.css`, `how-it-works-page.css`, `pricing-page.css`: desktop-first
  (`max-width: 1280px and min-width: 1024px`, `max-width: 1023px`,
  `max-width: 639px`).
- `blog.css`, `article-page.css`: mobile-first (`min-width: 640/1024/1280px`).
- Design-system components: Tailwind `sm:` (640) and `min-[1024px]:` utilities.

## Gutters and containers

- Text sections: 32px → 24px (≤1023) → 16px (≤639).
- Artwork/panel sections: 8px → 4px (mobile); homepage hero uses 8px below
  1024 and 4px below 640.
- The 1440px cap never changes; only padding and inner composition change.

## Typography

Display sizes step down per breakpoint rather than scaling fluidly:
76→60→52→40/32px (page heroes), 72→56→32 (capabilities), 48→40→32 (section h2).
Body stays 16px except HIW mobile (14px). Blog card titles scale via the deck's
`--blog-stack-scale` multiplier instead of media-query font changes. Blog
headings swap *text content* between mobile and wide variants
(`heading`/`mobileHeading` spans toggled by display).

## Grid and layout transformations

- **Hero (homepage)**: 8-col grid → flex column with copy-on-imagery panel
  (≤1023) → compact 530px-min panel with tighter padding (≤639). The audience
  control and feature audience rails are `display: none` below 1024px.
- **Feature banners**: side-by-side copy/artwork → copy above artwork (≤1023),
  with per-breakpoint absolute artwork re-positioning.
- **Capabilities bento**: 4×3 → 3×5 (1024–1280) → 2 cols with two 200px rows
  then 326.667px rows (≤1023) → 1-col stack of 372px cards (≤639). Grid
  placement of every card is explicitly respecified at each breakpoint.
- **Pricing**: 3-card row → sticky 440px intro column beside stacked cards
  (1024–1280) → full stack with intro row on top (≤1023).
- **HIW steps**: 4-col row → 2×2 grid (≤1023) → horizontal mini-rows (≤639).
- **HIW bento**: 3 → 2 → 1 cols.
- **Blog listing**: full-width alternating cards (≥1024) → stacked deck with
  negative margins and per-card scale (≤1023), deck gap tightening at ≤639.
- **Article body**: sticky TOC + prose side-by-side (≥1024); TOC hidden below.
- **Comparison table**: fixed 1210px frame → horizontal scroll below 1280px
  (min table width 1000px).

## Substitution and hiding

- Mobile menu replaces inline nav below 1024px (header).
- Blog metadata/description render **both** wide and compact variants in markup
  (`--wide`/`--compact` classes toggled by display) — duplicate content with
  `aria-hidden` on the decorative separator, not CSS-generated text.
- The pricing-page header changes from absolute/transparent to static/surface
  below 1024px.
- The HIW showcase mock and diagram keep fixed pixel widths and rely on
  `overflow: hidden` cropping (min-height shrinks 480→320→160px).

## Artwork behavior

Classification: Canonical

Nothing scales fluidly. Every breakpoint composition re-specifies artwork
width/offset with exact Figma pixels, and panels crop via `overflow: hidden`.
Fractional values (e.g. 326.6667px, 274.5987px) are intentional — preserve them.
Verified widths in the ledger: 393, 394, 480, 516, 638–641, 768, 832, 1023–1025,
1152, 1279–1281, 1439–1441, 1600px — no horizontal overflow anywhere.
`.page-wrapper { overflow-x: clip }` is the last line of defense (article pages
move the clip to `html` so the sticky TOC still works).

## Touch and small-screen affordances

- Tap highlight disabled globally.
- Hero carousel indicators rotate to a horizontal bar and sit above the message
  on compact layouts.
- Mobile nav rows are 64px tall; focus outlines stay visible on imagery cards
  (3px lime, inset offset).
