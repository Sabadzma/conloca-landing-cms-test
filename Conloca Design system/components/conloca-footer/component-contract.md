# ConlocaFooter contract

Import `ConlocaFooter`, `ConlocaFooterProps`, and the supporting footer types from `@conloca-design-system/components/conloca-footer`.

- Inputs: `navigationItems` is a readonly array of `{ label, url }`. `action` accepts `{ label, url?, onClick?, disabled? }`, defaults to the Figma placeholder button, and can be hidden with `false`. `logoUrl`, `logoLabel`, and `navigationLabel` customize link destinations and accessible names.
- Responsive behavior: at 1024 pixels and above, the logo and navigation row share one line. From 640 to 1023 pixels, the navigation row sits below the logo and its links wrap when needed. Below 640 pixels, the action moves below the wrapping 14-pixel navigation links. The inner footer fills its parent up to 1424 pixels.
- Outputs: forwards footer attributes and a ref to the `<footer>`. Navigation and logo links use their supplied URLs; the action forwards its click handler.
- Accessibility: the root uses the native footer landmark, navigation has a configurable accessible label, the logo link has a configurable label, and all links and the action have visible keyboard focus styles.

```tsx
<ConlocaFooter
  navigationItems={[
    { label: "Product", url: "/product" },
    { label: "Pricing", url: "/pricing" },
  ]}
  action={{ label: "Get started", url: "/signup" }}
/>
```
