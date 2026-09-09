import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import CloseIcon from "@conloca-design-system/icons/x-01.svg?react"
import { cn } from "@/lib/utils"

export type ConlocaDialogProps = DialogPrimitive.Root.Props
export type ConlocaDialogContentProps = DialogPrimitive.Popup.Props & {
  closeLabel?: string
}

function ConlocaDialog(props: ConlocaDialogProps) {
  return <DialogPrimitive.Root {...props} />
}

const ConlocaDialogTrigger = React.forwardRef<
  HTMLButtonElement,
  DialogPrimitive.Trigger.Props
>(function ConlocaDialogTrigger(props, ref) {
  return (
    <DialogPrimitive.Trigger
      {...props}
      ref={ref}
      data-slot="conloca-dialog-trigger"
    />
  )
})

const ConlocaDialogContent = React.forwardRef<
  HTMLDivElement,
  ConlocaDialogContentProps
>(function ConlocaDialogContent(
  { children, className, closeLabel = "Close dialog", ...props },
  ref,
) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop
        data-slot="conloca-dialog-backdrop"
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity duration-150 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 motion-reduce:transition-none"
      />
      <DialogPrimitive.Popup
        {...props}
        ref={ref}
        data-slot="conloca-dialog"
        className={cn(
          "fixed top-1/2 left-1/2 z-50 w-[calc(100%-32px)] max-w-[1120px] -translate-x-1/2 -translate-y-1/2 rounded-[20px] bg-[var(--color-bg-surface-initial)] p-[16px] text-[var(--color-fg-strong-default-initial)] outline-none transition-[opacity,scale] duration-200 ease-[cubic-bezier(0.05,0.7,0.1,1)] data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 motion-reduce:transition-[opacity]",
          className,
        )}
      >
        <DialogPrimitive.Close
          aria-label={closeLabel}
          data-slot="conloca-dialog-close"
          className="absolute top-[-48px] right-0 flex size-[36px] items-center justify-center rounded-[8px] bg-[var(--color-bg-surface-initial)] text-[var(--color-fg-strong-default-initial)] hover:bg-[var(--color-bg-surface-hovered)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-bg-accent-initial)]"
        >
          <CloseIcon aria-hidden="true" className="size-[20px]" />
        </DialogPrimitive.Close>
        {children}
      </DialogPrimitive.Popup>
    </DialogPrimitive.Portal>
  )
})

const ConlocaDialogTitle = React.forwardRef<
  HTMLHeadingElement,
  DialogPrimitive.Title.Props
>(function ConlocaDialogTitle(props, ref) {
  return (
    <DialogPrimitive.Title
      {...props}
      ref={ref}
      data-slot="conloca-dialog-title"
    />
  )
})

export {
  ConlocaDialog,
  ConlocaDialogContent,
  ConlocaDialogTitle,
  ConlocaDialogTrigger,
}
