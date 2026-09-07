import {
  ConlocaFooter as Footer,
  type ConlocaFooterProps,
} from "@conloca-design-system/components/conloca-footer"

/** Regular function so Astro can SSR this component; the design-system footer is a forwardRef. */
export function ConlocaFooter(props: ConlocaFooterProps) {
  return <Footer {...props} />
}
