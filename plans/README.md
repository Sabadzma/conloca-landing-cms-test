# Animation plans

Homepage motion improvements, written from the audit at commit `c4ed538`. Each plan is
self-contained: hand it to any agent (or `improve-animations execute plans/NNN-….md`)
with zero additional context.

| # | Title | Severity | Status |
|---|-------|----------|--------|
| 001 | Animate the dialog popup entrance and exit | MEDIUM | DONE |
| 002 | Crossfade content on audience switch | MEDIUM | DONE |
| 003 | Fade in swapped text: carousel message and plan price | MEDIUM | DONE |
| 004 | Add press feedback to all buttons and CTA links | LOW | DONE |
| 005 | Reveal the capabilities bento grid once, with a stagger | LOW | DONE |

## Recommended execution order

1. **001** — highest leverage: the conversion video dialog is a half-finished seam
   (backdrop fades, panel pops). One file, three minutes.
2. **002** — the site's signature interaction; the only plan that touches
   `audience-sections.tsx`.
3. **003** — same fade-in pattern applied twice; quick win after 002.
4. **004** — one-line change to the shared button variant.
5. **005** — largest scope (hydration boundary change); do it last so the earlier plans
   ship even if this one needs design sign-off.

## Dependencies

None. The plans touch disjoint code:

- 001 → `conloca-dialog.tsx`
- 002 → `audience-sections.tsx`, `homepage.css` (audience rules region)
- 003 → `hero-carousel.tsx`, `pricing-section.tsx`, `homepage.css` (`.hero-message`,
  `.plan-price`, reduced-motion block)
- 004 → `conloca-button.tsx`
- 005 → `index.astro`, `capabilities-section.tsx`, `homepage.css` (`.bento-*`, same
  reduced-motion block as 003)

Only 003 and 005 share a file (`homepage.css`, different rules plus the same
reduced-motion media block). Run them sequentially or merge their `homepage.css` hunks
manually if executed in parallel.

## Audited but not planned (per selection)

Corrective findings from the same audit, deliberately excluded from this batch:

- **F1** — `src/use-carousel-playback.ts` re-renders React 60×/s to drive a compositable
  `scaleY`; a WAAPI `element.animate()` fill would move it off the main thread.
- **F2** — repo-wide `motion-reduce:transition-none` nukes all feedback instead of
  fading gently.
- **F3** — dialog close button (`conloca-dialog.tsx:53`) is missing the repo's standard
  110 ms color transition.
- **F4** *(new, flagged during plan authoring)* — `conloca-header.tsx:339,345` uses
  `transition-[opacity,transform]` over Tailwind v4 `rotate-*`/`scale-*` utilities,
  which emit native `rotate`/`scale` properties. [INFERENCE from Tailwind v4 behavior —
  confirm in a browser] the menu-icon morph may be a plain crossfade, with the rotation
  snapping instantly.
