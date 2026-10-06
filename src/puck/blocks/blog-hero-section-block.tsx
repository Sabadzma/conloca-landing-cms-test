import type { ComponentConfig } from "@puckeditor/core"
import {
  BlogHeroSection,
  type BlogHeroContent,
} from "@/sections/blog-hero-section"

// Puck-storable props for BlogHeroSection. Breadcrumb string arrays are stored
// as { text } items (Puck array items must be objects) and mapped back in
// render.
export interface BlogHeroSectionBlockProps {
  compactBreadcrumbs: { text: string }[]
  description: string
  dispatchLabel: string
  largeBreadcrumbs: { text: string }[]
  mobileHeading: string
  heading: string
}

export function mapBlogHeroSectionProps(
  props: BlogHeroSectionBlockProps,
): BlogHeroContent {
  return {
    compactBreadcrumbs: props.compactBreadcrumbs.map((item) => item.text),
    description: props.description,
    dispatchLabel: props.dispatchLabel,
    largeBreadcrumbs: props.largeBreadcrumbs.map((item) => item.text),
    mobileHeading: props.mobileHeading,
    heading: props.heading,
  }
}

const breadcrumbFields = {
  type: "array",
  arrayFields: {
    text: { type: "text" },
  },
  getItemSummary: (item: { text: string }) => item.text,
} as const

export const BlogHeroSectionBlock: ComponentConfig<BlogHeroSectionBlockProps> =
  {
    label: "Blog hero section",
    fields: {
      compactBreadcrumbs: breadcrumbFields,
      description: { type: "textarea" },
      dispatchLabel: { type: "text" },
      largeBreadcrumbs: breadcrumbFields,
      mobileHeading: { type: "text" },
      heading: { type: "text" },
    },
    defaultProps:     {
      "compactBreadcrumbs": [
        {
          "text": "Stories"
        },
        {
          "text": "Insights"
        },
        {
          "text": "Updates"
        }
      ],
      "description": "Field notes, practical guides, and honest conversations about building visual editing into modern developer workflows.",
      "dispatchLabel": "Conloca dispatch",
      "largeBreadcrumbs": [
        {
          "text": "Home"
        },
        {
          "text": "Stories"
        },
        {
          "text": "Updates"
        }
      ],
      "mobileHeading": "Notes from space between code and content",
      "heading": "Notes on content, code, and the space between"
    },
    render: (props: BlogHeroSectionBlockProps) => (
      <BlogHeroSection content={mapBlogHeroSectionProps(props)} />
    ),
  }
