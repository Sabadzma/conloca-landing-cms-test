import * as React from "react"

import {
  ConlocaButton,
  conlocaButtonVariants,
} from "@conloca-design-system/components/conloca-button"
import ConlocaLogo from "@conloca-design-system/icons/conloca-logo.svg?react"
import { cn } from "@/lib/utils"

export type ConlocaFooterNavigationItem = {
  label: string
  url: string
}

export type ConlocaFooterAction = {
  disabled?: boolean
  label: string
  onClick?: (
    event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
  ) => void
  url?: string
}

export type ConlocaFooterProps = Omit<
  React.ComponentPropsWithoutRef<"footer">,
  "children"
> & {
  /** Text and destinations displayed in the responsive navigation. */
  navigationItems: readonly ConlocaFooterNavigationItem[]
  /** Set to `false` to hide the Figma-defined footer action. */
  action?: ConlocaFooterAction | false
  logoLabel?: string
  logoUrl?: string
  navigationLabel?: string
}

const defaultAction = {
  label: "Button",
} as const satisfies ConlocaFooterAction

function ConlocaFooterActionControl({
  action,
}: {
  action: ConlocaFooterAction
}) {
  const handleLinkClick = React.useCallback<
    React.MouseEventHandler<HTMLAnchorElement>
  >(
    (event) => {
      if (action.disabled) {
        event.preventDefault()
        return
      }

      action.onClick?.(event)
    },
    [action],
  )

  if (action.url) {
    return (
      <a
        aria-disabled={action.disabled || undefined}
        className={cn(
          conlocaButtonVariants({ size: "small", variant: "secondary" }),
          action.disabled && "pointer-events-none cursor-not-allowed",
        )}
        data-slot="conloca-button"
        href={action.url}
        tabIndex={action.disabled ? -1 : undefined}
        onClick={handleLinkClick}
      >
        {action.label}
      </a>
    )
  }

  return (
    <ConlocaButton
      disabled={action.disabled}
      icon={false}
      size="small"
      variant="secondary"
      onClick={action.onClick}
    >
      {action.label}
    </ConlocaButton>
  )
}

const ConlocaFooter = React.forwardRef<HTMLElement, ConlocaFooterProps>(
  function ConlocaFooter(
    {
      action = defaultAction,
      className,
      logoLabel = "Conloca home",
      logoUrl = "/",
      navigationItems,
      navigationLabel = "Footer navigation",
      ...props
    },
    ref,
  ) {
    return (
      <footer
        {...props}
        ref={ref}
        className={cn("w-full p-[4px] sm:p-[8px]", className)}
        data-slot="conloca-footer"
      >
        <div
          className="mx-auto flex w-full max-w-[1424px] flex-col items-start gap-[32px] rounded-[20px] bg-[var(--color-bg-primary-initial)] p-[24px] text-[var(--color-fg-strong-inverted-initial)] sm:rounded-[24px] min-[1024px]:flex-row min-[1024px]:items-center min-[1024px]:justify-between min-[1024px]:gap-[77px]"
          data-slot="conloca-footer-container"
        >
          <a
            aria-label={logoLabel}
            className="inline-flex shrink-0 rounded-[4px] outline outline-1 outline-transparent focus-visible:outline-2 focus-visible:outline-offset-[5px] focus-visible:outline-[var(--color-bg-accent-initial)]"
            data-slot="conloca-footer-logo-link"
            href={logoUrl}
          >
            <ConlocaLogo
              aria-hidden="true"
              className="h-[28px] w-[116.667px] [&_path]:fill-current"
              focusable="false"
            />
          </a>

          <div
            className="flex w-full flex-col items-start gap-[31px] sm:flex-row sm:items-center sm:justify-between min-[1024px]:w-auto min-[1024px]:justify-start"
            data-slot="conloca-footer-navigation-container"
          >
            <nav
              aria-label={navigationLabel}
              className="w-full min-w-0 sm:flex-1 min-[1024px]:w-auto min-[1024px]:flex-none"
              data-slot="conloca-footer-navigation"
            >
              <ul className="flex w-full list-none flex-wrap items-center gap-x-[24px] gap-y-[24px] font-[family-name:Inter_Variable] text-[14px] leading-[17px] font-normal sm:gap-x-[31px] sm:gap-y-[31px] sm:text-[16px] sm:leading-[19px] min-[1024px]:w-auto min-[1024px]:flex-nowrap">
                {navigationItems.map((item) => (
                  <li key={item.label + item.url}>
                    <a
                      className="inline-flex whitespace-nowrap rounded-[2px] outline outline-1 outline-transparent hover:underline hover:underline-offset-[4px] focus-visible:outline-2 focus-visible:outline-offset-[5px] focus-visible:outline-[var(--color-bg-accent-initial)]"
                      data-slot="conloca-footer-navigation-item"
                      href={item.url}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {action ? <ConlocaFooterActionControl action={action} /> : null}
          </div>
        </div>
      </footer>
    )
  },
)

export { ConlocaFooter }
