# ConlocaHeader contract

Import `ConlocaHeader`, `ConlocaHeaderProps`, and the supporting header types from `@conloca-design-system/components/conloca-header`.

- Inputs: `menuItems` is a readonly array of `{ label, url }`. `transparent` defaults to `false`. `primaryButton` and `secondaryButton` accept `{ label, url?, onClick?, disabled? }`; each defaults to its corresponding Figma placeholder and can be hidden with `false`.
- Responsive behavior: desktop navigation is visible at 1024 pixels and above. A menu trigger replaces it below 1024 pixels. The secondary action is hidden below 640 pixels; the primary action remains visible.
- Entrance motion: whenever the header mounts, it moves from above its resting position while fading from 0% to 100% opacity over 500 milliseconds with `cubic-bezier(0.05, 0.7, 0.1, 1)`. The animation is disabled when the user prefers reduced motion.
- Responsive menu: below 1024 pixels, the trigger opens an animated, full-width navigation panel that overlays the page beneath the header instead of pushing content down. A dimmed scrim covers the page below the header (the header itself stays undimmed) while the menu is open; page scrolling is locked, and the menu closes on Escape, on scrim click, on link selection, or when the viewport reaches 1024 pixels. Items remain in one right-aligned column at every compact breakpoint and use the Figma-defined 64-pixel row height.
- State: omit `menuExpanded` for internal state and optionally set `defaultMenuExpanded`. For controlled state, pass `menuExpanded` and update it from `onMenuExpandedChange`. `menuControls` optionally overrides the generated panel ID; `onMenuClick` observes trigger clicks.
- Outputs: forwards header attributes and a ref to the `<header>`. Links use their supplied URLs; actions forward their click handlers.
- Accessibility: the trigger supplies `aria-expanded` and `aria-controls`, changes its accessible label between the open and close labels, and removes closed panel content from keyboard navigation. Customize `navigationLabel`, `mobileNavigationLabel`, `menuButtonLabel`, and `menuCloseButtonLabel` when needed.
- Composition: `ConlocaHeaderNavigationItem` is public for matching links inside a Base UI navigation-menu list. It accepts `label`, `url`, and `transparent` plus Base UI link props.
- Astro usage: navigation links and the CSS entrance animation render in static HTML. The responsive menu, controlled state, and callbacks require the header to be an island root or a descendant of a hydrated React island.

```tsx
<ConlocaHeader
  menuItems={[
    { label: "Product", url: "/product" },
    { label: "Pricing", url: "/pricing" },
  ]}
  primaryButton={{ label: "Get started", url: "/signup" }}
  secondaryButton={false}
/>
```
