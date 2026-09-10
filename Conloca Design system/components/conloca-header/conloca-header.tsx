import * as React from "react"
import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible"
import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu"
import { cva, type VariantProps } from "class-variance-authority"

import {
  ConlocaButton,
  conlocaButtonVariants,
  type ConlocaButtonProps,
} from "@conloca-design-system/components/conloca-button"
import ConlocaLogo from "@conloca-design-system/icons/conloca-logo.svg?react"
import MenuIcon from "@conloca-design-system/icons/menu-01.svg?react"
import CloseIcon from "@conloca-design-system/icons/x-01.svg?react"
import { cn } from "@/lib/utils"

const conlocaHeaderVariants = cva("conloca-header-appear w-full", {
  variants: {
    transparent: {
      false:
        "bg-[var(--color-bg-surface-initial)] text-[var(--color-fg-strong-default-initial)]",
      true: "bg-transparent text-[var(--color-fg-strong-inverted-initial)]",
    },
  },
  defaultVariants: {
    transparent: false,
  },
})

const conlocaHeaderNavigationItemVariants = cva(
  "inline-flex h-[40px] items-center justify-center whitespace-nowrap rounded-[8px] px-[12px] py-[8px] font-[family-name:Inter_Variable] text-[16px] leading-[24px] font-normal outline outline-1 outline-transparent transition-[background-color,color] duration-[110ms] ease-linear focus-visible:outline-2 focus-visible:outline-offset-2",
  {
    variants: {
      transparent: {
        false:
          "text-[var(--color-fg-strong-default-initial)] hover:bg-[var(--color-bg-surface-hovered)] focus-visible:outline-[var(--color-stroke-accent)] active:bg-[var(--color-bg-surface-pressed)]",
        true:
          "text-[var(--color-fg-strong-inverted-initial)] hover:bg-[var(--color-bg-overlay-darken-hovered)] focus-visible:outline-[var(--color-fg-strong-inverted-initial)] active:bg-[var(--color-bg-overlay-darken-pressed)]",
      },
    },
    defaultVariants: {
      transparent: false,
    },
  },
)

type ConlocaHeaderVariantProps = VariantProps<typeof conlocaHeaderVariants>
type ConlocaHeaderNavigationItemVariantProps = VariantProps<
  typeof conlocaHeaderNavigationItemVariants
>

export type ConlocaHeaderMenuItem = {
  label: string
  /** Open the destination in a new tab. Use for external links. */
  newTab?: boolean
  url: string
}

export type ConlocaHeaderButton = {
  disabled?: boolean
  label: string
  onClick?: (
    event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
  ) => void
  url?: string
}

export type ConlocaHeaderNavigationItemProps = Omit<
  NavigationMenuPrimitive.Link.Props,
  "children" | "href"
> &
  ConlocaHeaderNavigationItemVariantProps &
  ConlocaHeaderMenuItem

export type ConlocaHeaderProps = Omit<
  React.ComponentPropsWithoutRef<"header">,
  "children"
> &
  ConlocaHeaderVariantProps & {
    /** Text and destinations displayed in the responsive navigation. */
    menuItems: readonly ConlocaHeaderMenuItem[]
    /** Set to `false` to hide the primary action. */
    primaryButton?: ConlocaHeaderButton | false
    /** Set to `false` to hide the secondary action. Hidden below 640 pixels. */
    secondaryButton?: ConlocaHeaderButton | false
    defaultMenuExpanded?: boolean
    logoUrl?: string
    navigationLabel?: string
    menuButtonLabel?: string
    menuCloseButtonLabel?: string
    menuControls?: string
    menuExpanded?: boolean
    mobileNavigationLabel?: string
    onMenuClick?: ConlocaButtonProps["onClick"]
    onMenuExpandedChange?: (expanded: boolean) => void
  }

const defaultPrimaryButton = {
  label: "Primary",
} as const satisfies ConlocaHeaderButton

const defaultSecondaryButton = {
  label: "Secondary",
} as const satisfies ConlocaHeaderButton

const ConlocaHeaderNavigationItem = React.forwardRef<
  HTMLAnchorElement,
  ConlocaHeaderNavigationItemProps
>(function ConlocaHeaderNavigationItem(
  { className, label, newTab = false, transparent = false, url, ...props },
  ref,
) {
  return (
    <NavigationMenuPrimitive.Link
      {...props}
      ref={ref}
      className={cn(
        conlocaHeaderNavigationItemVariants({ transparent }),
        className,
      )}
      data-slot="conloca-header-navigation-item"
      href={url}
      rel={newTab ? "noopener noreferrer" : undefined}
      target={newTab ? "_blank" : undefined}
    >
      {label}
    </NavigationMenuPrimitive.Link>
  )
})

function ConlocaHeaderAction({
  action,
  className,
  variant,
}: {
  action: ConlocaHeaderButton
  className?: string
  variant: "primary" | "secondary"
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
          conlocaButtonVariants({ size: "default", variant }),
          action.disabled && "pointer-events-none cursor-not-allowed",
          className,
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

  const button = (
    <ConlocaButton
      className={className}
      disabled={action.disabled}
      icon={false}
      size="default"
      variant={variant}
      onClick={action.onClick}
    >
      {action.label}
    </ConlocaButton>
  )

  return button
}

const ConlocaHeader = React.forwardRef<HTMLElement, ConlocaHeaderProps>(
  function ConlocaHeader(
    {
      className,
      defaultMenuExpanded = false,
      logoUrl = "/",
      menuButtonLabel = "Open navigation menu",
      menuCloseButtonLabel = "Close navigation menu",
      menuControls,
      menuExpanded,
      menuItems,
      mobileNavigationLabel = "Mobile navigation",
      navigationLabel = "Primary navigation",
      onMenuClick,
      onMenuExpandedChange,
      primaryButton = defaultPrimaryButton,
      secondaryButton = defaultSecondaryButton,
      transparent = false,
      ...props
    },
    ref,
  ) {
    const hasActions = Boolean(primaryButton || secondaryButton)
    const generatedMenuId = React.useId()
    const [uncontrolledMenuExpanded, setUncontrolledMenuExpanded] =
      React.useState(defaultMenuExpanded)
    const isMenuControlled = menuExpanded !== undefined
    const isMenuExpanded = isMenuControlled
      ? menuExpanded
      : uncontrolledMenuExpanded
    const mobileMenuId = menuControls ?? generatedMenuId

    const handleMenuExpandedChange = React.useCallback(
      (expanded: boolean) => {
        if (!isMenuControlled) {
          setUncontrolledMenuExpanded(expanded)
        }

        onMenuExpandedChange?.(expanded)
      },
      [isMenuControlled, onMenuExpandedChange],
    )

    const handleMobileNavigationClick = React.useCallback(() => {
      handleMenuExpandedChange(false)
    }, [handleMenuExpandedChange])

    return (
      <header
        {...props}
        ref={ref}
        className={cn(
          conlocaHeaderVariants({ transparent }),
          transparent &&
            isMenuExpanded &&
            "max-[1023px]:bg-[var(--color-bg-surface-initial)]! max-[1023px]:text-[var(--color-fg-strong-default-initial)]!",
          className,
        )}
        data-slot="conloca-header"
      >
        <CollapsiblePrimitive.Root
          className="w-full"
          data-slot="conloca-header-collapsible"
          open={isMenuExpanded}
          onOpenChange={handleMenuExpandedChange}
        >
          <div
            className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-[16px] py-[16px] sm:px-[24px] sm:py-[20px] min-[1024px]:px-[32px]!"
            data-slot="conloca-header-container"
          >
            <a
              aria-label="Conloca home"
              className={cn(
                "inline-flex shrink-0 rounded-[4px] outline outline-1 outline-transparent focus-visible:outline-2 focus-visible:outline-offset-2",
                transparent
                  ? cn(
                      "focus-visible:outline-[var(--color-fg-strong-inverted-initial)]",
                      isMenuExpanded &&
                        "max-[1023px]:focus-visible:outline-[var(--color-stroke-accent)]!",
                    )
                  : "focus-visible:outline-[var(--color-stroke-accent)]",
              )}
              data-slot="conloca-header-logo-link"
              href={logoUrl}
            >
              <ConlocaLogo
                aria-hidden="true"
                className="h-[24px] w-[100px] [&_path]:fill-current sm:h-[28px] sm:w-[116.667px]"
                focusable="false"
              />
            </a>

            <div
              className="flex items-center gap-[16px] sm:gap-[8px] min-[1024px]:gap-[31px]!"
              data-slot="conloca-header-navigation-container"
            >
              <NavigationMenuPrimitive.Root
                aria-label={navigationLabel}
                className="hidden min-[1024px]:block"
                data-slot="conloca-header-navigation"
              >
                <NavigationMenuPrimitive.List className="flex list-none items-center gap-[16px]">
                  {menuItems.map((item) => (
                    <NavigationMenuPrimitive.Item key={item.label + item.url}>
                      <ConlocaHeaderNavigationItem
                        label={item.label}
                        newTab={item.newTab ?? false}
                        transparent={transparent}
                        url={item.url}
                      />
                    </NavigationMenuPrimitive.Item>
                  ))}
                </NavigationMenuPrimitive.List>
              </NavigationMenuPrimitive.Root>

              {hasActions ? (
                <div
                  className={cn(
                    "items-center gap-[8px]",
                    primaryButton ? "flex" : "hidden sm:flex",
                  )}
                  data-slot="conloca-header-actions"
                >
                  {secondaryButton ? (
                    <ConlocaHeaderAction
                      action={secondaryButton}
                      className="hidden sm:inline-flex"
                      variant="secondary"
                    />
                  ) : null}
                  {primaryButton ? (
                    <ConlocaHeaderAction
                      action={primaryButton}
                      variant="primary"
                    />
                  ) : null}
                </div>
              ) : null}

              <CollapsiblePrimitive.Trigger
                aria-controls={mobileMenuId}
                aria-label={
                  isMenuExpanded ? menuCloseButtonLabel : menuButtonLabel
                }
                className={cn(
                  conlocaButtonVariants({
                    size: "default",
                    variant: "iconOnly",
                  }),
                  "group/menu relative min-[1024px]:hidden",
                )}
                data-slot="conloca-header-menu-trigger"
                onClick={onMenuClick}
              >
                <span
                  aria-hidden="true"
                  className="inline-flex size-[18px] transition-[opacity,transform] duration-[180ms] ease-out group-data-[panel-open]/menu:rotate-[-90deg] group-data-[panel-open]/menu:scale-75 group-data-[panel-open]/menu:opacity-0 motion-reduce:transition-none"
                >
                  <MenuIcon className="size-[18px]" focusable="false" />
                </span>
                <span
                  aria-hidden="true"
                  className="absolute inline-flex size-[18px] rotate-90 scale-75 opacity-0 transition-[opacity,transform] duration-[180ms] ease-out group-data-[panel-open]/menu:rotate-0 group-data-[panel-open]/menu:scale-100 group-data-[panel-open]/menu:opacity-100 motion-reduce:transition-none"
                >
                  <CloseIcon className="size-[18px]" focusable="false" />
                </span>
              </CollapsiblePrimitive.Trigger>
            </div>
          </div>

          <CollapsiblePrimitive.Panel
            className="h-[var(--collapsible-panel-height)] translate-y-0 overflow-hidden bg-[var(--color-bg-surface-initial)] text-[var(--color-fg-strong-default-initial)] opacity-100 shadow-[inset_0_1px_0_var(--color-stroke-soft)] transition-[height,opacity,transform] duration-[320ms] ease-[cubic-bezier(0.05,0.7,0.1,1)] data-[ending-style]:h-0 data-[starting-style]:h-0 data-[ending-style]:-translate-y-[8px] data-[starting-style]:-translate-y-[8px] data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 min-[1024px]:hidden motion-reduce:transition-none"
            data-slot="conloca-header-mobile-panel"
            id={mobileMenuId}
          >
            <nav
              aria-label={mobileNavigationLabel}
              data-slot="conloca-header-mobile-navigation"
            >
              <ul className="list-none">
                {menuItems.map((item) => (
                  <li key={item.label + item.url}>
                    <a
                      className="flex h-[64px] w-full items-center justify-end px-[24px] py-[20px] text-right font-[family-name:Inter_Variable] text-[16px] leading-[24px] font-bold outline outline-1 outline-transparent transition-[background-color] duration-[110ms] ease-linear hover:bg-[var(--color-bg-surface-hovered)] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--color-stroke-accent)] active:bg-[var(--color-bg-surface-pressed)]"
                      data-slot="conloca-header-mobile-navigation-item"
                      href={item.url}
                      rel={item.newTab ? "noopener noreferrer" : undefined}
                      target={item.newTab ? "_blank" : undefined}
                      onClick={handleMobileNavigationClick}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </CollapsiblePrimitive.Panel>
        </CollapsiblePrimitive.Root>
      </header>
    )
  },
)

export {
  ConlocaHeader,
  ConlocaHeaderNavigationItem,
  conlocaHeaderNavigationItemVariants,
  conlocaHeaderVariants,
}
