# 004 — Add press feedback to all buttons and CTA links

- **Status**: DONE
- **Commit**: c4ed538
- **Severity**: LOW
- **Category**: Missed opportunity (feedback)
- **Estimated scope**: 1 file, 1 line changed

## Problem

Every button and CTA link on the site transitions its colors on hover/press (110 ms),
but nothing confirms the *press* itself — the interface gives color feedback yet no
physical one. The fix lands in the shared variant string, so every consumer
(`ConlocaButton`, and every CTA via `SectionLink` which reuses `conlocaButtonVariants`)
gets it at once.

`Conloca Design system/components/conloca-button/conloca-button.tsx:15-16` — current:

```tsx
const conlocaButtonVariants = cva(
  "group/button inline-flex shrink-0 appearance-none items-center justify-center whitespace-nowrap rounded-[8px] outline outline-1 outline-offset-0 select-none transition-[background-color,color,outline-color,text-decoration-color] duration-[110ms] ease-linear focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-stroke-accent)] disabled:pointer-events-none disabled:cursor-not-allowed",
```

## Target

`:active` scales the button to `0.97` using the same 110 ms duration already on the
element — within the press-feedback budget (100–160 ms) and the subtle range
(0.95–0.98). Under reduced motion the scale is removed; the existing color transitions
remain, so feedback is gentler, not zero.

The base string becomes (two changes: `scale` added to the transition list, and the
`active:`/`motion-reduce:` classes appended):

```
"group/button inline-flex shrink-0 appearance-none items-center justify-center whitespace-nowrap rounded-[8px] outline outline-1 outline-offset-0 select-none transition-[background-color,color,outline-color,text-decoration-color,scale] duration-[110ms] ease-linear focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-stroke-accent)] active:scale-[0.97] motion-reduce:active:scale-100 disabled:pointer-events-none disabled:cursor-not-allowed"
```

**Why `scale` in the transition list, not `transform`**: this repo uses Tailwind CSS v4,
where `scale-[0.97]` emits the native CSS `scale` property. Transitioning `transform`
would animate nothing. (Note for a future audit: `conloca-header.tsx:339,345` makes
this exact mistake — `transition-[opacity,transform]` over v4 `rotate`/`scale`
utilities — which is why its menu-icon morph may only be crossfading. Out of scope here;
flagged as a separate corrective finding.)

## Repo conventions to follow

- 110 ms `ease-linear` is already on the element — do not introduce a new duration or
  curve for this.
- Reduced-motion handling via `motion-reduce:` variant — exemplar:
  `conloca-dialog.tsx:39` and `conloca-segmented-control.tsx:219`.
- No hover gating needed: `:active` is a press state, not a hover state, so the
  `(hover: hover) and (pointer: fine)` gate does not apply.

## Steps

1. In `Conloca Design system/components/conloca-button/conloca-button.tsx:16`, replace
   `transition-[background-color,color,outline-color,text-decoration-color]` with
   `transition-[background-color,color,outline-color,text-decoration-color,scale]`.
2. In the same string, insert `active:scale-[0.97] motion-reduce:active:scale-100`
   immediately after the `focus-visible:` group and before
   `disabled:pointer-events-none`.

## Boundaries

- Do NOT add press feedback anywhere else (header nav links, carousel indicators,
  close buttons) — they have their own conventions; this plan covers the shared button
  variant only.
- Do NOT change the duration, the curve, or the scale amount — 110 ms / `ease-linear` /
  `0.97` are deliberate.
- Do NOT use `transition-all` under any circumstance.
- `SectionLink` (`src/sections/section-link.tsx:22`) consumes `conlocaButtonVariants`
  unchanged — do not modify it; it inherits the fix.
- If the base string has drifted since c4ed538, STOP and report.

## Verification

- **Mechanical**: `bun run lint && bun run typecheck` pass; `bun run test` passes.
- **Feel check**: `bun run dev`, and confirm:
  - Pressing and holding any CTA (hero actions, feature actions, plan cards) visibly
    compresses the button ~3 %; releasing springs it back within the same 110 ms.
  - Spam-press: the transition retargets mid-press, never jumps.
  - Keyboard activation (Tab + Space): no visual weirdness; `:active` simply doesn't
    linger, which is correct.
  - DevTools → Rendering → `prefers-reduced-motion: reduce`: press still changes colors
    instantly, with no scale.
- **Done when**: every element using `conlocaButtonVariants` scales on `:active`,
  reduced motion drops only the scale, and lint/typecheck/tests are green.
