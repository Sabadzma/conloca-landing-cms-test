import type { ComponentConfig } from "@puckeditor/core"
import {
  HowItWorksBento as HowItWorksBentoView,
  type HowItWorksBentoCard,
  type HowItWorksBentoContent,
} from "@/sections/how-it-works-bento"

// Puck-storable props: mutable arrays (Puck's field inference cannot read
// readonly arrays), mapped to the section's content contract in render.
export interface HowItWorksBentoBlockProps {
  label: string
  heading: string
  cards: HowItWorksBentoCard[]
}

export function mapHowItWorksBentoProps(
  props: HowItWorksBentoBlockProps,
): HowItWorksBentoContent {
  return props
}

export const HowItWorksBentoBlock: ComponentConfig<HowItWorksBentoBlockProps> =
  {
    label: "How it works bento",
    fields: {
      label: { type: "text" },
      heading: { type: "text" },
      cards: {
        type: "array",
        arrayFields: {
          icon: {
            type: "select",
            options: [
              { label: "Flash off", value: "flash-off-1" },
              { label: "Database", value: "database-01" },
              { label: "Globe", value: "globe-01" },
              { label: "Left indent", value: "left-indent-02" },
            ],
          },
          title: { type: "text" },
          description: { type: "textarea" },
        },
        getItemSummary: (item) => item.title,
      },
    },
    defaultProps: {
      label: "Content types Conloca manages",
      heading: "Conloca can manage more than just pages",
      cards: [
        {
          icon: "left-indent-02",
          title: "Content fragments",
          description:
            "Reusable content sections shared across multiple layouts",
        },
        {
          icon: "flash-off-1",
          title: "Media",
          description:
            "URL-addressable site content and standalone landing pages",
        },
        {
          icon: "database-01",
          title: "Data",
          description: "Structured data such as site settings, staff, or quotes",
        },
        {
          icon: "globe-01",
          title: "Locales",
          description:
            "Locale variants stored side-by-side with original content",
        },
      ],
    },
    render: (props) => (
      <HowItWorksBentoView content={mapHowItWorksBentoProps(props)} />
    ),
  }
