# ConlocaCarouselProgress

Import `ConlocaCarouselProgress` and `ConlocaCarouselProgressProps` from `@conloca-design-system/components/conloca-carousel-progress`.

- `active` defaults to true and matches Figma's Active axis. The component preserves Base UI progress semantics, root props, `className`, and its div ref.
- The natural size is 2×20 pixels. `value` is a percentage from 0 to 100, defaulting to 40 for the Figma snapshot. Values are clamped to that range; inactive markers remain empty. The fill grows from the top and can cover the entire stretched track.
- Give meaningful standalone progress an accessible name. Use `aria-hidden` when the marker decorates a separately named carousel button.
- It emits no events and does not advance or time a carousel itself.
- Astro usage: the supplied value renders fully to static HTML. Hydrate the carousel state owner when the value must change in the browser; this passive component does not need its own island.

```tsx
<ConlocaCarouselProgress
  active
  value={65}
  aria-label="Current slide progress"
/>
```
