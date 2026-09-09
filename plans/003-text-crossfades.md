# 003 — Fade in swapped text: carousel message and plan price

- **Status**: DONE
- **Commit**: c4ed538
- **Severity**: MEDIUM
- **Category**: Missed opportunity (preventing a jarring change)
- **Estimated scope**: 3 files, ~15 lines changed

## Problem

Two text swaps on the homepage hard-cut while adjacent elements animate:

1. **Hero carousel message** — the progress fill animates continuously beside it, but
   the message text swaps in one frame every 8 seconds
   (`src/sections/hero-carousel.tsx:94-97`):

   ```tsx
   <p className="hero-message" aria-live={paused ? "polite" : "off"}>
     <strong>{message[0]}</strong>
     {message[1]}
   </p>
   ```

2. **Plan price** — the billing segmented control slides its indicator (110 ms), but the
   price teleports between `$X` and `$X·12` (`src/sections/pricing-section.tsx:44-50`):

   ```tsx
   <p className="plan-price">
     <strong>
       {content.currency +
         plan.price * (billing === "annual" ? 12 : 1)}
     </strong>
     <span>{content.intervals[billing]}</span>
   </p>
   ```

## Target

Both elements fade in on swap using a keyed remount + `@starting-style`, no JS state.
The carousel message also rises 4 px as it enters (its change is ambient and deserves a
hint of movement); the price is opacity-only — no number-tween theater on a figure the
user is comparing.

- Carousel message: `opacity 0 → 1` + `translate 0 4px → 0`, 240 ms `ease` (the exact
  vocabulary of the existing `.feature` crossfade, `src/homepage.css:303`).
- Price: `opacity 0 → 1`, 240 ms `ease`.
- Reduced motion: message keeps the opacity fade and drops the translate; the price fade
  is already movement-free and needs no override.

## Repo conventions to follow

- 240 ms `ease` opacity crossfade — exemplar: `.feature` at `src/homepage.css:298-303`.
- Keyed remount for swapped content already exists: `key={audience}` on
  `<HeroCarousel>` at `src/sections/hero-section.tsx:77`.
- The existing reduced-motion block lives at `src/homepage.css:1335-1344` — add the
  message override there.
- `@starting-style` inside the rule (not a separate at-rule block) keeps each rule
  self-contained; Baseline 2024, safe for this marketing site.

## Steps

1. `src/sections/hero-carousel.tsx:94` — key the paragraph by slide so React remounts it
   on every slide change:

   ```tsx
   <p
     className="hero-message"
     key={slide}
     aria-live={paused ? "polite" : "off"}
   >
   ```

2. `src/sections/pricing-section.tsx:45` — key the price by billing interval:

   ```tsx
   <strong key={billing}>
   ```

3. `src/homepage.css` — after the `.hero-message` rules (line 152) add:

   ```css
   .hero-message {
     transition:
       opacity 240ms ease,
       translate 240ms ease;
     @starting-style {
       opacity: 0;
       translate: 0 4px;
     }
   }
   ```

   and after the `.plan-price strong` rules (line 740) add:

   ```css
   .plan-price strong {
     transition: opacity 240ms ease;
     @starting-style {
       opacity: 0;
     }
   }
   ```

4. `src/homepage.css` — inside the existing reduced-motion block (line 1335), alongside
   `.video-play`:

   ```css
   .hero-message {
     transition: opacity 240ms ease;
     @starting-style {
       opacity: 0;
       translate: none;
     }
   }
   ```

## Boundaries

- Do NOT animate the old message out — a true crossfade would need two overlapping
  live regions and would corrupt `aria-live` announcements. Fade-in only.
- Do NOT touch `use-carousel-playback.ts`, the indicators, or the pause button.
- Do NOT tween or count the price number — opacity only.
- Do NOT add `key` to any other element; remounting resets focus and state.
- `.hero-message` has `min-height: 81px` (`homepage.css:144`), so the remount causes no
  layout shift — do not remove that property.
- If the cited excerpts have drifted since c4ed538, STOP and report.

## Verification

- **Mechanical**: `bun run lint && bun run typecheck` pass; `bun run test` passes.
- **Feel check**: `bun run dev`, homepage:
  - Watch the hero carousel auto-advance (or click an indicator): the new message
    materializes with a slight rise instead of a cut; the `min-height` keeps the layout
    dead still.
  - Toggle Monthly ↔ Annual in pricing: each price fades in. There is no overlap ghost
    of the old price.
  - DevTools → Animations panel at 10 % speed: the message rise is 4 px, not a slide.
  - DevTools → Rendering → `prefers-reduced-motion: reduce`: message fades with no rise;
    price behavior unchanged.
- **Done when**: both swaps fade in on every trigger, no layout shift, reduced motion
  keeps only opacity, and lint/typecheck/tests are green.
