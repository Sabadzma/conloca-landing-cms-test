# Interaction and motion

The site has no animation library; all motion is CSS transitions/animations plus
two scroll-driven React effects. Motion is functional and short.

## Durations and easings

Classification: Canonical

| Token | Value | Used for |
| --- | --- | --- |
| Hover/press color shifts | 110ms linear | buttons, nav items, play button, card focus outline width |
| Menu icon morph | 180ms ease-out | header hamburger ↔ close |
| Feature crossfade | 240ms ease | pinned feature banners |
| Mobile nav panel | 320ms `cubic-bezier(0.05, 0.7, 0.1, 1)` | header collapsible (height + opacity + −8px translate) |
| Header entrance | 500ms `cubic-bezier(0.05, 0.7, 0.1, 1)` | `conloca-header-appear` (opacity + translateY from −100%) |

That custom cubic-bezier (0.05, 0.7, 0.1, 1) is the site's signature easing —
an aggressive ease-out. Hover states change background color only; nothing
lifts, scales, or shadows on hover (the play button darkens its scrim
`#0003`→`#0006`).

## Reduced motion

Classification: Canonical

Every animated surface honors `prefers-reduced-motion`: global
`scroll-behavior: auto` override, transitions removed (`.video-play`,
blog/related cards), header/menu animations suppressed via `motion-reduce:`
utilities or media queries, and the hero carousel stops autoplaying (starts in
`reducedMotion: true` state until the media query confirms otherwise).

## Scroll-driven sequences

Classification: Recurring

- **Homepage features** (`src/sections/audience-sections.tsx`): scroll position
  within the 400vh track maps to the active feature index; sections crossfade.
  Listener is passive scroll + resize, updates via `requestAnimationFrame`.
- **HIW step flow** (`src/sections/how-it-works-page-sections.tsx`): same
  pattern; also drives the lime `scaleX` progress bar directly from scroll
  fraction (`will-change: transform`).

No parallax, no scroll-triggered reveals beyond these two pinned sequences.

## Hero carousel

Classification: Canonical behavior

8-second autoplay interval (`src/use-carousel-playback.ts`) driving both the
2px progress fill and slide advance from one elapsed-time clock. Pauses on:
hover, focus within, explicit pause button, hidden tab (`visibilitychange`),
reduced motion. Resumes remaining time; selecting a message or switching
audience resets. Indicators are real buttons with `aria-pressed`; the pause
control is visually hidden until focused. The active indicator grows
(`flex-grow: 1.174`).

## Dialog

Classification: Canonical behavior

The video dialog (Base UI Dialog) traps focus, closes on Escape/backdrop/close
button, restores focus to the triggering element, and unmounts the YouTube
iframe on close so playback stops. YouTube owns keys inside its cross-origin
iframe; Shift+Tab returns to the close control (recorded in the ledger).

## Interactive states

Classification: Canonical

Semantic tokens encode the state machine: every interactive color role has
`initial/hovered/pressed/disabled` variants (see `semantics.css`), and
components consume them directly — e.g. buttons use
`bg-primary-initial → hovered → pressed`, nav items use
`bg-surface-hovered/pressed`. Focus is always a visible outline (see
`foundations.md`), never color-only. Disabled = `pointer-events: none` +
`cursor: not-allowed` + disabled tokens.

## Carousel progress component

`ConlocaCarouselProgress` exposes a 0–100 `value` while preserving Base UI
Progress semantics; the fill animates via the clock, not CSS transitions.
