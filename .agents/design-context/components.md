# Components

Design-system components live in `Conloca Design system/components/conloca-*` and
are imported only via `@conloca-design-system/components/<name>` (never Base UI
directly). Each folder carries a `component-contract.md` with the authoritative
API; this file adds usage context. All components: named exports, forwarded refs,
`className`, `data-slot` attributes, cva variants only where Figma defines them,
Base UI `render` composition (no Radix `asChild`).

## ConlocaButton

Source: `components/conloca-button/conloca-button.tsx` · Base UI `Button`

Variants (cva): `primary` (stone-800 fill, inverted text, stroke-accent outline),
`secondary` (white fill, stroke-strong outline), `iconWithBackground`,
`iconOnly`, `link` (Roboto Mono uppercase text link, underline on hover).
Sizes: `default` (14px text, 10px padding) and `small` (12px text, 8px padding);
**default props are `variant="primary" size="small"`** — compact by default.

- Radius 8px; 110ms linear color/outline transitions; focus-visible 2px
  stroke-accent outline.
- `icon` prop: `true` renders the default `plus-02` icon (12px small / 14px
  default), a `ConlocaIconName`, or `false`. Icons lazy-load via `React.lazy` +
  Suspense with a sized placeholder so text-only buttons never pull the SVG
  catalog.
- Usage: header actions, footer action, plan CTAs. For anchor CTAs in sections,
  use the app-level `SectionLink` (`src/sections/section-link.tsx`), which
  applies `conlocaButtonVariants` to an `<a>`. Plan CTAs override to
  `h-[44px] w-full rounded-[12px] font-bold` per Figma.

## ConlocaSegmentedControl

Source: `components/conloca-segmented-control/conloca-segmented-control.tsx` ·
Base UI `ToggleGroup` (single value)

Pill container: 14px radius, 2px padding, 2px gaps, sliding indicator measured
and animated in JS. Variant `transparent` for use on imagery panels (feature
banners). Used for: audience switching (hero + each feature banner) and billing
interval (monthly/annual) on both pricing surfaces. Hidden below 1024px in the
hero/features (`.hero-audience`, `.feature-audience` `display: none`).

## ConlocaHeader

Source: `components/conloca-header/conloca-header.tsx` · Base UI
`NavigationMenu` + `Collapsible`

- 80px-tall bar (16px/20px padding by width), container capped at 1440px,
  32px padding at ≥1024px.
- Desktop nav appears at ≥1024px (`min-[1024px]:block`); below that a menu
  button (iconOnly button) opens a full-width collapsible panel with right-
  aligned bold 16px links, 64px rows. Panel animates height/opacity/translate
  over 320ms with `cubic-bezier(0.05, 0.7, 0.1, 1)`.
- Variant `transparent` (inverted text) for image heroes — used on `/pricing`,
  where the header is positioned absolutely over the hero. Below 1024px a
  transparent header reverts to surface colors and static position.
- Enters with a 500ms `conloca-header-appear` animation (translateY from −100%),
  suppressed under reduced motion. Wrapper islands live in `src/islands/`.

## ConlocaFooter

Source: `components/conloca-footer/conloca-footer.tsx` · native markup

Dark panel: `bg-primary` (stone-800) inverted text, max-width 1424px, radius
24px (20px mobile), 24px padding, floating inside 8px (4px mobile) page gutters.
Desktop: space-between row — logo (28px), nav (31px gaps), secondary button.
Stacks at <1024px; the action wraps to its own row on small screens. Static HTML,
no hydration. Every page ends with it.

## ConlocaDialog

Source: `components/conloca-dialog/conloca-dialog.tsx` · Base UI `Dialog`

Used once: the homepage YouTube overlay. 16px radius black frame, iframe at 16:9
capped at `100dvh − 140px`. Closes on Escape/backdrop/button, traps and restores
focus, removes the iframe (stops playback) on close.

## ConlocaCarouselProgress

Source: `components/conloca-carousel-progress/conloca-carousel-progress.tsx` ·
Base UI `Progress`

2px × 20px vertical track (1000px radius): track `stroke-strong`, fill
`stroke-stronger`. Numeric `value` 0–100 drives the 8s autoplay fill. In compact
layouts the indicator rail rotates −90° into a horizontal bar
(`.hero-indicators` at ≤1023px).

## ConlocaIcon

Source: `components/conloca-icon/conloca-icon.tsx`

Lazy catalog over the 1583 exact Figma SVGs in `Conloca Design system/icons/`
via `import.meta.glob` + Suspense. **Application code should not use it** —
import exact files statically: `import CheckIcon from
"@conloca-design-system/icons/check-01.svg?react"`. No aliases, no fallbacks,
no third-party icon packages. Decorative icons: `aria-hidden="true"`; meaningful
ones get a label/title. `conloca-icon/icon-names.generated.ts` lists all names.

## Section-level building blocks (app code, `src/sections/`)

- **SectionLink** — anchor styled with button variants (`primary`/`secondary`,
  `default`/`small`). The standard section CTA.
- **HeroCarousel** — italic rotating message + progress indicators
  (`src/sections/hero-carousel.tsx`, `src/use-carousel-playback.ts`).
- **Plan card** (`.plan-card` + `.plan-summary` + `.plan-features`) — white
  summary well (radius 18px, soft shadow) inside a sunken-gradient shell (radius
  26px, 8px padding); featured plan (`.plan-pro`) swaps in an olive-50 gradient
  and a 2px lime→white gradient ring via masked `::before`. Reused by the pricing
  page's plans section.
- **Blog/article card** (`.blog-card`, `.article-related-card`) — imagery card
  with 10–20% black scrim, bottom-anchored inverted copy, mono metadata. Desktop
  variants `--full` (image behind everything) and `--split` (copy left, rounded
  image right half).
- **Terminal** (`.hiw-terminal`) — sunken well, white header with package-manager
  tabs (active = lime underline), mono command line with lime prompt, copy
  button. Page-local to how-it-works.
- **Badge** (`.astro-badge`, `.plan-badge`) — small uppercase pill/chip on lime
  tints; `astro-badge` is 12px radius lime-50/lime-600, `plan-badge` 8px radius
  lime-300 fill.

## Not using (yet)

No card, accordion, tabs, form, or testimonial primitives exist in the design
system beyond the list above. The segmented control covers tab-like switching;
new primitives must start from shadcn `base-nova` scaffolds and be rebuilt to
Figma spec per `Conloca Design system/README.md`.
