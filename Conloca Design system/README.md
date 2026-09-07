# Conloca Design system

This directory contains the reusable design-system source for the Conloca.

## Variables

The CSS variables are generated from the `Primitives` and `Semantics` collections in the [Conloca Figma file](https://www.figma.com/design/OxxksZFS8hzKoFTeSRdFGs/Conloca?node-id=2477-25023&p=f&t=NcHOAg8hPVrX6T73-0).

- `design tokens/primitives.css` contains all 150 variables from the `Primitives` collection's `Mode 1` mode.
- `design tokens/semantics.css` contains all 42 variables from the `Semantics` collection's `Light` mode.
- `design tokens/index.css` loads the collections in dependency order.

Figma names, hierarchy, and spelling are preserved. Figma's `/` hierarchy separators are converted to standard kebab-case CSS custom-property names: `color/stone/800` becomes `--color-stone-800`.

```css
.card {
  color: var(--color-fg-strong-default-initial);
  background: var(--color-bg-surface-initial);
  transition-timing-function: var(--motion-easing-easout-cubic);
}
```

Semantic aliases remain CSS `var()` references to primitive tokens, so changes to a primitive continue to flow through the same dependency relationships as in Figma.

## Components

Reusable components live in kebab-case `components/conloca-*` folders and are added
individually from their Figma specifications. Each folder keeps the implementation,
public export, Storybook stories, tests or fixtures, and a concise
`component-contract.md` together. Each component starts from shadcn's `base-nova` edition and
retains its Base UI primitive, Base UI composition utility, or native markup. The
scaffold's visual theme is removed before Conloca semantic tokens and exact,
component-local Figma measurements are applied.

Application code imports components through
`@conloca-design-system/components/<component>` and never imports Base UI directly.
Components use named exports, preserve refs, accept `className`, expose the relevant
Base UI or native props, and include stable `data-slot` attributes. Variants and
sizes are added only when Figma defines them and are modeled with
`class-variance-authority`. Base UI's `render` model provides composition; the
Radix `asChild` pattern is not used.

The Conloca prefix is part of every component's public identity. A button therefore
lives at `components/conloca-button/conloca-button.tsx`, exports `ConlocaButton`
and `ConlocaButtonProps`, and is imported from
`@conloca-design-system/components/conloca-button`. Public component-specific
helpers use the same prefix; unprefixed aliases are not provided.

Do not rerun shadcn initialization. It may overwrite the token files in this
directory. Shadcn stays a development-only scaffold. Because its generator has no
no-icon setting, every generated component must be staged and reviewed before it
is accepted: remove any generated icon import and dependency, then use the exact
local SVG required by Figma.

## Icons

Icons live in `icons` and come only from the SVG files supplied from Figma. Preserve
each file's exact filename and artwork. Import an icon statically with its exact
filename and the `?react` suffix, for example:

```tsx
import ArrowRightIcon from '@conloca-design-system/icons/arrow-right.svg?react'
```

There are no fallback icons, aliases, runtime name-to-icon registries, or
third-party icon packages. Decorative icons receive `aria-hidden="true"`.
Meaningful standalone icons require an accessible label or SVG title. Size and
placement come from the component's Figma specification, and color inherits via
`currentColor` only when the supplied SVG already supports it. A missing required
SVG blocks that component until the asset is supplied.

## Component acceptance checklist

Before a component is accepted:

- Verify its variants, states, icon names, dimensions, and responsive behavior
  against Figma.
- Check keyboard behavior, focus visibility, accessible naming, and server-side
  rendering.
- Compare the rendered component with Figma at the specified desktop and mobile
  dimensions.
- Confirm its `component-contract.md` documents the public API and that its Storybook
  Docs and Canvas pages expose editable controls for public properties.
- Confirm there are no Radix, Lucide, or other icon-library dependencies or source
  imports.
- Run `bun run lint`, `bun run typecheck`, `bun run build`, and
  `bun run build-storybook`.

## Storybook

Run `bun run storybook` to browse and interact with every design-system component
at `http://localhost:6006`. Each component has a Docs page plus Canvas stories with
controls for its public properties. Run `bun run build-storybook` to verify the
complete catalog as a static build.
