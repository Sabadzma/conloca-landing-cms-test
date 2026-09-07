import type { ReactNode } from "react"
import { conlocaButtonVariants } from "@conloca-design-system/components/conloca-button"
import { cn } from "@/lib/utils"

export function SectionLink({
  children,
  href,
  className,
  variant = "primary",
  size = "default",
}: {
  href: string
  children: ReactNode
  className?: string
  variant?: "primary" | "secondary"
  size?: "default" | "small"
}) {
  return (
    <a
      href={href}
      data-slot="conloca-button"
      className={cn(conlocaButtonVariants({ size, variant }), className)}
    >
      {children}
    </a>
  )
}
