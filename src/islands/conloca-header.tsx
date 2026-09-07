import {
  ConlocaHeader as Header,
  type ConlocaHeaderProps,
} from "@conloca-design-system/components/conloca-header"

/** Regular function so Astro can SSR this island; the design-system header is a forwardRef. */
export function ConlocaHeader(props: ConlocaHeaderProps) {
  return <Header {...props} />
}
