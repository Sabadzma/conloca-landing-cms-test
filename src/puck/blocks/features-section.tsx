import type { ComponentConfig } from "@puckeditor/core"
import { withHydration } from "@conloca/astro-cms/hydration"
import type { Audience } from "@/sections/audience"
import {
  AudienceFeatures as AudienceFeaturesView,
  type FeatureContent,
  type FeatureControls,
} from "@/sections/audience-features"
import type { ContentLink } from "@/lib/content"

// Puck-storable props for the scroll-driven feature track.
export interface FeaturesSectionBlockProps {
  options: { label: string; value: Audience }[]
  features: {
    name: "source" | "localization" | "history"
    artwork: string
    developers: { title: string; description: string }
    editors: { title: string; description: string }
  }[]
  featureControls: {
    audienceLabelPrefix: string
    primaryAction: ContentLink
    secondaryAction: ContentLink
  }
}

const audienceRadioOptions = [
  { label: "Developers", value: "developers" },
  { label: "Content editors", value: "editors" },
] as const

const linkFields = {
  type: "object",
  objectFields: {
    label: { type: "text" },
    url: { type: "text" },
  },
} as const

const audienceTextFields = {
  type: "object",
  objectFields: {
    title: { type: "text" },
    description: { type: "textarea" },
  },
} as const

export function mapFeaturesSectionProps(props: FeaturesSectionBlockProps): {
  features: readonly FeatureContent[]
  controls: FeatureControls
  options: FeaturesSectionBlockProps["options"]
} {
  return {
    features: props.features,
    controls: props.featureControls,
    options: props.options,
  }
}

// The hydration scanner matches withHydration(NamedComponent, ...) — an inline
// arrow here would silently skip island generation.
const FeaturesSectionComponent = (props: FeaturesSectionBlockProps) => {
  const mapped = mapFeaturesSectionProps(props)
  return (
    <AudienceFeaturesView
      features={mapped.features}
      controls={mapped.controls}
      options={mapped.options}
    />
  )
}

export const FeaturesSection: ComponentConfig<FeaturesSectionBlockProps> = {
  label: "Features section",
  fields: {
    options: {
      type: "array",
      arrayFields: {
        label: { type: "text" },
        value: { type: "radio", options: [...audienceRadioOptions] },
      },
      getItemSummary: (item) => item.label,
    },
    features: {
      type: "array",
      arrayFields: {
        name: {
          type: "select",
          options: [
            { label: "Source", value: "source" },
            { label: "Localization", value: "localization" },
            { label: "History", value: "history" },
          ],
        },
        artwork: { type: "text" },
        developers: { ...audienceTextFields, label: "Developers" },
        editors: { ...audienceTextFields, label: "Editors" },
      },
      getItemSummary: (item) => item.developers.title,
      // Puck's add-item flow uses defaultItemProps ?? {}; without this the new
      // item's per-audience objects are undefined and the section crashes.
      defaultItemProps: {
        name: "source",
        artwork: "",
        developers: { title: "", description: "" },
        editors: { title: "", description: "" },
      },
    },
    featureControls: {
      type: "object",
      objectFields: {
        audienceLabelPrefix: { type: "text" },
        primaryAction: { ...linkFields, label: "Primary action" },
        secondaryAction: { ...linkFields, label: "Secondary action" },
      },
    },
  },
  defaultProps: {
    options: [
      { label: "Developers", value: "developers" },
      { label: "Content editors", value: "editors" },
    ],
    features: [
      {
        name: "source",
        artwork: "feature-source.svg",
        developers: {
          title: "One source of truth, two ways to work",
          description:
            "Developers work in the IDE. Editors work visually. Every change goes back to the same MDX files in Git.",
        },
        editors: {
          title: "Build and edit pages visually",
          description:
            "Add blocks, move sections, and update content in the visual editor. Conloca handles the files and repository updates.",
        },
      },
      {
        name: "localization",
        artwork: "feature-localization.svg",
        developers: {
          title: "Localization without manual syncing",
          description:
            "Update the source structure once. Each locale follows the same versioned structure. When content changes, Conloca flags the locales that need updating.",
        },
        editors: {
          title: "Keep every language in sync",
          description:
            "Edit only what differs between locales. Shared content stays aligned, and Conloca shows you what still needs updating.",
        },
      },
      {
        name: "history",
        artwork: "feature-history.svg",
        developers: {
          title: "Review, merge, and revert content in Git",
          description:
            "Every edit is written to a file with a readable diff and full history, ready for your existing pull-request workflow. Review changes, merge or roll back anything, any time.",
        },
        editors: {
          title: "See every change. Restore any version.",
          description:
            "Nothing is ever permanently overwritten. Every version of a page is preserved, so you can check what changed and when, then return to an earlier version whenever you need to.",
        },
      },
    ],
    featureControls: {
      audienceLabelPrefix: "Choose your role for ",
      primaryAction: { label: "Get started", url: "/" },
      secondaryAction: { label: "Read docs", url: "/" },
    },
  },
  render: withHydration(FeaturesSectionComponent, "load"),
}
