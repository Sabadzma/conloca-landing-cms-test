# Figma Auto Layout to Responsive CSS

Use this reference to preserve Figma's resizing model in browser layout. The target is behavioral equivalence while the frame is resized, not a static copy of one rendered frame.

## Inspect the complete layout model

For each structural frame and relevant child, inspect and record:

- `layoutMode`, `layoutWrap`, `primaryAxisSizingMode`, `counterAxisSizingMode`, `layoutSizingHorizontal`, and `layoutSizingVertical`.
- `primaryAxisAlignItems`, `counterAxisAlignItems`, `counterAxisAlignContent`, `itemSpacing`, `counterAxisSpacing`, and all four padding values.
- `layoutGrow`, `layoutAlign`, `layoutPositioning`, `constraints`, relative transform, width, height, min/max dimensions, and any preserved aspect ratio.
- `clipsContent`, `strokesIncludedInLayout`, stroke alignment, opacity, visibility, blend/effects, rotation, and child stacking or reverse-z-index behavior.
- `layoutGrids`, including grid pattern, count, section size, gutter, offset, alignment, and the actual first and last grid-line positions.
- For text: font family, style, size, weight, line height, letter spacing, paragraph spacing, alignment, auto-resize mode, maximum lines, truncation, and measured bounds.
- For images and vectors: intrinsic dimensions, crop transform, scale mode, focal region, constraints, and whether clipping belongs to the parent or asset.
- For instances: main component, component set, variant properties, instance-swap or slot properties, overrides, and bound variables.

Inspect responsive sibling frames and hidden branches when they encode alternate layouts. Ignore invisible construction layers only after confirming that they do not represent a responsive state or interaction.

## Translate Auto Layout relationships

Map relationships rather than copying frame coordinates:

| Figma behavior | CSS behavior |
| --- | --- |
| Horizontal Auto Layout | `display: flex; flex-direction: row` |
| Vertical Auto Layout | `display: flex; flex-direction: column` |
| Wrap enabled | `flex-wrap: wrap` with separate primary- and counter-axis gaps |
| Packed primary-axis alignment | Matching `justify-content` value |
| Auto spacing / space between | `justify-content: space-between`; do not freeze observed gaps |
| Counter-axis alignment | Matching `align-items` or child `align-self` |
| Multiple wrapped-line alignment | Matching `align-content` |
| Auto Layout padding | Logical or physical CSS padding with the same asymmetric values |
| Clipping enabled | `overflow: hidden` or `clip`, chosen to preserve the evidenced scrolling and focus behavior |

`itemSpacing` is the gap on the primary axis. `counterAxisSpacing` is the distance between wrapped lines. For a horizontal layout, map them to column and row gaps respectively; reverse that mapping for a vertical layout. Preserve negative spacing when Figma intentionally overlaps children and reproduce the corresponding stacking order.

Do not add a wrapper merely because Figma has a named frame. Add one only when it owns a real layout, width constraint, grid, background, clipping, stacking, or semantic responsibility. Conversely, do not remove a frame whose nesting is necessary for fill or hug behavior.

## Preserve sizing rules

Apply the sizing rule independently on each axis:

- **Hug contents:** use intrinsic or automatic sizing such as `auto`, `fit-content`, or an inline formatting context appropriate to the parent. Do not copy the currently measured pixel size. Preserve padding and min/max limits around the intrinsic size.
- **Fill container:** participate in the parent's available-space calculation. On the primary flex axis this commonly requires `flex: 1 1 0%`; on the counter axis it commonly requires stretch or `width/height: 100%`. Add `min-width: 0` or `min-height: 0` where browser intrinsic minimums would otherwise prevent Figma-like shrinking.
- **Fixed:** set the evidenced dimension and prevent unintended flex shrinking when Figma keeps it fixed. A fixed child may cause its parent to grow, wrap, clip, or overflow; preserve the behavior shown by the source rules.
- **Minimum and maximum:** emit the actual `min-width`, `max-width`, `min-height`, and `max-height`. Do not approximate a maximum with a breakpoint or a minimum with padding.
- **Aspect ratio:** use `aspect-ratio` with one axis derived from the available size. Do not scale the whole page with `transform`.

`layoutGrow` and stretch alignment describe participation in the parent, not a standalone width. Combine flex growth, basis, shrink behavior, and min/max limits so the result stops and redistributes space at the same bounds as Figma.

When several fill children share a row, preserve the ratios encoded by their base sizes or growth rules. Do not assume equal columns unless Figma makes them equal. Verify the computed sizes at more than one container width.

Use `box-sizing: border-box` when matching Figma's outer dimensions. Account for whether strokes participate in Auto Layout; do not silently add border width outside an intended fixed or maximum size.

## Translate grids and constrained content

For every Figma layout grid, reproduce the actual grid-line geometry:

- Map columns or rows to CSS Grid tracks with the same count and gutter.
- For stretched grids, calculate the available track area from the measured outer inset and use `repeat(count, minmax(0, 1fr))` unless Figma defines unequal tracks.
- For minimum-, maximum-, or center-aligned fixed sections, preserve section size, gutter, offset, and alignment with an appropriately positioned or max-width wrapper.
- Map square grids only when they govern content placement or sizing; do not render Figma's visual grid overlay in the product.
- Keep full-bleed backgrounds outside a constrained content wrapper when Figma models those regions separately.
- Align nested sections to the same page grid rather than reproducing independently measured left offsets.

Figma API grid fields can differ by pattern and alignment. Confirm the first and last grid lines against node bounds instead of assuming that `offset` always means page padding.

Use CSS Grid for two-dimensional track relationships. Do not force a grid into flexbox when doing so loses exact column alignment, and do not use a grid solely because the Figma canvas displays a layout grid if its children are governed by Auto Layout instead.

## Constraints and absolute children

Only translate Figma constraints directly when a node is outside normal Auto Layout flow or explicitly uses absolute positioning:

- Left or top pinning keeps the measured inset.
- Right or bottom pinning keeps the opposite inset.
- Left-and-right or top-and-bottom pinning stretches while preserving both insets.
- Center constraints preserve the center relationship and evidenced intrinsic or fixed size.
- Scale constraints preserve proportional edge positions and dimensions; use percentages or `calc()` rather than page-level transforms.

Position the child relative to the same containing frame that owns its Figma constraints. Preserve clipping and stacking. Do not convert normal Auto Layout children to absolute positioning to make one screenshot line up.

## Continuous responsiveness

Treat every supplied frame as evidence about one continuous responsive system:

- Prefer intrinsic wrapping and min/max rules when those alone produce Figma's behavior. Do not add breakpoints for changes that naturally emerge from Auto Layout.
- Use a container query when a component or section responds to its own available width. Use a media query only when the transition genuinely depends on the viewport.
- Use an explicit Figma annotation, responsive component state, or supplied frame threshold when one exists.
- When a discrete transition has no stated threshold, derive the boundary from the minimum space required by the wider composition: child minimums plus gaps, padding, grid margins, and fixed siblings. Verify one pixel below, at, and above the result.
- Preserve visibility changes with layout-removing CSS when Figma removes the node from flow. Do not leave an invisible box occupying space.
- Preserve responsive reordering through grid areas, flex direction, or `order` only when Figma encodes a different visual order. Keep the document and focus order coherent; never duplicate interactive content solely to simplify reordering.
- Scale only the elements whose Figma constraints scale. Typography, controls, spacing, and the whole page must not scale proportionally unless the design explicitly encodes that behavior.
- Treat top-level Figma height as a reference viewport. Use fixed height only where the page design encodes it; use intrinsic height or `min-height` for ordinary document flow.

If Auto Layout, constraints, responsive variants, and supplied frames still do not determine a behavior, stop and ask whether the user will provide the missing design or wants the agent to choose and document a conventional responsive rule.

## Typography and media are layout inputs

Load the specified font before judging text geometry. Match font variation settings, weight, line height, letter spacing, and text-box resizing before adjusting container widths. Do not compensate for the wrong font metrics with arbitrary padding.

Preserve Figma text behavior:

- Auto width remains intrinsic until constrained by its parent.
- Auto height wraps at the available width and grows vertically.
- Fixed text boxes retain the stated bounds and truncation or clipping behavior.
- Maximum-line truncation maps to an equivalent line clamp only when Figma specifies it.

For images, preserve the Figma fill mode and crop rather than only matching the rendered size. Map fill or crop to `object-fit: cover` plus the correct position, fit to `contain`, and proportional scaling to intrinsic dimensions or aspect ratio. Verify the focal content at narrow and wide bounds.

## Verification matrix

For each major container, record the expected and computed width, height rule, min/max stops, padding, gaps, grid lines, wrap state, order, and overflow at:

- Every supplied Figma viewport.
- At least one intermediate width between supplied viewports.
- One pixel below, at, and above each breakpoint or wrap threshold.
- The minimum and maximum supported widths.
- Relevant height boundaries when vertical resizing changes the design.

During continuous browser resizing, watch for discontinuities not present in Figma: sudden width jumps, premature wrapping, intrinsic overflow, fixed-height clipping, incorrect grid alignment, text reflow changes, image focal drift, or inaccessible focus order. A page passes only when both its reference screenshots and its resizing behavior match the Figma model.
