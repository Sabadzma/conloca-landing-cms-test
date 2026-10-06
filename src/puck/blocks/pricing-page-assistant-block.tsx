import type { ComponentConfig } from "@puckeditor/core"
import {
  PricingPageAssistant as PricingPageAssistantView,
  type PricingAssistantIcon,
  type PricingPageAssistantContent,
} from "@/sections/pricing-page-assistant"

// Puck-storable props: newTab is a radio "true"/"false" string.
export interface PricingPageAssistantBlockProps {
  heading: string
  description: string
  actions: {
    label: string
    url: string
    icon: PricingAssistantIcon
    newTab: "true" | "false"
  }[]
}

export function mapPricingPageAssistantProps(
  props: PricingPageAssistantBlockProps,
): PricingPageAssistantContent {
  return {
    heading: props.heading,
    description: props.description,
    actions: props.actions.map((action) => ({
      label: action.label,
      url: action.url,
      icon: action.icon,
      ...(action.newTab === "true" ? { newTab: true } : {}),
    })),
  }
}

export const PricingPageAssistantBlock: ComponentConfig<PricingPageAssistantBlockProps> =
  {
    label: "Pricing page assistant",
    fields: {
      heading: { type: "text" },
      description: { type: "textarea" },
      actions: {
        type: "array",
        arrayFields: {
          label: { type: "text" },
          url: { type: "text" },
          icon: {
            type: "select",
            options: [
              { label: "ChatGPT", value: "chatgpt" },
              { label: "Claude", value: "claude" },
              { label: "Gemini", value: "gemini" },
              { label: "Grok", value: "grok" },
              { label: "Mail", value: "mail" },
            ],
          },
          newTab: {
            type: "radio",
            options: [
              { label: "Open in new tab", value: "true" },
              { label: "Same tab", value: "false" },
            ],
          },
        },
        getItemSummary: (item) => item.label,
        // Puck's add-item flow uses defaultItemProps ?? {}; without this the
        // new item's `icon`/`newTab` are undefined and the section crashes.
        defaultItemProps: {
          label: "",
          url: "/",
          icon: "chatgpt",
          newTab: "true",
        },
      },
    },
    defaultProps: {
      heading: "Still not sure where to start?",
      description:
        "Still not sure about how Conloca suits your team or project? Ask an AI agent about it, or leave your mail to talk to our team.",
      actions: [
        {
          label: "Ask ChatGPT",
          url: "https://chatgpt.com/?prompt=Explore+https%3A%2F%2Fconloca.com%2Fgetting-started%2F+and+https%3A%2F%2Fconloca.com%2Fhow-it-works%2F.+Explain+what+Conloca+is%2C+how+it+works%2C+and+why+a+team+might+prefer+it+over+a+traditional+CMS.&utm_source=chatgpt.com",
          icon: "chatgpt",
          newTab: "true",
        },
        {
          label: "Ask Claude",
          url: "https://claude.ai/new?q=Explore+https%3A%2F%2Fconloca.com%2Fgetting-started%2F+and+https%3A%2F%2Fconloca.com%2Fhow-it-works%2F.+Explain+what+Conloca+is%2C+how+it+works%2C+and+why+a+team+might+prefer+it+over+a+traditional+CMS.&utm_source=chatgpt.com",
          icon: "claude",
          newTab: "true",
        },
        {
          label: "Ask Gemini",
          url: "https://gemini.google.com/app?text=Explore+https%3A%2F%2Fconloca.com%2Fgetting-started%2F+and+https%3A%2F%2Fconloca.com%2Fhow-it-works%2F.+Explain+what+Conloca+is%2C+how+it+works%2C+and+why+a+team+might+prefer+it+over+a+traditional+CMS.&utm_source=chatgpt.com",
          icon: "gemini",
          newTab: "true",
        },
        {
          label: "Ask Grok",
          url: "https://grok.com/?q=Explore+https%3A%2F%2Fconloca.com%2Fgetting-started%2F+and+https%3A%2F%2Fconloca.com%2Fhow-it-works%2F.+Explain+what+Conloca+is%2C+how+it+works%2C+and+why+a+team+might+prefer+it+over+a+traditional+CMS.&utm_source=chatgpt.com",
          icon: "grok",
          newTab: "true",
        },
        {
          label: "Leave us a mail",
          url: "mailto:hello@conloca.com",
          icon: "mail",
          newTab: "false",
        },
      ],
    },
    render: (props) => (
      <PricingPageAssistantView content={mapPricingPageAssistantProps(props)} />
    ),
  }
