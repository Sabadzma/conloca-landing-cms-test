# 002 — Crossfade content on audience switch

- **Status**: DONE
- **Commit**: c4ed538
- **Severity**: MEDIUM
- **Category**: Missed opportunity (state indication / preventing a jarring change)
- **Estimated scope**: 2 files, ~25 lines changed

## Problem

The developers/editors segmented control is the homepage's signature interaction — it
appears in the hero and in every feature section. Its indicator slides to the selected
option (110 ms), but everything the switch *controls* teleports in one frame: the hero
heading, the hero carousel message, and each feature's title/description.

`src/sections/audience-sections.tsx:22-24` — current:

```tsx
const selectAudience = useCallback((value: string) => {
  if (value === "developers" || value === "editors") setAudience(value)
}, [])
```

`src/sections/audience-sections.tsx:60` — current:

```tsx
<div className="audience-sections" data-audience={audience}>
```

## Target

A two-phase crossfade: on selection, the outgoing copy fades to `opacity: 0` over
110 ms, the audience state swaps, and the incoming copy fades back in over 110 ms.
Total 220 ms, inside the UI budget. Under `prefers-reduced-motion: reduce` the swap is
instant with no fade (this is a state change, not decoration — instant is the correct
reduced-motion behavior here).

The audience-scoped background CSS variables on `.audience-sections[data-audience=…]`
still swap instantly. Crossfading background images would need overlay layers; that is
explicitly out of scope — the copy fade carries the state change.

## Repo conventions to follow

- 110 ms `ease-linear` is the repo's micro-interaction duration (`conloca-button.tsx:16`,
  header nav items at `conloca-header.tsx:30`). Reuse it — do not add a new duration.
- The wrapper `div.audience-sections` already owns audience-scoped CSS state via
  `data-audience` (`src/homepage.css:66-79`); the new `data-transitioning` attribute
  follows the same pattern.
- Match-media usage for reduced motion already exists in
  `src/sections/hero-carousel.tsx:47-51` — imitate it.
- Sections render without a DOM (Astro SSR): the `window.matchMedia` call must stay
  inside the event handler, never at render time.

## Steps

1. `src/sections/audience-sections.tsx` — add a `transitioning` state and a timeout ref,
   and replace `selectAudience`:

   ```tsx
   const [transitioning, setTransitioning] = useState(false)
   const transitionTimeout = useRef(0)
   useEffect(() => () => window.clearTimeout(transitionTimeout.current), [])
   const selectAudience = useCallback((value: string) => {
     if (value !== "developers" && value !== "editors") return
     if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
       setAudience(value)
       return
     }
     setTransitioning(true)
     window.clearTimeout(transitionTimeout.current)
     transitionTimeout.current = window.setTimeout(() => {
       setAudience(value)
       setTransitioning(false)
     }, 110)
   }, [])
   ```

   (`useEffect`, `useRef`, `useState` are already imported at the top of the file.)
2. Same file, wrapper div — add the data attribute:

   ```tsx
   <div
     className="audience-sections"
     data-audience={audience}
     data-transitioning={transitioning || undefined}
   >
   ```

3. `src/homepage.css` — append near the audience rules (after line 79, the
   `.audience-sections[data-audience="editors"]` block):

   ```css
   .hero-heading-group h1,
   .hero-message,
   .feature--active .feature-text {
     transition: opacity 110ms ease-linear;
   }
   .audience-sections[data-transitioning] .hero-heading-group h1,
   .audience-sections[data-transitioning] .hero-message,
   .audience-sections[data-transitioning] .feature--active .feature-text {
     opacity: 0;
   }
   ```

   Only the *active* feature's copy fades — inactive features are already `opacity: 0`
   (`.feature`, `homepage.css:298-303`), so fading their text is invisible and wasted.

## Boundaries

- Do NOT animate the segmented-control indicator — it already slides correctly.
- Do NOT try to crossfade the audience background images (overlay layers, new DOM) —
  out of scope.
- Do NOT fade `.hero-message` with a keyed remount — the carousel already remounts via
  `key={audience}` (`src/sections/hero-section.tsx:77`); the CSS above handles it.
- Do NOT debounce or block rapid toggles: the timeout is cleared and re-armed, so rapid
  switching retargets smoothly.
- If `selectAudience` no longer matches the excerpt above (drift since c4ed538), STOP
  and report.

## Verification

- **Mechanical**: `bun run lint && bun run typecheck` pass; `bun run test` passes
  (existing section tests assert content per audience, which still renders after the
  110 ms timeout — if a test reads content synchronously after clicking, it may need
  `vi.advanceTimersByTime(110)`; adjust only that assertion, not the component).
- **Feel check**: `bun run dev`, toggle Developers ↔ Editors in the hero, and confirm:
  - The heading breathes out and the new one breathes in — no instant text swap.
  - Rapid toggling never flashes stale text or restarts a visible jump; each toggle
    continues from the current opacity.
  - In a feature section, toggling fades that feature's title/description the same way.
  - DevTools → Rendering → emulate `prefers-reduced-motion: reduce`: the swap is instant,
    no fade at all.
- **Done when**: copy crossfades on every audience toggle (hero + all three features),
  reduced motion swaps instantly, and lint/typecheck/tests are green.
