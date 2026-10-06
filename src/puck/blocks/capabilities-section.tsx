import type { ComponentConfig } from "@puckeditor/core"
import { withHydration } from "@conloca/astro-cms/hydration"
import {
  CapabilitiesSection as CapabilitiesSectionView,
  type CapabilitiesContent,
} from "@/sections/capabilities-section"

// Props are identical in shape to CapabilitiesContent; the mapper exists so
// every block shares one props → section-content contract.
export interface CapabilitiesSectionBlockProps {
  heading: string
  subheading: string
  items: {
    name:
      | "publishing"
      | "git"
      | "data"
      | "fragments"
      | "media"
      | "markdown"
      | "history"
    title: string
    description: string
  }[]
}

export function mapCapabilitiesSectionProps(
  props: CapabilitiesSectionBlockProps,
): CapabilitiesContent {
  return {
    heading: props.heading,
    subheading: props.subheading,
    items: props.items,
  }
}

// Named component required: the hydration scanner matches
// withHydration(Identifier, ...) only.
const CapabilitiesSectionComponent = (props: CapabilitiesSectionBlockProps) => (
  <CapabilitiesSectionView content={mapCapabilitiesSectionProps(props)} />
)

export const CapabilitiesSection: ComponentConfig<CapabilitiesSectionBlockProps> =
  {
    label: "Capabilities section",
    fields: {
      heading: { type: "text" },
      subheading: { type: "text" },
      items: {
        type: "array",
        arrayFields: {
          name: {
            type: "select",
            options: [
              { label: "Scheduled publishing", value: "publishing" },
              { label: "Git-native workflow", value: "git" },
              { label: "Data collections", value: "data" },
              { label: "Reusable fragments", value: "fragments" },
              { label: "Media library", value: "media" },
              { label: "Markdown", value: "markdown" },
              { label: "Version history", value: "history" },
            ],
          },
          title: { type: "text" },
          description: { type: "textarea" },
        },
        getItemSummary: (item) => item.title,
      },
    },
    defaultProps: {
      heading: "Everything you need",
      subheading: "nothing you don't",
      items: [
        {
          name: "publishing",
          title: "Scheduled Publishing",
          description: "Set a date and time for content to go live automatically",
        },
        {
          name: "git",
          title: "Git-native workflow",
          description: "Every change is a commit. Branch, preview, and merge",
        },
        {
          name: "data",
          title: "Data collections",
          description: "Model and reuse structured data collections",
        },
        {
          name: "fragments",
          title: "Reusable fragments",
          description: "Define and reuse larger content as fragments",
        },
        {
          name: "media",
          title: "Media library",
          description: "Upload assets once and reference them anywhere",
        },
        {
          name: "markdown",
          title: "Type content in Markdown",
          description:
            "Just type the page contents in Markdown. Conloca will render it",
        },
        {
          name: "history",
          title: "Full version history",
          description: "Review changes and restore any previous version",
        },
      ],
    },
    render: withHydration(CapabilitiesSectionComponent, "load"),
  }
