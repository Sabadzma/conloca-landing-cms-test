# ConlocaProse contract

Import `ConlocaProse`, `ConlocaProseProps`, `ConlocaProseBlock`, and `ConlocaProseTableItem` from `@conloca-design-system/components/conloca-prose`. Import the canonical stylesheet with `import "@conloca-design-system/components/conloca-prose/conloca-prose.css"`.

- Inputs: `blocks` is a readonly array of typed blocks: `paragraph`, `heading` (`weight: "bold" | "semibold"`, default bold), `eyebrow`, `list` (`marker: "number" | "alpha"`, default number), `table` (`{ title, text }` rows), `group` (nested blocks with the tighter 24px flow), and `section` (nested blocks with an optional anchor `id`, the stone-200 top hairline, and 56px top padding).
- Outputs: forwards div attributes and a ref to the `.conloca-prose` root. Renders semantic HTML only: `p`, `h2`, `ol`/`li` with CSS-counter markers, `dl`/`div`/`dt`/`dd`, `section`, `div`.
- Styling: all five Figma text styles (paragraph, title, numbered list, eyebrow, text table) live in `conloca-prose.css` as `.conloca-prose` descendant rules, with exact per-breakpoint sizes at 640/1024/1280. The component emits markup only; it carries no styling logic.
- CMS path: rich text HTML from any source matches the same spec when rendered inside a `.conloca-prose` container (`p`, `h2`, `ol`, `dl > div > dt + dd`, `section.conloca-prose__section`, `p.conloca-prose__eyebrow`); list markers and hairlines are CSS-generated.
- Accessibility: heading levels start at `h2` (the page hero owns `h1`); section anchors use the supplied `id`; list markers are `decimal-leading-zero` or `lower-alpha` counters announced with each item.
- Astro usage: renders as static HTML and needs no hydration.

```tsx
<ConlocaProse
  blocks={[
    { type: "paragraph", text: "Opening thought." },
    {
      type: "section",
      id: "definitions",
      blocks: [
        { type: "eyebrow", text: "Section 01" },
        { type: "heading", text: "Definitions" },
        { type: "table", items: [{ title: "“Account Data”", text: "means information…" }] },
      ],
    },
  ]}
/>
```
