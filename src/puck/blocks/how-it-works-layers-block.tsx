import type { ComponentConfig } from "@puckeditor/core"
import {
  HowItWorksLayers as HowItWorksLayersView,
  type HowItWorksLayersContent,
} from "@/sections/how-it-works-layers"

// Puck-storable props: mutable arrays (Puck's field inference cannot read
// readonly arrays), mapped to the section's content contract in render.
export interface HowItWorksLayersBlockProps {
  heading: string
  description: string
  items: {
    label: string
    description: string
    action: { label: string; url: string }
  }[]
}

export function mapHowItWorksLayersProps(
  props: HowItWorksLayersBlockProps,
): HowItWorksLayersContent {
  return props
}
export const HowItWorksLayersBlock: ComponentConfig<HowItWorksLayersBlockProps> =
  {
    label: "How it works layers",
    fields: {
      heading: { type: "textarea" },
      description: { type: "textarea" },
      items: {
        type: "array",
        arrayFields: {
          label: { type: "text" },
          description: { type: "textarea" },
          action: {
            type: "object",
            objectFields: {
              label: { type: "text" },
              url: { type: "text" },
            },
          },
        },
        getItemSummary: (item) => item.label,
        // Puck's add-item flow uses defaultItemProps ?? {}; without this the
        // new item's `action` is undefined and the section crashes on render.
        defaultItemProps: {
          label: "",
          description: "",
          action: { label: "", url: "/" },
        },
      },
    },
    defaultProps: {
      heading: "Three layers\nSingle foundation",
      description:
        "Developers build the components. Editors compose them visually. Conloca stores the result as files in your Git repository, and Astro renders those same files into your website. No content database. No hosted CMS API between your site and its content.",
      items: [
        {
          label: ".MDX Blocks",
          description: "Reusable components with boundaries set in code",
          action: { label: "Read docs", url: "/" },
        },
        {
          label: "VX.json pages",
          description: "A visual surface that maps directly to stable files",
          action: { label: "Read docs", url: "/" },
        },
        {
          label: "Puck visual editor",
          description:
            "A visual editing interface that maps directly to stable files",
          action: { label: "Read docs", url: "/" },
        },
      ],
    },
    render: (props) => (
      <HowItWorksLayersView content={mapHowItWorksLayersProps(props)} />
    ),
  }
