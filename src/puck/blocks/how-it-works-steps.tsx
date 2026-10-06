import type { ComponentConfig } from "@puckeditor/core"
import { withHydration } from "@conloca/astro-cms/hydration"
import {
  HowItWorksSteps as HowItWorksStepsView,
  type HowItWorksStepsContent,
} from "@/sections/how-it-works-steps"

// Puck-storable props: mutable arrays (Puck's field inference cannot read
// readonly arrays), mapped to the section's content contract in render.
export interface HowItWorksStepsBlockProps {
  label: string
  items: { number: string; title: string; description: string }[]
}

export function mapHowItWorksStepsProps(
  props: HowItWorksStepsBlockProps,
): HowItWorksStepsContent {
  return props
}

// withHydration(Identifier, ...) only: the hydration scanner requires a named
// identifier and a string-literal strategy.
function HowItWorksStepsComponent(props: HowItWorksStepsBlockProps) {
  return (
    <HowItWorksStepsView content={mapHowItWorksStepsProps(props)} />
  )
}

export const HowItWorksSteps: ComponentConfig<HowItWorksStepsBlockProps> = {
  label: "How it works steps",
  fields: {
    label: { type: "text" },
    items: {
      type: "array",
      arrayFields: {
        number: { type: "text" },
        title: { type: "text" },
        description: { type: "textarea" },
      },
      getItemSummary: (item) => item.title,
    },
  },
  defaultProps: {
    label: "How Conloca works in four steps",
    items: [
      {
        number: "01",
        title: "Developers define",
        description: "Schemas and components",
      },
      {
        number: "02",
        title: "Content editors edit",
        description: "Markwodn or visual editor",
      },
      {
        number: "03",
        title: "Team reviews",
        description: "Branches and pull requests",
      },
      {
        number: "04",
        title: "Pipeline deploys",
        description: "Existing CI / CD",
      },
    ],
  },
  render: withHydration(HowItWorksStepsComponent, "load"),
}
