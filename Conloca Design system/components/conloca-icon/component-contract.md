# ConlocaIcon contract

Import `ConlocaIcon`, `ConlocaIconProps`, `ConlocaIconSource`, and `ConlocaIconName` from `@conloca-design-system/components/conloca-icon`.

- Inputs: `name` is a generated union of exact SVG filenames without the `.svg` extension. `size` sets both dimensions and defaults to 24 pixels. `color`, `className`, `style`, span attributes, and a custom `data-slot` are supported.
- Rendering: the selected local SVG renders inside a span, inherits text color when its supplied artwork supports it, and preserves the requested dimensions while loading.
- Accessibility: omit `aria-label` for decorative use; the wrapper then receives `aria-hidden`. Supplying `aria-label` gives the wrapper `role="img"`. The nested SVG is always hidden from assistive technology.
- Outputs: forwards a ref to the wrapper span and emits no events.
- Astro usage: the selected SVG resolves during static generation and needs no hydration. When rendered inside an interactive control, hydrate the control's React state owner rather than the icon itself.

```tsx
<ConlocaIcon name="search-01" aria-label="Search" size={20} />
```
