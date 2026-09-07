# ConlocaDialog

Import `ConlocaDialog`, `ConlocaDialogTrigger`, `ConlocaDialogContent`, and `ConlocaDialogTitle` from `@conloca-design-system/components/conloca-dialog`.

- Based on shadcn base-nova's Base UI dialog composition, with Conloca tokens and the exact local close SVG. This overlay was requested by the user; no dialog design was supplied in Figma.
- The root accepts Base UI dialog state and callbacks. Trigger, title, and content forward their native element refs and Base UI props. Content accepts `className` and `closeLabel` (default “Close dialog”).
- Always include a title, visually hidden when appropriate. Focus is trapped while open and restored on close. Escape, backdrop, and the close button dismiss the dialog. Closed portal content is unmounted.
- Use Trigger's `render` prop to compose with ConlocaButton. A controlled root can also be opened by existing page buttons.

```tsx
<ConlocaDialog>
  <ConlocaDialogTrigger>Open</ConlocaDialogTrigger>
  <ConlocaDialogContent>
    <ConlocaDialogTitle>Preview</ConlocaDialogTitle>
  </ConlocaDialogContent>
</ConlocaDialog>
```
