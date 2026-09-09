# 005 — Reveal the capabilities bento grid once, with a stagger

- **Status**: DONE
- **Commit**: c4ed538
- **Severity**: LOW
- **Category**: Missed opportunity (delight — rare/first-time tier)
- **Estimated scope**: 3 files, ~45 lines changed

## Problem

The capabilities bento grid — seven cards (`src/homepage-content.ts:191-227`), the
visual climax of the page — pops into existence all at once as the user scrolls to it.
This is the page's one legitimate delight-budget moment: seen at most once per visit,
below the fold, on a marketing page. Everything else on the page correctly avoids
scroll-triggered motion; this grid is the exception that earns it.

`src/sections/capabilities-section.tsx:66-100` — current structure (static, no hydration
directive):

```tsx
<div className="bento-grid">
  {content.items.map((capability) => (
    <article
      className={"bento-card bento-" + capability.name}
      key={capability.name}
    >
```

`src/pages/index.astro:14` — current:

```tsx
<CapabilitiesSection content={capabilitiesContent} />
```

## Target

One-time IntersectionObserver reveal: when the grid scrolls into view, each card
transitions from `opacity: 0; translate: 0 12px` to settled over 320 ms with the repo's
entrance curve `cubic-bezier(0.05, 0.7, 0.1, 1)`, staggered 50 ms per card (inside the
30–80 ms band). The reveal never re-triggers. It must never block interaction — cards
are fully interactive the moment they are visible.

Two hard requirements from this repo's architecture:

1. **Render without JS**: cards are only hidden *after* hydration arms the grid via a
   `data-armed` attribute. No JavaScript → fully visible grid, exactly as today.
2. **Reduced motion**: fade only — no translate, no stagger.

## Repo conventions to follow

- Entrance curve `cubic-bezier(0.05, 0.7, 0.1, 1)` — exemplar: header entrance at
  `src/index.css:19-23`. Marketing entrances may exceed the 300 ms UI budget; 320 ms
  matches the header mobile panel's duration (`conloca-header.tsx:354`).
- `client:load` islands — exemplar: `<AudienceSections … client:load />` at
  `src/pages/index.astro:13`.
- "Browser APIs belong in effects" (AGENTS.md) — the IntersectionObserver lives in
  `useEffect`, never at render time.
- The existing reduced-motion block is at `src/homepage.css:1335-1344`.

## Steps

1. `src/pages/index.astro:14` — hydrate the section:

   ```tsx
   <CapabilitiesSection content={capabilitiesContent} client:load />
   ```

2. `src/sections/capabilities-section.tsx` — add the reveal effect:

   ```tsx
   import { useEffect, useRef } from "react"
   // …inside CapabilitiesSection, before the return:
   const gridRef = useRef<HTMLDivElement>(null)
   useEffect(() => {
     const grid = gridRef.current
     if (!grid) return
     grid.dataset.armed = ""
     const observer = new IntersectionObserver(
       (entries) => {
         if (entries.some((entry) => entry.isIntersecting)) {
           grid.dataset.revealed = ""
           observer.disconnect()
         }
       },
       { threshold: 0.15 },
     )
     observer.observe(grid)
     return () => observer.disconnect()
   }, [])
   ```

   and on the grid element:

   ```tsx
   <div className="bento-grid" ref={gridRef}>
   ```

3. `src/homepage.css` — after the `.bento-card` rule (line 511) add:

   ```css
   .bento-grid[data-armed] .bento-card {
     opacity: 0;
     translate: 0 12px;
   }
   .bento-grid[data-revealed] .bento-card {
     opacity: 1;
     translate: none;
     transition:
       opacity 320ms cubic-bezier(0.05, 0.7, 0.1, 1),
       translate 320ms cubic-bezier(0.05, 0.7, 0.1, 1);
   }
   .bento-grid[data-revealed] .bento-card:nth-child(2) { transition-delay: 50ms; }
   .bento-grid[data-revealed] .bento-card:nth-child(3) { transition-delay: 100ms; }
   .bento-grid[data-revealed] .bento-card:nth-child(4) { transition-delay: 150ms; }
   .bento-grid[data-revealed] .bento-card:nth-child(5) { transition-delay: 200ms; }
   .bento-grid[data-revealed] .bento-card:nth-child(6) { transition-delay: 250ms; }
   .bento-grid[data-revealed] .bento-card:nth-child(7) { transition-delay: 300ms; }
   ```

4. `src/homepage.css` — inside the reduced-motion block (line 1335):

   ```css
   .bento-grid[data-armed] .bento-card {
     translate: none;
   }
   .bento-grid[data-revealed] .bento-card {
     transition: opacity 320ms ease;
     transition-delay: 0ms;
   }
   ```

## Boundaries

- Do NOT animate on every scroll — `observer.disconnect()` after the first reveal is
  load-bearing.
- Do NOT add scroll-driven CSS (`animation-timeline: view()`) — cross-browser support is
  not guaranteed for this audience; the IntersectionObserver path is the boring, safe
  one.
- Do NOT stagger via inline styles or CSS custom properties on each card — the
  `nth-child` rules keep card markup untouched. If the content ever grows beyond 7
  cards, extra cards simply reveal with zero delay; that is acceptable, not a bug.
- Do NOT hide cards without `data-armed` — a static, un-hydrated render must show the
  full grid.
- `threshold: 0.15` is deliberate (15 % of the grid visible before revealing); do not
  lower it to 0 or cards will start animating while still below the fold.
- If the cited excerpts have drifted since c4ed538, STOP and report.

## Verification

- **Mechanical**: `bun run lint && bun run typecheck` pass; `bun run test` passes;
  `bun run build` succeeds and the built HTML still contains fully visible card markup
  (no `data-armed` in the static HTML — it is added by hydration only).
- **Feel check**: `bun run dev`, homepage:
  - Scroll to capabilities at normal speed: cards cascade in a left-to-right wave,
    each trailing the previous by a hair; the whole reveal completes in ~620 ms.
  - Scroll past and back: no re-animation, ever.
  - Throttle CPU 4× in DevTools and reload: the reveal still plays smoothly (CSS
    transitions, compositor-side `opacity`/`translate`).
  - DevTools → Rendering → `prefers-reduced-motion: reduce`: cards fade in together,
    no rise, no wave.
  - Disable JavaScript and reload: the grid renders fully visible.
- **Done when**: the grid reveals once with a 50 ms stagger, reduced motion flattens it
  to a plain fade, no-JS renders visible, and lint/typecheck/tests/build are green.
