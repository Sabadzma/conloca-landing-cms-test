# ConlocaToc contract

Import `ConlocaToc`, `ConlocaTocProps`, and `ConlocaTocItem` from `@conloca-design-system/components/conloca-toc`.

- Inputs: `items` is a readonly array of `{ id, title }`; each entry renders as a numbered anchor (`#id`) with a zero-padded two-digit number generated from its position. `label` (default `"Contents"`) is the visible label and the navigation landmark's accessible name; the label renders uppercase per Figma.
- Responsive behavior: hidden below 1024 pixels. At 1024 pixels and above it is a sticky (`top: 72px`) flex column capped at 320 pixels that shares a row with the page's prose column; the parent must provide the row layout.
- States: hover and pressed darken both the number (`fg-softer`) and the title (`fg-soft`) through their semantic `-hovered`/`-pressed` tokens; these are native interaction states, not public variants. Every row carries a 1px `--color-stroke-strong` top hairline.
- Outputs: forwards nav attributes and a ref to the `<nav>`. Links are plain anchors; no callbacks.
- Accessibility: native navigation landmark with the configurable `label` as its accessible name; links keep visible keyboard focus styles.
- Astro usage: renders as static HTML and needs no hydration.

```tsx
<ConlocaToc
  label="Contents"
  items={[
    { id: "definitions", title: "Definitions" },
    { id: "security", title: "Security" },
  ]}
/>
```
