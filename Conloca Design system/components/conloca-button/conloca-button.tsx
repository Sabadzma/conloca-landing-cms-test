import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import type { ConlocaIconName } from "@conloca-design-system/components/conloca-icon"

// Text-only buttons and links must not load the complete SVG catalog.
const LazyConlocaIcon = React.lazy(async () => {
  const { ConlocaIcon } =
    await import("@conloca-design-system/components/conloca-icon")
  return { default: ConlocaIcon }
})
import { cn } from "@/lib/utils"

const conlocaButtonVariants = cva(
  "group/button inline-flex shrink-0 appearance-none items-center justify-center whitespace-nowrap rounded-[8px] outline outline-1 outline-offset-0 select-none transition-[background-color,color,outline-color,text-decoration-color] duration-[110ms] ease-linear focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-stroke-accent)] disabled:pointer-events-none disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--color-bg-primary-initial)] text-[var(--color-fg-strong-inverted-initial)] outline-[var(--color-stroke-accent)] hover:bg-[var(--color-bg-primary-hovered)] active:bg-[var(--color-bg-primary-pressed)] disabled:bg-[var(--color-bg-primary-disabled)] disabled:text-[var(--color-fg-disabled-default)] disabled:outline-[var(--color-bg-primary-disabled)]",
        secondary:
          "bg-[var(--color-bg-surface-initial)] text-[var(--color-fg-strong-default-initial)] outline-[var(--color-stroke-strong)] hover:bg-[var(--color-bg-surface-hovered)] active:bg-[var(--color-bg-surface-pressed)] disabled:text-[var(--color-fg-disabled-default)] disabled:outline-[var(--color-stroke-soft)]",
        iconWithBackground:
          "bg-[var(--color-bg-surface-initial)] text-[var(--color-fg-strong-default-initial)] outline-transparent hover:bg-[var(--color-bg-surface-hovered)] hover:outline-[var(--color-stroke-soft)] active:bg-[var(--color-bg-surface-pressed)] active:outline-[var(--color-stroke-soft)] disabled:text-[var(--color-fg-disabled-default)]",
        iconOnly:
          "bg-transparent text-[var(--color-fg-strong-default-initial)] outline-transparent hover:bg-[var(--color-bg-surface-hovered)] hover:outline-[var(--color-stroke-soft)] active:bg-[var(--color-bg-surface-pressed)] active:outline-[var(--color-stroke-soft)] disabled:text-[var(--color-fg-disabled-default)]",
        link: "rounded-none bg-transparent p-0 font-[family-name:Roboto_Mono_Variable] font-normal tracking-[0] uppercase text-[var(--color-fg-softer-default-initial)] outline-none hover:text-[var(--color-fg-softer-default-hovered)] hover:underline hover:underline-offset-auto active:text-[var(--color-fg-softer-default-pressed)] active:underline disabled:text-[var(--color-fg-disabled-default)] disabled:no-underline",
      },
      size: {
        default: "",
        small: "",
      },
    },
    compoundVariants: [
      {
        variant: ["primary", "secondary"],
        size: "default",
        className:
          "gap-[6px] px-[10px] py-[10px] font-['Inter'] text-[14px] leading-[14px] font-medium",
      },
      {
        variant: ["primary", "secondary"],
        size: "small",
        className:
          "gap-[4px] px-[8px] py-[8px] font-['Inter'] text-[12px] leading-[12px] font-medium",
      },
      {
        variant: ["iconWithBackground", "iconOnly"],
        size: "default",
        className: "p-[8px]",
      },
      {
        variant: ["iconWithBackground", "iconOnly"],
        size: "small",
        className: "p-[8px]",
      },
      {
        variant: "link",
        size: "default",
        className: "text-[14px] leading-[16px]",
      },
      {
        variant: "link",
        size: "small",
        className: "text-[12px] leading-[16px]",
      },
    ],
    defaultVariants: {
      variant: "primary",
      size: "small",
    },
  },
)

type ConlocaButtonVariantProps = VariantProps<typeof conlocaButtonVariants>

export type ConlocaButtonProps = ButtonPrimitive.Props &
  ConlocaButtonVariantProps & {
    /** An icon name, `true` for the default plus icon, or `false` to hide it. */
    icon?: ConlocaIconName | boolean
  }

function ConlocaButtonIcon({
  name,
  size,
}: {
  name: ConlocaIconName
  size: number
}) {
  const placeholderStyle = React.useMemo(
    () => ({ width: size, height: size }),
    [size],
  )
  const placeholder = React.useMemo(
    () => (
      <span
        aria-hidden="true"
        data-slot="button-icon"
        className="inline-flex shrink-0"
        style={placeholderStyle}
      />
    ),
    [placeholderStyle],
  )
  return (
    <React.Suspense fallback={placeholder}>
      <LazyConlocaIcon data-slot="button-icon" name={name} size={size} />
    </React.Suspense>
  )
}

const ConlocaButton = React.forwardRef<HTMLElement, ConlocaButtonProps>(
  function ConlocaButton(
    {
      children,
      className,
      icon = true,
      size = "small",
      variant = "primary",
      ...props
    },
    ref,
  ) {
    const isTextButton = variant === "primary" || variant === "secondary"
    const isIconButton =
      variant === "iconWithBackground" || variant === "iconOnly"
    const iconSize = size === "default" ? (isIconButton ? 18 : 14) : 12
    const iconName = typeof icon === "string" ? icon : "plus-02"
    const showsIcon = (isTextButton || isIconButton) && Boolean(icon)

    return (
      <ButtonPrimitive
        {...props}
        ref={ref}
        className={cn(conlocaButtonVariants({ variant, size }), className)}
        data-slot="conloca-button"
      >
        {showsIcon ? (
          <ConlocaButtonIcon name={iconName} size={iconSize} />
        ) : null}
        {isTextButton || variant === "link" ? children : null}
      </ButtonPrimitive>
    )
  },
)

export { ConlocaButton, conlocaButtonVariants }
