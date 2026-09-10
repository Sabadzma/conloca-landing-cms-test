import * as React from "react"

import { cn } from "@/lib/utils"

export type ConlocaTocItem = {
  /** Anchor target id without the leading `#`. */
  id: string
  title: string
}

export type ConlocaTocProps = Omit<
  React.ComponentPropsWithoutRef<"nav">,
  "children"
> & {
  /** Numbered anchor entries, rendered in order. */
  items: readonly ConlocaTocItem[]
  /** Visible label and accessible name of the navigation landmark. */
  label?: string
}

const ConlocaToc = React.forwardRef<HTMLElement, ConlocaTocProps>(
  function ConlocaToc(
    { className, items, label = "Contents", ...props },
    ref,
  ) {
    return (
      <nav
        {...props}
        ref={ref}
        aria-label={label}
        className={cn(
          "hidden min-[1024px]:sticky min-[1024px]:top-[72px] min-[1024px]:flex min-[1024px]:flex-1 min-[1024px]:flex-col min-[1024px]:self-start min-[1024px]:max-w-[320px]",
          className,
        )}
        data-slot="conloca-toc"
      >
        <p
          className="pb-[20px] font-[family-name:Roboto_Mono_Variable] text-[14px] leading-[1.7] font-normal uppercase text-[var(--color-fg-softer-default-initial)]"
          data-slot="conloca-toc-label"
        >
          {label}
        </p>
        <ol className="m-0 list-none p-0" data-slot="conloca-toc-list">
          {items.map((item, index) => (
            <li data-slot="conloca-toc-item" key={item.id}>
              <a
                className="group flex items-baseline border-t border-[var(--color-stroke-strong)] px-0 py-[14px] text-[14px] leading-[1.7] no-underline focus-visible:underline"
                data-slot="conloca-toc-link"
                href={`#${item.id}`}
              >
                <span
                  className="w-[36px] shrink-0 grow-0 font-[family-name:Roboto_Mono_Variable] uppercase text-[var(--color-fg-softer-default-initial)] group-hover:text-[var(--color-fg-softer-default-hovered)] group-active:text-[var(--color-fg-softer-default-pressed)]"
                  data-slot="conloca-toc-number"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span
                  className="min-w-0 flex-1 text-[var(--color-fg-soft-default-initial)] group-hover:text-[var(--color-fg-soft-default-hovered)] group-active:text-[var(--color-fg-soft-default-pressed)]"
                  data-slot="conloca-toc-title"
                >
                  {item.title}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
    )
  },
)

export { ConlocaToc }
