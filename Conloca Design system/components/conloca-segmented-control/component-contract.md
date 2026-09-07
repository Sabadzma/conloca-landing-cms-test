# ConlocaSegmentedControl contract

Import `ConlocaSegmentedControl`, `ConlocaSegmentedControlProps`, `ConlocaSegmentedControlOption`, and `ConlocaSegmentedControlOptions` from `@conloca-design-system/components/conloca-segmented-control`.

- Inputs: Base UI toggle-group props plus `options`, `value`, `defaultValue`, `onValueChange`, `transparent`, and `className`. `options` is an array of labels and unique string values; every supplied option is rendered.
- Defaults: `options` is “Item 1” and “Item 2”, the first option is selected, and `transparent={false}`.
- Outputs: `onValueChange` receives the newly selected string value and Base UI event details. A ref points to the rendered group element.
- States and variants: exactly one option remains selected whenever options exist. Selection maps to Base UI pressed state; Figma's `Transparent=False/True` axis maps to the `transparent` prop. All disabled option text uses `--color-fg-disabled-default`.
- Motion: the active background and shadow slide to the selected option over 110 milliseconds with `cubic-bezier(0.56, 0, 0, 0.99)`. Motion is disabled when the user prefers reduced motion.
- Accessibility: provide an accessible group name with `aria-label` or `aria-labelledby`. The options are buttons with `aria-pressed`; Tab enters the control, arrow keys move focus, and Enter or Space selects. Use the transparent variant only on a dark surface that preserves text contrast.
- Composition: labels accept React nodes, and the component renders every supplied option horizontally.

```tsx
<ConlocaSegmentedControl
  aria-label="Billing interval"
  options={[
    { label: "Monthly", value: "monthly" },
    { label: "Annual", value: "annual" },
  ]}
  value={interval}
  onValueChange={setInterval}
/>
```
