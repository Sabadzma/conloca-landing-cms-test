# 001 — Animate the dialog popup entrance and exit

- **Status**: DONE
- **Commit**: c4ed538
- **Severity**: MEDIUM
- **Category**: Missed opportunity (preventing a jarring change / spatial consistency)
- **Estimated scope**: 1 file, ~3 lines changed

## Problem

The video dialog's backdrop fades in and out (150 ms, `data-[starting-style]`), but the
dialog panel itself appears and disappears instantly. The page's primary conversion
interaction (hero video → dialog) therefore looks half-finished: the scrum animates,
the content pops.

`Conloca Design system/components/conloca-dialog/conloca-dialog.tsx:41-49` — current:

```tsx
<DialogPrimitive.Popup
  {...props}
  ref={ref}
  data-slot="conloca-dialog"
  className={cn(
    "fixed top-1/2 left-1/2 z-50 w-[calc(100%-32px)] max-w-[1120px] -translate-x-1/2 -translate-y-1/2 rounded-[20px] bg-[var(--color-bg-surface-initial)] p-[16px] text-[var(--color-fg-strong-default-initial)] outline-none",
    className,
  )}
>
```

## Target

The popup fades in while scaling from `0.95` to `1` over 200 ms, and exits the same way
(symmetric path). Modals are exempt from trigger-anchored origins — `scale` from center
is correct here. Under `prefers-reduced-motion: reduce`, the opacity fade remains and
the scale snaps instantly (gentler, not zero).

Resulting class list (only the first line of `className` changes):

```tsx
"fixed top-1/2 left-1/2 z-50 w-[calc(100%-32px)] max-w-[1120px] -translate-x-1/2 -translate-y-1/2 rounded-[20px] bg-[var(--color-bg-surface-initial)] p-[16px] text-[var(--color-fg-strong-default-initial)] outline-none transition-[opacity,scale] duration-200 ease-[cubic-bezier(0.05,0.7,0.1,1)] data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 motion-reduce:transition-[opacity]",
```

**Why `scale` and not `transform` in the transition list**: this repo uses Tailwind CSS
v4, where `scale-95` emits the native CSS `scale` property (not `transform: scale(...)`).
A `transition-[opacity,transform]` list would transition nothing. `scale` composes with
the existing `-translate-x-1/2 -translate-y-1/2` because translate is also a native
property in v4 — no conflicts.

## Repo conventions to follow

- Base UI `data-[starting-style]` / `data-[ending-style]` entry-exit pattern with
  `motion-reduce:` handling — exemplar: the backdrop directly above the popup at
  `conloca-dialog.tsx:37-40`, and the header mobile panel at
  `Conloca Design system/components/conloca-header/conloca-header.tsx:354`.
- Easing: `cubic-bezier(0.05, 0.7, 0.1, 1)` is this repo's entrance curve (header
  entrance in `src/index.css:21`, mobile panel at `conloca-header.tsx:354`). Reuse it;
  do not introduce a new cubic-bezier.
- Duration 200 ms sits inside the modal budget (200–500 ms) and the UI ceiling of 300 ms.

## Steps

1. In `Conloca Design system/components/conloca-dialog/conloca-dialog.tsx`, extend the
   `DialogPrimitive.Popup` base class string (the first argument to `cn`, line 46) by
   appending exactly:
   `transition-[opacity,scale] duration-200 ease-[cubic-bezier(0.05,0.7,0.1,1)] data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 motion-reduce:transition-[opacity]`
2. No other changes. Backdrop, close button, and `ConlocaDialogTitle` stay as they are.

## Boundaries

- Do NOT touch the backdrop (`conloca-dialog.tsx:37-40`) — its 150 ms fade is correct.
- Do NOT change markup/structure — motion properties only.
- Do NOT add dependencies (no motion library; CSS transitions are sufficient).
- Do NOT retime the backdrop to match the popup's 200 ms — mismatched scrim/panel
  durations are normal and the backdrop is faster intentionally.
- If the popup's current class string does not match the excerpt above (drift since
  commit c4ed538), STOP and report instead of improvising.

## Verification

- **Mechanical**: `bun run lint && bun run typecheck` pass; `bun run test` passes (the
  existing dialog/section tests do not assert on these classes, so no test changes are
  expected).
- **Feel check**: `bun run dev`, open the homepage, click the hero video poster, and
  confirm:
  - The panel materializes — it grows the last 5 % while fading in, it does not pop.
  - Closing (Escape, close button, backdrop click) reverses the same path: fade + slight
    shrink, never a jump cut.
  - Spam open/close: the transition retargets from its mid-state (CSS transition), never
    restarts from zero.
  - DevTools → Rendering → emulate `prefers-reduced-motion: reduce`: the fade remains,
    the scale change disappears (panel appears at full size, fading only).
  - DevTools → Animations panel at 10 % speed: confirm the curve is the repo's entrance
    ease (fast start, long settle), not a linear ramp.
- **Done when**: the popup visibly eases in/out on both open and close, reduced motion
  keeps the opacity fade, and lint/typecheck/tests are green.
