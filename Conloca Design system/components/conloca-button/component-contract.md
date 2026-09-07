# ConlocaButton contract

Import `ConlocaButton` and `ConlocaButtonProps` from `@conloca-design-system/components/conloca-button`.

- Inputs: native/Base UI button props plus `children`, `className`, `variant`, `size`, and one shared `icon` prop. Pass an icon name to choose the icon, `true` for the default plus icon, or `false` to hide it.
- Defaults: `variant="primary"`, `size="small"`, and `icon={true}`.
- Variants: `primary`, `secondary`, `iconWithBackground`, `iconOnly`, and `link`. Sizes: `default` and `small`.
- Outputs: forwards button events and a ref to the rendered element. It emits no custom events.
- Accessibility: give icon-only variants an `aria-label`; native `disabled`, focus, and keyboard behavior are preserved.
- Composition: `primary` and `secondary` render the selected icon before `children`; icon-only variants render only the selected icon; `link` renders `children` without an icon. At `size="default"`, icon-only variants use an 18 pixel icon with 8 pixels of padding on every side.

```tsx
<ConlocaButton variant="secondary" onClick={save}>Save</ConlocaButton>

<ConlocaButton aria-label="Add item" icon="plus-02" variant="iconOnly" />
```

Icon-bearing buttons load the existing icon catalog lazily through Suspense. The fallback reserves the icon dimensions; Astro static rendering waits for the exact SVG. Text-only buttons and links do not request the catalog. Public props, refs, and data slots are unchanged.
