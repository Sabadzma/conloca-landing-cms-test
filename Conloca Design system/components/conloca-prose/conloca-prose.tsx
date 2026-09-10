import * as React from "react"

import { cn } from "@/lib/utils"

export type ConlocaProseTableItem = {
  title: string
  text: string
}

export type ConlocaProseBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string; weight?: "bold" | "semibold" }
  | { type: "eyebrow"; text: string }
  | {
      type: "list"
      items: readonly string[]
      /** `number` renders 01, 02, …; `alpha` renders a., b., … */
      marker?: "number" | "alpha"
    }
  | { type: "table"; items: readonly ConlocaProseTableItem[] }
  /** Ungrouped run of blocks with the tighter 24px internal flow. */
  | { type: "group"; blocks: readonly ConlocaProseBlock[] }
  /** Titled block with the Figma section hairline and 56px top padding. */
  | { type: "section"; id?: string; blocks: readonly ConlocaProseBlock[] }

export type ConlocaProseProps = Omit<
  React.ComponentPropsWithoutRef<"div">,
  "children"
> & {
  blocks: readonly ConlocaProseBlock[]
}

function ConlocaProseBlockView({ block }: { block: ConlocaProseBlock }) {
  switch (block.type) {
    case "paragraph":
      return <p>{block.text}</p>
    case "heading":
      return (
        <h2
          className={
            block.weight === "semibold"
              ? "conloca-prose__heading--semibold"
              : undefined
          }
        >
          {block.text}
        </h2>
      )
    case "eyebrow":
      return <p className="conloca-prose__eyebrow">{block.text}</p>
    case "list":
      return (
        <ol data-marker={block.marker === "alpha" ? "alpha" : undefined}>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      )
    case "table":
      return (
        <dl>
          {block.items.map((item) => (
            <div key={item.title}>
              <dt>{item.title}</dt>
              <dd>{item.text}</dd>
            </div>
          ))}
        </dl>
      )
    case "group":
      return (
        <div className="conloca-prose__group">
          {block.blocks.map((child) => (
            <ConlocaProseBlockView block={child} key={blockKey(child)} />
          ))}
        </div>
      )
    case "section":
      return (
        <section className="conloca-prose__section" id={block.id}>
          {block.blocks.map((child) => (
            <ConlocaProseBlockView block={child} key={blockKey(child)} />
          ))}
        </section>
      )
  }
}
function blockKey(block: ConlocaProseBlock): string {
  switch (block.type) {
    case "paragraph":
    case "heading":
    case "eyebrow":
      return `${block.type}:${block.text}`
    case "list":
      return `list:${block.items[0] ?? "empty"}`
    case "table":
      return `table:${block.items[0]?.title ?? "empty"}`
    case "group":
      return `group:${block.blocks[0] ? blockKey(block.blocks[0]) : "empty"}`
    case "section":
      return `section:${block.id ?? ""}:${block.blocks[0] ? blockKey(block.blocks[0]) : "empty"}`
  }
}


const ConlocaProse = React.forwardRef<HTMLDivElement, ConlocaProseProps>(
  function ConlocaProse({ blocks, className, ...props }, ref) {
    return (
      <div
        {...props}
        ref={ref}
        className={cn("conloca-prose", className)}
        data-slot="conloca-prose"
      >
        {blocks.map((block) => (
          <ConlocaProseBlockView block={block} key={blockKey(block)} />
        ))}
      </div>
    )
  },
)

export { ConlocaProse }
