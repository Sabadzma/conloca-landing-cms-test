import * as React from "react"
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const conlocaSegmentedControlVariants = cva(
  "relative inline-flex w-fit items-center gap-[2px] rounded-[14px] p-[2px]",
  {
    variants: {
      transparent: {
        false: "bg-[var(--color-bg-elevated-initial)]",
        true: "bg-[rgba(41,37,36,0.2)]",
      },
    },
    defaultVariants: {
      transparent: false,
    },
  },
)

type ConlocaSegmentedControlVariantProps = VariantProps<
  typeof conlocaSegmentedControlVariants
>

export type ConlocaSegmentedControlOption = {
  label: React.ReactNode
  value: string
}

export type ConlocaSegmentedControlOptions =
  readonly ConlocaSegmentedControlOption[]

export type ConlocaSegmentedControlProps = Omit<
  ToggleGroupPrimitive.Props<string>,
  | "children"
  | "className"
  | "defaultValue"
  | "multiple"
  | "onValueChange"
  | "orientation"
  | "value"
> &
  ConlocaSegmentedControlVariantProps & {
    className?: string
    /** Options displayed from left to right. */
    options?: ConlocaSegmentedControlOptions
    /** The initially selected option for an uncontrolled control. */
    defaultValue?: string
    /** The selected option for a controlled control. */
    value?: string
    /** Called when the selected option changes. */
    onValueChange?: (
      value: string,
      eventDetails: ToggleGroupPrimitive.ChangeEventDetails,
    ) => void
  }

const defaultOptions = [
  { label: "Item 1", value: "item-1" },
  { label: "Item 2", value: "item-2" },
] as const satisfies ConlocaSegmentedControlOptions

type ConlocaSegmentedControlIndicatorLayout = {
  offset: number
  ready: boolean
  width: number
}

const ConlocaSegmentedControl = React.forwardRef<
  HTMLDivElement,
  ConlocaSegmentedControlProps
>(function ConlocaSegmentedControl(
  {
    className,
    defaultValue,
    disabled,
    onValueChange,
    options = defaultOptions,
    transparent = false,
    value,
    ...props
  },
  ref,
) {
  const rootRef = React.useRef<HTMLDivElement | null>(null)
  const [indicatorCanAnimate, setIndicatorCanAnimate] = React.useState(false)
  const [indicatorLayout, setIndicatorLayout] =
    React.useState<ConlocaSegmentedControlIndicatorLayout>({
      offset: 0,
      ready: false,
      width: 0,
    })
  const fallbackValue = options[0]?.value ?? ""
  const [uncontrolledValue, setUncontrolledValue] = React.useState(
    defaultValue ?? fallbackValue,
  )
  const selectedValue = value ?? uncontrolledValue
  const selectedValues = React.useMemo(
    () => (selectedValue ? [selectedValue] : []),
    [selectedValue],
  )

  const setRootRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node

      if (typeof ref === "function") ref(node)
      else if (ref) ref.current = node
    },
    [ref],
  )

  React.useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const optionValues = new Set(options.map((option) => option.value))
    const optionElements = Array.from(
      root.querySelectorAll<HTMLElement>(
        '[data-slot="conloca-segmented-control-option"]',
      ),
    ).filter((option) =>
      optionValues.has(option.dataset.segmentedControlValue ?? ""),
    )

    const updateIndicator = () => {
      const activeOption = optionElements.find(
        (option) =>
          option.dataset.segmentedControlValue === selectedValue,
      )

      if (!activeOption) {
        setIndicatorLayout({ offset: 0, ready: false, width: 0 })
        return
      }

      setIndicatorLayout((currentLayout) => {
        const nextLayout = {
          offset: activeOption.offsetLeft,
          ready: true,
          width: activeOption.offsetWidth,
        }

        return currentLayout.offset === nextLayout.offset &&
          currentLayout.ready === nextLayout.ready &&
          currentLayout.width === nextLayout.width
          ? currentLayout
          : nextLayout
      })
    }

    updateIndicator()

    if (typeof ResizeObserver === "undefined") return

    const resizeObserver = new ResizeObserver(updateIndicator)
    resizeObserver.observe(root)
    optionElements.forEach((option) => resizeObserver.observe(option))

    return () => resizeObserver.disconnect()
  }, [options, selectedValue])

  React.useEffect(() => {
    const animationFrame = window.requestAnimationFrame(() => {
      setIndicatorCanAnimate(true)
    })

    return () => window.cancelAnimationFrame(animationFrame)
  }, [])

  const indicatorStyle = React.useMemo<React.CSSProperties>(
    () => ({
      opacity: indicatorLayout.ready ? 1 : 0,
      transform: `translateX(${indicatorLayout.offset}px)`,
      width: indicatorLayout.width,
    }),
    [indicatorLayout],
  )

  const handleValueChange = React.useCallback(
    (
      nextValues: string[],
      eventDetails: ToggleGroupPrimitive.ChangeEventDetails,
    ) => {
      const nextValue = nextValues[0]

      // A segmented control always keeps exactly one option selected.
      if (nextValue === undefined) return

      if (value === undefined) setUncontrolledValue(nextValue)
      onValueChange?.(nextValue, eventDetails)
    },
    [onValueChange, value],
  )

  return (
    <ToggleGroupPrimitive
      {...props}
      ref={setRootRef}
      className={cn(
        conlocaSegmentedControlVariants({ transparent }),
        className,
      )}
      data-slot="conloca-segmented-control"
      disabled={disabled}
      multiple={false}
      orientation="horizontal"
      role="group"
      value={selectedValues}
      onValueChange={handleValueChange}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute top-[2px] left-0 h-[39px] rounded-[12px] bg-[var(--color-bg-surface-initial)] shadow-[0_1px_4px_-1px_rgba(12,12,13,0.1)]",
          indicatorCanAnimate
            ? "transition-[transform,width] duration-[110ms] ease-[cubic-bezier(0.56,0,0,0.99)] motion-reduce:transition-none"
            : "transition-none",
        )}
        data-slot="conloca-segmented-control-indicator"
        style={indicatorStyle}
      />
      {options.map((option) => (
        <TogglePrimitive
          key={option.value}
          className={cn(
            "relative z-10 inline-flex h-[39px] shrink-0 appearance-none items-center justify-center whitespace-nowrap rounded-[12px] border-0 px-[16px] py-[6px]",
            "font-[family-name:Inter_Variable] text-[16px] leading-[27.2px] font-medium select-none",
            "bg-transparent shadow-none",
            transparent
              ? "text-[var(--color-fg-strong-inverted-initial)]"
              : "text-[var(--color-fg-softer-default-hovered)]",
            "focus-visible:relative focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-stroke-accent)]",
            "data-[pressed]:text-[var(--color-fg-strong-default-initial)]",
            "data-[disabled]:cursor-not-allowed data-[disabled]:text-[var(--color-fg-disabled-default)] data-[disabled]:data-[pressed]:text-[var(--color-fg-disabled-default)]",
          )}
          data-slot="conloca-segmented-control-option"
          data-segmented-control-value={option.value}
          value={option.value}
        >
          {option.label}
        </TogglePrimitive>
      ))}
    </ToggleGroupPrimitive>
  )
})

export { ConlocaSegmentedControl, conlocaSegmentedControlVariants }
