import * as React from "react"

import { cn } from "@/lib/utils"
import type { ConlocaIconName } from "./icon-names.generated"

export type ConlocaIconSource = React.ComponentType<
  React.SVGProps<SVGSVGElement>
>

type ConlocaIconModule = {
  default: ConlocaIconSource
}

const iconModules = import.meta.glob<ConlocaIconModule>("../../icons/*.svg", {
  query: "?react",
})
const iconCache = new Map<
  string,
  React.LazyExoticComponent<ConlocaIconSource>
>()

function getIcon(name: ConlocaIconName) {
  const cachedIcon = iconCache.get(name)

  if (cachedIcon) {
    return cachedIcon
  }

  const loadIcon = iconModules[`../../icons/${name}.svg`]

  if (!loadIcon) {
    return null
  }

  const icon = React.lazy(loadIcon)
  iconCache.set(name, icon)

  return icon
}

export type ConlocaIconProps = Omit<
  React.ComponentPropsWithoutRef<"span">,
  "children" | "color"
> & {
  /** The SVG filename without its `.svg` extension. */
  name: ConlocaIconName
  /** A CSS color. When omitted, the icon inherits the surrounding text color. */
  color?: React.CSSProperties["color"]
  /** The rendered width and height in CSS pixels, or any valid CSS size. */
  size?: React.CSSProperties["width"]
  /** Identifies the icon's role when composed inside another component. */
  "data-slot"?: string
}

const ConlocaIcon = React.forwardRef<HTMLSpanElement, ConlocaIconProps>(
  function ConlocaIcon(
    {
      "aria-label": ariaLabel,
      className,
      color,
      "data-slot": dataSlot = "conloca-icon",
      name,
      size = 24,
      style,
      ...props
    },
    ref,
  ) {
    const Icon = getIcon(name)
    const accessibilityProps = ariaLabel
      ? ({ "aria-label": ariaLabel, role: "img" } as const)
      : ({ "aria-hidden": true } as const)
    const iconStyle = React.useMemo<React.CSSProperties>(
      () => ({
        ...style,
        ...(color === undefined ? {} : { color }),
        height: size,
        width: size,
      }),
      [color, size, style],
    )

    return (
      <span
        {...props}
        {...accessibilityProps}
        ref={ref}
        className={cn(
          "inline-flex shrink-0 items-center justify-center align-middle leading-none text-current [&_[fill='#1C1917']]:fill-current",
          className,
        )}
        data-slot={dataSlot}
        style={iconStyle}
      >
        {Icon ? (
          <React.Suspense fallback={null}>
            {React.createElement(Icon, {
              "aria-hidden": true,
              className: "block size-full",
              focusable: "false",
              height: "100%",
              width: "100%",
            })}
          </React.Suspense>
        ) : null}
      </span>
    )
  },
)

export { ConlocaIcon }
