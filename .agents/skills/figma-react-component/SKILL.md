---
name: figma-react-component
description: Implement or revise a reusable Conloca React component for Astro static rendering and interactive islands from a Figma component or component set. Use for variants, props, layout, states, and visual parity; not for recreating whole pages or writing changes back to Figma.
---

# Figma React Component

Turn one Figma component or component set into a production-ready reusable Conloca component. Figma is the visual and behavioral source of truth; accessible web semantics take precedence when the layer hierarchy is not semantic.

## Read first

Before inspecting Figma or editing code, read:

- `AGENTS.md`
- `components.json`
- `Conloca Design system/README.md`
- `Conloca Design system/design tokens/index.css` and the relevant semantic-token definitions

This is a React 19, strict TypeScript, Astro 7 and official Vite 8, Tailwind CSS v4 project. Every component must render during Astro static generation. Interactive islands hydrate with `client:load`; static React sections ship no component JavaScript. Browser APIs belong in effects or event handlers.

Reusable sources belong in `Conloca Design system/components`. Every component must use the Conloca prefix consistently: a kebab-case folder and primary file named `conloca-<name>` (for example, `components/conloca-button/conloca-button.tsx`), a PascalCase React export named `Conloca<Name>` (for example, `ConlocaButton`), and a props type named `Conloca<Name>Props`. Prefix other public component-specific exports as well, such as `conlocaButtonVariants`; do not provide an unprefixed public alias. Keep the implementation, public export, stories, tests, fixtures, and component contract together in that folder. Application code imports only from `@conloca-design-system/components/conloca-<name>` and never imports `@base-ui/react` directly.

## Resolve the Figma source of truth

Always use the Figma Console MCP through its Desktop Bridge:

1. Probe the bridge, then search components before using any session-specific node IDs.
2. Resolve the current selection or an exact search result. If it is an instance, identify its source component or parent component set.
3. For a component set, analyze its axes, property bindings, slots, defaults, and state mapping. Then request development context, relevant variable definitions, an isolated reference image, and an accessibility audit. Request deep context only when the ordinary development tree omits necessary nested detail.
4. Use Console design-parity checks during review when available.

Never use the official Figma Desktop MCP. If the Console Desktop Bridge is unavailable or cannot supply exact component-set context, stop and ask the user to open or repair the Desktop Bridge. Do not fall back to the official Figma MCP, Figma Desktop MCP, Framelink MCP, a partial screenshot, or an inferred node ID.

## Make a design ledger before code

Record the evidence needed to implement and review the component:

- Component-set axes, allowed values, defaults, and which combinations actually exist.
- Component properties, nested slots, preferred instances, and property bindings.
- Auto Layout direction, wrapping, gaps, padding, alignment, fixed/hug/fill sizing, min/max dimensions, constraints, text resizing/truncation, and responsive behavior.
- Typography, fills, strokes, radii, shadows/effects, opacity, variables, icons, reactions, and accessible names.

Map the Figma model to the public API deliberately:

- Style, size, and content axes become typed props and `class-variance-authority` variants only when Figma defines them.
- Hover, pressed, focus, disabled, open, and selected are native or Base UI state when they describe interaction rather than an authored public variant.
- Boolean properties become booleans; text properties become `children` or named content props; instance-swap or slot properties become typed React nodes or named slots.
- Preserve meaningful Figma defaults and preferred instances in the component’s Storybook fixtures.

## Implement within the Conloca system

Inspect the relevant shadcn `base-nova` implementation using a read-only CLI view or dry run. Never rerun shadcn initialization, accept its visual theme, or allow a generator to retain an icon import or dependency.

- Retain the `base-nova` Base UI primitive, Base UI composition utility, or native element selected for that component. Base UI imports belong only inside the design-system component.
- Use the required `Conloca<Name>` named export; preserve refs; accept `className`; expose the relevant Base UI/native props; and add stable `data-slot="conloca-<name>"` attributes on the component root.
- Use `cn` and CVA only for Figma-defined axes. Do not add speculative variants, sizes, tokens, or interaction props.
- Translate Figma Auto Layout to intrinsic flex/grid behavior. Respect hug, fill, and min/max constraints; do not replace them with fixed dimensions merely to match one reference image.
- Match a Figma variable to an existing Conloca semantic token by its identity and meaning, not a similar computed color. If no suitable token exists, use the exact value locally. Do not edit generated token files.
- Import supplied icons statically and exactly, for example `@conloca-design-system/icons/arrow-right.svg?react`. Do not rename, substitute, download, register dynamically, or use an icon library. A missing required icon blocks the component.
- Keep supplied SVG artwork unchanged. Decorative icons use `aria-hidden="true"`; meaningful standalone icons need an accessible name or title.
- Keep browser-only behavior out of server render paths.

## Storybook and visual verification

Maintain a working Storybook environment for the whole design system. Every accepted component must have its own generated Docs page and Canvas stories, and every controllable public prop must have a useful Storybook control so the component can be tested functionally and visually. Keep Storybook configured to discover stories recursively inside all `components/conloca-*` folders, and run both the development environment and the static Storybook build through the repository scripts.

Co-locate `conloca-<name>.stories.tsx` with every accepted component. Use typed CSF stories with `satisfies Meta`, enable Autodocs, title the component with its prefixed name, add controls for public props, individual stories for Figma-defined variants/states, and an `AllVariants` matrix. Match the Figma container, background, natural dimensions, and desktop/mobile viewport where specified.

Add play functions for relevant pointer, keyboard, focus, open, selected, and disabled behavior. With the first stateful component, also add Vitest, Testing Library, user-event, and automated accessibility coverage.

After implementing or revising a component, create or update `component-contract.md` in its folder. Keep it short and precise: document the public import, exported component and types, inputs and defaults, emitted outputs or callbacks, supported states/variants, accessibility obligations, composition constraints, and one minimal usage example. Record only details a future agent needs to use the component correctly; do not repeat implementation internals, Figma measurements, or long prose.

For visual parity:

1. Capture an isolated Figma reference at the specified or natural dimensions.
2. Render the matching Storybook story with the same viewport, container, and background.
3. Compare geometry first, then typography, colors/effects, icons, and interaction states.
4. Iterate until no material mismatch remains. Browser-versus-Figma font antialiasing alone is acceptable; do not use an arbitrary pixel threshold.

Before acceptance, verify the component folder contains its implementation, public export, stories, and concise `component-contract.md`; then verify keyboard behavior, focus visibility, disabled behavior, accessible naming, and server rendering. Run lint, strict type checking, the Astro static build, and the Storybook build. Confirm every component appears in Storybook with editable controls, and that no Radix, Lucide, or other icon-library dependency/import has entered the repository.

## Boundaries

This skill does not modify Figma or create Code Connect mappings unless the user separately asks. It does not recreate entire pages, create replacement icons, or accept a component with ambiguous design context.

## Astro rendering boundary

Astro owns `src/pages/index.astro` and the document layout. Reusable sections remain
React components with typed serializable content props from `src/homepage-content.ts`.
Use `client:load` only for interactive islands; the header, shared hero/features owner,
and pricing are the existing boundaries. Static capabilities and footer have no
hydration directive. Never use `client:only` or import Astro/CMS APIs into sections.
Import global tokens/fonts before homepage styles. Preserve official Vite 8, separate
plugin instances for Astro/Storybook/Vitest, Bun 1.3.14, and Node 22.14.0. Do not add
Vite aliases or a second React transform to Astro. Verification includes `astro check`
through `bun run typecheck`, unit tests, static build, and production Playwright tests.
