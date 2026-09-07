---
name: figma-react-page
description: Implement or revise a complete Conloca React landing page from Figma frames through the Figma Console MCP, preserving responsive Auto Layout, grids, variables, component reuse, and visual parity. Use for whole pages, screens, and multi-section compositions; not for isolated reusable components or writing changes back to Figma.
---

# Figma React Page

Turn a complete Figma page design into a production-ready Conloca page. The result must behave like the source frame does when resized on the Figma canvas: containers and children stretch, hug, wrap, reflow, reorder, align, and scale according to the same rules. A match at one screenshot size is not sufficient.

Figma is the visual and responsive source of truth. Accessible web semantics take precedence over a non-semantic Figma layer hierarchy, but must not change the intended layout or reading order.

## Read first

Before inspecting Figma or editing code, read:

- `AGENTS.md`, `package.json`, `components.json`, `src/App.tsx`, and `src/index.css`.
- `Conloca Design system/README.md` and the relevant files under `Conloca Design system/design tokens`.
- Every relevant `component-contract.md`, public export, and Storybook story under `Conloca Design system/components`.
- [Figma Auto Layout to responsive CSS](references/figma-layout-to-css.md). This reference is required for every page implementation.

This is a React 19, strict TypeScript, Tailwind CSS v4, Vite/rolldown project that prerenders and hydrates. Defer browser APIs to effects or event handlers and prefer CSS—not JavaScript—for responsive layout.

## Resolve the Figma source of truth

Use only the Figma Console MCP through its Desktop Bridge:

1. Probe the bridge with `figma_get_status` and run `figma_search_components` before relying on any node ID. Node IDs are session-specific; never reuse an unverified ID from an earlier session.
2. Resolve the current selection or the exact supplied Figma URL. Identify the intended page frame plus every supplied responsive sibling, mode, state, or variant. If multiple plausible targets remain, ask the user which one is authoritative.
3. Capture each reference frame. Use component-development context for instances and pure, read-only `figma_execute` inspection for page-frame properties that specialized tools omit.
4. Read the relevant variables, aliases, collections, modes, styles, component properties, annotations, and prototype reactions. Request deeper data only when the ordinary result omits a property required for implementation.

Treat Figma as read-only. Do not create, resize, rename, clone, delete, or otherwise modify Figma nodes. Do not create Code Connect mappings. If the Console Desktop Bridge is unavailable or cannot expose the required source properties, stop and ask the user to open or repair it. Do not fall back to the official Figma MCP, Figma Desktop MCP, Framelink, screenshots alone, or guessed values.

## Make a layout ledger before code

Record enough evidence to reproduce behavior, not just pixels:

- Reference frame dimensions and supported responsive range.
- Page and section hierarchy, child order, component instances, visibility, clipping, stacking, and full-bleed boundaries.
- Every Auto Layout direction, wrap mode, axis alignment, padding, gap, sizing mode, growth rule, min/max dimension, aspect ratio, constraint, and absolute child.
- Every layout grid: pattern, count, section size, gutter, offset or margin, alignment, and the nodes aligned to it.
- Text auto-resize, line height, wrapping, truncation, maximum lines, images and fitting, effects, and prototype-driven transitions.
- Bound variable identity and mode, including alias chains rather than only resolved values.
- The exact behavior that causes elements to resize, wrap, reflow, reorder, appear, disappear, or switch composition.

Top-level Figma frame dimensions are verification viewports. They do not imply a fixed document width or height. Descendant Auto Layout and constraint properties define the web layout.

Provided pages are expected to be fully responsive Auto Layout designs. If required responsive evidence is unexpectedly absent, pause before inventing it and ask whether the user wants the agent to define conventional responsive behavior or will provide the missing breakpoint designs.

## Match Figma and repository components

Inventory both systems before writing page markup. Map each Figma instance to a repository component using its source component identity, component set, variant, property bindings, slots, defaults, and overrides. Confirm the match against the repository contract and story; a similar name or appearance is insufficient.

- Reuse existing components only through `@conloca-design-system/components/conloca-<name>` and their documented public APIs.
- Select the exact Figma-defined variant and content. Do not reach into component internals or add page CSS that hides component drift.
- If an existing component does not match its Figma source, repair it with the `figma-react-component` workflow rather than duplicating or patching around it on the page.
- When a reusable Figma component is missing from the repository, create a temporary page-local visual representation so the entire page can first reach visual parity. Mark it as temporary working code; do not expose it as a design-system component.
- After the page matches as a whole, use `figma-react-component` to build every missing reusable component, replace each temporary representation, and repeat page-level parity checks.
- Do not declare the page complete while any temporary component representation remains.

Keep one-off page sections in application source. Move only genuinely reusable Figma components into the Conloca design system; do not turn every Figma frame into a React component.

## Use variables, tokens, and assets exactly

- Match a bound Figma variable to a repository CSS variable by identity, collection, mode, and semantic meaning—not by a visually similar resolved value.
- Preserve semantic-to-primitive alias relationships. Prefer the bound semantic variable when one exists; do not replace it with its current primitive or hexadecimal result.
- Treat the generated token files as read-only during page implementation. If a bound variable has no repository token, use the exact value locally and record the exception in the handoff.
- Preserve Figma typography and font metrics, including weight, line height, letter spacing, text box behavior, and wrap points.
- Reuse exact local SVGs through the design-system alias. Do not rename, redraw, approximate, or replace icons with an icon package.
- Use the exact source image or vector export for page artwork. Never rasterize a component or use a screenshot of the page as implementation content. A missing required asset blocks that portion of the page.

## Implement responsive page behavior

Translate the ledger into semantic React and intrinsic CSS. Tailwind arbitrary values are appropriate for exact untokenized measurements; use authored CSS when it expresses a relationship more clearly. Preserve the original nesting only where it carries a sizing, clipping, stacking, grid, or accessibility responsibility.

The finished page must reproduce continuous Figma-canvas resizing across the supported range—not merely snap between desktop and mobile screenshots. It must retain the source behavior for fill, hug, fixed sizing, wrapping, growth, min/max stops, aspect ratios, clipping, grid alignment, visibility, reordering, and scaling. Use flex, grid, `min()`, `max()`, `clamp()`, `minmax()`, percentages, aspect ratios, and media or container queries as appropriate. Do not use JavaScript resize listeners for visual layout or apply a transform to scale the entire page.

Use absolute positioning only for nodes whose Figma `layoutPositioning` or constraints require it. Never rebuild an Auto Layout section as a coordinate-based canvas. Preserve semantic document order; when Figma defines visual reordering, implement it without making keyboard focus or screen-reader order incoherent.

Match exact copy, links, component states, and evidenced interactions. Use semantic landmarks and headings, accessible names, visible focus, keyboard behavior, and reduced-motion handling without changing the design's intended geometry.

## Verify the complete page

1. Capture clean Figma references for every supplied viewport, state, and relevant mode.
2. Render the browser at the identical viewport dimensions and compare geometry first: outer bounds, grid lines, section positions, sizing, gaps, padding, alignment, wrapping, and overflow.
3. Then compare typography and wrapping, component variants, imagery and crop, colors, strokes, radii, effects, opacity, and interaction states.
4. Resize continuously through the supported range. Test each supplied width plus intermediate widths and one pixel below, at, and above every derived breakpoint, wrap threshold, and min/max boundary. Test height-dependent behavior where Figma defines it.
5. Exercise content growth, text reflow, image fitting, clipping, stacking, focus order, keyboard operation, reduced motion, server rendering, hydration, and browser-console errors.
6. Iterate until no material mismatch remains. Browser-versus-Figma font antialiasing alone is acceptable; do not choose an arbitrary pixel-difference threshold.

Run `bun run lint`, `bun run typecheck`, `bun run test`, and `bun run build`. If a reusable component changed, also run `bun run build-storybook` and verify its stories and controls.

In the final handoff, list the Figma frames and responsive range verified, components reused or created, token mappings, exact local-value exceptions, and any unresolved ambiguity. Never describe a single-viewport match as a responsive completion.

## Boundaries

This skill does not edit Figma, create Code Connect mappings, invent missing assets, redesign content, or accept fixed-position screenshot tracing as responsive implementation. Use `figma-react-component` instead when the request concerns only one reusable component or component set.
