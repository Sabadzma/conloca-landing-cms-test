import type { ComponentConfig } from "@puckeditor/core"
import { withHydration } from "@conloca/astro-cms/hydration"
import {
  HowItWorksCta as HowItWorksCtaView,
  type HowItWorksCtaContent,
} from "@/sections/how-it-works-cta"

// Puck-storable props for the CTA. packageManagers is not stored — the tab set
// is fixed by the commands Record keys.
export interface HowItWorksCtaBlockProps {
  heading: string
  description: string
  packageManagerLabel: string
  commands: { bun: string; pnpm: string; npm: string }
  copyLabel: string
}

export function mapHowItWorksCtaProps(
  props: HowItWorksCtaBlockProps,
): HowItWorksCtaContent {
  return {
    heading: props.heading,
    description: props.description,
    packageManagerLabel: props.packageManagerLabel,
    packageManagers: ["bun", "pnpm", "npm"],
    commands: props.commands,
    copyLabel: props.copyLabel,
  }
}

// withHydration(Identifier, ...) only: the hydration scanner requires a named
// identifier and a string-literal strategy.
function HowItWorksCtaComponent(props: HowItWorksCtaBlockProps) {
  return <HowItWorksCtaView content={mapHowItWorksCtaProps(props)} />
}

export const HowItWorksCta: ComponentConfig<HowItWorksCtaBlockProps> = {
  label: "How it works CTA",
  fields: {
    heading: { type: "text" },
    description: { type: "textarea" },
    packageManagerLabel: { type: "text" },
    commands: {
      type: "object",
      objectFields: {
        bun: { type: "text" },
        pnpm: { type: "text" },
        npm: { type: "text" },
      },
    },
    copyLabel: { type: "text" },
  },
  defaultProps: {
    heading: "Start with an Astro project",
    description:
      "Add Conloca, point it at a content directory, define your first components, and open the visual editor",
    packageManagerLabel: "Package manager",
    commands: {
      bun: "bun add @conloca/astro-cms",
      pnpm: "pnpm add @conloca/astro-cms",
      npm: "npm install @conloca/astro-cms",
    },
    copyLabel: "Copy",
  },
  render: withHydration(HowItWorksCtaComponent, "load"),
}
