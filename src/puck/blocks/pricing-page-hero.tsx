import type { ComponentConfig } from "@puckeditor/core"
import { withHydration } from "@conloca/astro-cms/hydration"
import type { BillingInterval } from "@/lib/content"
import {
  PricingPageHero as PricingPageHeroView,
  type PricingPageHeroContent,
} from "@/sections/pricing-page-hero"

// Puck-storable props: the breadcrumb tuple is stored as { first, second }.
export interface PricingPageHeroBlockProps {
  breadcrumbs: { first: string; second: string }
  heading: string
  description: string
  billingLabel: string
  billingOptions: { label: string; value: BillingInterval }[]
}

export function mapPricingPageHeroProps(
  props: PricingPageHeroBlockProps,
): PricingPageHeroContent {
  return {
    breadcrumbs: [props.breadcrumbs.first, props.breadcrumbs.second],
    heading: props.heading,
    description: props.description,
    billingLabel: props.billingLabel,
    billingOptions: props.billingOptions,
  }
}

function PricingPageHeroComponent(props: PricingPageHeroBlockProps) {
  return <PricingPageHeroView content={mapPricingPageHeroProps(props)} />
}

export const PricingPageHero: ComponentConfig<PricingPageHeroBlockProps> = {
  label: "Pricing page hero",
  fields: {
    breadcrumbs: {
      type: "object",
      objectFields: {
        first: { type: "text" },
        second: { type: "text" },
      },
    },
    heading: { type: "text" },
    description: { type: "textarea" },
    billingLabel: { type: "text" },
    billingOptions: {
      type: "array",
      arrayFields: {
        label: { type: "text" },
        value: {
          type: "radio",
          options: [
            { label: "Monthly", value: "monthly" },
            { label: "Annual", value: "annual" },
          ],
        },
      },
      getItemSummary: (item) => item.label,
    },
  },
  defaultProps: {
    breadcrumbs: { first: "Pricing", second: "Plans" },
    heading: "Choose a plan that fits you the best",
    description:
      "Compare Conloca plans, team limits, storage, governance, and support.",
    billingLabel: "Billing interval",
    billingOptions: [
      { label: "Monthly", value: "monthly" },
      { label: "Annual", value: "annual" },
    ],
  },
  render: withHydration(PricingPageHeroComponent, "load"),
}
