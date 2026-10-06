import type { ComponentConfig } from "@puckeditor/core"
import { withHydration } from "@conloca/astro-cms/hydration"
import type { Audience } from "@/sections/audience"
import {
  AudienceHero as AudienceHeroView,
  type HeroContent,
  type HeroMessages,
} from "@/sections/audience-hero"
import type { ContentLink } from "@/lib/content"

// Puck-storable props for the homepage hero. messages tuples are stored as
// { first, second } pairs (Puck array items must be objects) and
// Record<Audience, …> maps are fixed-key objects.
export interface HeroMessagePair {
  first: string
  second: string
}

export interface HeroSectionBlockProps {
  options: { label: string; value: Audience }[]
  headings: Record<Audience, string>
  messages: Record<Audience, HeroMessagePair[]>
  audienceLabel: string
  badge: string
  primaryAction: ContentLink
  secondaryAction: ContentLink
  carousel: {
    label: string
    chooseLabel: string
    showLabel: string
    playLabel: string
    pauseLabel: string
  }
  video: {
    title: string
    playLabel: string
    closeLabel: string
    url: string
    poster: { src: string; alt: string; width: number; height: number }
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

// HeroMessages is a non-empty tuple array; the editor enforces min: 1 and
// the floor below keeps a fully emptied stored array renderable.
const toMessages = (pairs: HeroMessagePair[]): HeroMessages => {
  const [head, ...rest] = pairs.map(
    ({ first, second }) => [first, second] as const,
  )
  return head ? [head, ...rest] : [["", ""]]
}

export function mapHeroSectionProps(props: HeroSectionBlockProps): HeroContent {
  return {
    headings: props.headings,
    messages: {
      developers: toMessages(props.messages.developers),
      editors: toMessages(props.messages.editors),
    },
    audienceLabel: props.audienceLabel,
    badge: props.badge,
    primaryAction: props.primaryAction,
    secondaryAction: props.secondaryAction,
    carousel: props.carousel,
    video: props.video,
  }
}

// The hydration scanner matches withHydration(NamedComponent, ...) — an inline
// arrow here would silently skip island generation.
const HeroSectionComponent = (props: HeroSectionBlockProps) => (
  <AudienceHeroView
    content={mapHeroSectionProps(props)}
    options={props.options}
  />
)

export const HeroSection: ComponentConfig<HeroSectionBlockProps> = {
  label: "Hero section",
  fields: {
    options: {
      type: "array",
      arrayFields: {
        label: { type: "text" },
        value: { type: "radio", options: [...audienceRadioOptions] },
      },
      getItemSummary: (item) => item.label,
    },
    headings: {
      type: "object",
      objectFields: {
        developers: { type: "textarea", label: "Developer heading" },
        editors: { type: "textarea", label: "Editor heading" },
      },
    },
    messages: {
      type: "object",
      objectFields: {
        developers: {
          type: "array",
          label: "Developer messages",
          arrayFields: {
            first: { type: "textarea" },
            second: { type: "textarea" },
          },
          getItemSummary: (item) => item.first,
          min: 1,
        },
        editors: {
          type: "array",
          label: "Editor messages",
          arrayFields: {
            first: { type: "textarea" },
            second: { type: "textarea" },
          },
          getItemSummary: (item) => item.first,
          min: 1,
        },
      },
    },
    audienceLabel: { type: "text" },
    badge: { type: "text" },
    primaryAction: { ...linkFields, label: "Primary action" },
    secondaryAction: { ...linkFields, label: "Secondary action" },
    carousel: {
      type: "object",
      objectFields: {
        label: { type: "text" },
        chooseLabel: { type: "text" },
        showLabel: { type: "text" },
        playLabel: { type: "text" },
        pauseLabel: { type: "text" },
      },
    },
    video: {
      type: "object",
      objectFields: {
        title: { type: "text" },
        playLabel: { type: "text" },
        closeLabel: { type: "text" },
        url: { type: "text" },
        poster: {
          type: "object",
          objectFields: {
            src: { type: "text" },
            alt: { type: "text" },
            width: { type: "number" },
            height: { type: "number" },
          },
        },
      },
    },
  },
  defaultProps: {
    options: [
      { label: "Developers", value: "developers" },
      { label: "Content editors", value: "editors" },
    ],
    headings: {
      developers:
        "Keep content in your repo. Give editors a visual editing interface",
      editors:
        "Build and edit pages visually without touching the codebase",
    },
    messages: {
      developers: [
        {
          first:
            "Map your React components to typed schemas and MDS blocks in the IDE.",
          second:
            " Visual edits respect the structure you define and stay in Git.",
        },
        {
          first: "Editors can only use the fields and blocks you define.",
          second:
            " Conloca validates each update before writing it back to the repository.",
        },
        {
          first:
            "Route content changes through standard Git pull requests.",
          second:
            " Review, approve, or revert them just as you would with code.",
        },
      ],
      editors: [
        {
          first: "Developers build and map reusable sections for you.",
          second:
            " You use visual editor to build, edit and publish pages without depending on developer.",
        },
        {
          first:
            "Handle multiple languages by changing only what differs.",
          second:
            " Shared content stays automatically in sync for every locale.",
        },
        {
          first:
            "Create reusable text fragments once and drop them into any page.",
          second:
            " Update a shared block and it stays consistent everywhere.",
        },
      ],
    },
    audienceLabel: "Choose your role",
    badge: "Built for Astro",
    primaryAction: { label: "Get started", url: "/" },
    secondaryAction: { label: "Try editor", url: "/" },
    carousel: {
      label: "How Conloca works",
      chooseLabel: "Choose a message",
      showLabel: "Show message ",
      playLabel: "Play messages",
      pauseLabel: "Pause messages",
    },
    video: {
      title: "Conloca demo video",
      playLabel: "Play Conloca demo video",
      closeLabel: "Close demo video",
      url: "https://www.youtube.com/embed/zNGWdTLWktY?start=48&autoplay=1&rel=0",
      poster: {
        src: "/assets/demo-poster.png",
        alt: "Conloca dashboard preview",
        width: 4096,
        height: 2731,
      },
    },
  },
  render: withHydration(HeroSectionComponent, "load"),
}
