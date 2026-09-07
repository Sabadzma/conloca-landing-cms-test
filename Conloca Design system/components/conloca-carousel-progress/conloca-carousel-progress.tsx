import * as React from "react"
import { Progress as ProgressPrimitive } from "@base-ui/react/progress"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const conlocaCarouselProgressVariants = cva(
  "relative h-[20px] w-[2px] shrink-0 overflow-hidden rounded-[1000px] bg-[var(--color-stroke-strong)]",
  {
    variants: { active: { true: "", false: "" } },
    defaultVariants: { active: true },
  },
)

export type ConlocaCarouselProgressProps = Omit<
  ProgressPrimitive.Root.Props,
  "value" | "min" | "max" | "children" | "className"
> & { active?: boolean; value?: number; className?: string }

const ConlocaCarouselProgress = React.forwardRef<
  HTMLDivElement,
  ConlocaCarouselProgressProps
>(function ConlocaCarouselProgress(
  { active = true, value = 40, className, ...props },
  ref,
) {
  const progress = active ? Math.min(100, Math.max(0, value)) : 0
  const indicatorStyle = React.useMemo(
    () => ({
      width: "100%",
      height: "100%",
      transform: `scaleY(${progress / 100})`,
      transformOrigin: "top",
    }),
    [progress],
  )
  return (
    <ProgressPrimitive.Root
      {...props}
      ref={ref}
      value={progress}
      className={cn(conlocaCarouselProgressVariants({ active }), className)}
      data-slot="conloca-carousel-progress"
      data-active={active || undefined}
    >
      <ProgressPrimitive.Track className="h-full w-full">
        {active && (
          <ProgressPrimitive.Indicator
            data-slot="conloca-carousel-progress-indicator"
            className="rounded-[1000px] bg-[var(--color-stroke-stronger)]"
            style={indicatorStyle}
          />
        )}
      </ProgressPrimitive.Track>
    </ProgressPrimitive.Root>
  )
})

export { ConlocaCarouselProgress, conlocaCarouselProgressVariants }
