import type {
  BillingInterval,
  ContentLink,
  HomepageMetadata,
  PricingContent,
} from "@/homepage-content"
import { pricingContent } from "@/homepage-content"

export interface PricingComparisonRow {
  label: string
  values: readonly [string, string, string]
}

export interface PricingComparisonGroup {
  label: string
  rows: readonly PricingComparisonRow[]
}

export type PricingAssistantIcon = "chatgpt" | "claude" | "gemini" | "grok" | "mail"

export interface PricingAssistantAction extends ContentLink {
  icon: PricingAssistantIcon
}

export interface PricingPageContent {
  hero: {
    breadcrumbs: readonly [string, string]
    description: string
    heading: string
  }
  pricing: PricingContent
  comparison: {
    actionLabels: readonly [string, string, string]
    billingLabel: string
    eyebrow: string
    heading: string
    groups: readonly PricingComparisonGroup[]
    leadColumnLabel: string
  }
  assistant: {
    actions: readonly PricingAssistantAction[]
    description: string
    heading: string
  }
}

const pricingPageNavigation = [
  { label: "How it works", url: "/#how-it-works" },
  { label: "Docs", url: "/" },
  { label: "Pricing", url: "/pricing" },
  { label: "Blog", url: "/blog" },
] as const

export const pricingPageMetadata: HomepageMetadata = {
  language: "en",
  title: "Conloca Pricing — Plans for every team",
  description:
    "Compare Conloca plans, team limits, storage, governance, and support.",
  skipLabel: "Skip to content",
}

export const pricingPageHeaderContent = {
  menuItems: pricingPageNavigation,
  primaryButton: { label: "Get started", url: "/" },
  secondaryButton: { label: "Try editor", url: "/" },
  logoUrl: "/",
  navigationLabel: "Primary navigation",
  mobileNavigationLabel: "Mobile navigation",
  menuButtonLabel: "Open navigation menu",
  menuCloseButtonLabel: "Close navigation menu",
}

export const pricingPageFooterContent = {
  navigationItems: pricingPageNavigation,
  action: { label: "Get started", url: "/" },
  logoUrl: "/",
  logoLabel: "Conloca home",
  navigationLabel: "Footer navigation",
}

export const pricingPageContent: PricingPageContent = {
  hero: {
    breadcrumbs: ["Pricing", "Plans"],
    heading: "Choose a plan that fits you the best",
    description:
      "Field notes, practical guides, and honest conversations about building visual editing into modern developer workflows.",
  },
  pricing: pricingContent,
  comparison: {
    actionLabels: ["Choose simple", "Choose pro", "Choose simple"],
    billingLabel: "Comparison billing interval",
    eyebrow: "Detailed comparison",
    heading: "Compare every limit and capability",
    leadColumnLabel: "What your team gets",
    groups: [
      {
        label: "Team",
        rows: [
          { label: "Seats included", values: ["3 seats", "10 seats", "30 seats"] },
          { label: "Additional seat", values: ["$5 / seat", "$7 / seat", "$10 / seat"] },
          { label: "Seat limit", values: ["5 seats", "20 seats", "No limit"] },
        ],
      },
      {
        label: "Repositories",
        rows: [
          { label: "Repositories", values: ["1", "Unlimited", "Unlimited"] },
        ],
      },
      {
        label: "Storage",
        rows: [
          { label: "Repository storage", values: ["1GB", "20GB", "30GB"] },
          { label: "Media storage", values: ["1GB", "100GB", "1TB"] },
        ],
      },
      {
        label: "Governance & support",
        rows: [
          { label: "Choose data residency (US/EU)", values: ["—", "Included", "Included"] },
          { label: "Access control", values: ["—", "Basic", "Advanced"] },
          { label: "Audit trail", values: ["—", "—", "Included"] },
          { label: "Support", values: ["—", "Included", "Priority"] },
        ],
      },
    ],
  },
  assistant: {
    heading: "Still not sure where to start?",
    description:
      "Still not sure about how Conloca suits your team or project? Ask an AI agent about it, or leave your mail to talk to our team.",
    actions: [
      { label: "Ask ChatGPT", url: "https://chatgpt.com/", icon: "chatgpt" },
      { label: "Ask Claude", url: "https://claude.ai/new", icon: "claude" },
      { label: "Ask Gemini", url: "https://gemini.google.com/", icon: "gemini" },
      { label: "Ask Grok", url: "https://grok.com/", icon: "grok" },
      { label: "Leave us a mail", url: "mailto:hello@conloca.com", icon: "mail" },
    ],
  },
}

export function getDisplayedPrice(
  price: number,
  billing: BillingInterval,
): number {
  return billing === "annual" ? price * 12 : price
}
