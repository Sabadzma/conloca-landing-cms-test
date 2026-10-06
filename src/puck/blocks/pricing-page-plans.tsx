import type { ComponentConfig } from "@puckeditor/core"
import { withHydration } from "@conloca/astro-cms/hydration"
import type { BillingInterval } from "@/lib/content"
import {
  PricingPagePlans as PricingPagePlansView,
  type PricingPagePlansContent,
} from "@/sections/pricing-page-plans"

// Puck-storable props: booleans are radio "true"/"false" strings and the
// feature lists are { text } arrays (Puck array items must be objects).
export interface PricingPagePlansBlockProps {
  currency: string
  intervals: { monthly: string; annual: string }
  bestValueLabel: string
  plans: {
    name: string
    featured: "true" | "false"
    action: { label: string; url: string }
    price: number
    description: string
    features: { text: string }[]
  }[]
}

export function mapPricingPagePlansProps(
  props: PricingPagePlansBlockProps,
): PricingPagePlansContent {
  return {
    currency: props.currency,
    intervals: props.intervals as Record<BillingInterval, string>,
    bestValueLabel: props.bestValueLabel,
    plans: props.plans.map((plan) => ({
      name: plan.name,
      featured: plan.featured === "true",
      action: plan.action,
      price: plan.price,
      description: plan.description,
      features: plan.features.map((feature) => feature.text),
    })),
  }
}

function PricingPagePlansComponent(props: PricingPagePlansBlockProps) {
  return <PricingPagePlansView content={mapPricingPagePlansProps(props)} />
}

export const PricingPagePlans: ComponentConfig<PricingPagePlansBlockProps> = {
  label: "Pricing page plans",
  fields: {
    currency: { type: "text" },
    intervals: {
      type: "object",
      objectFields: {
        monthly: { type: "text" },
        annual: { type: "text" },
      },
    },
    bestValueLabel: { type: "text" },
    plans: {
      type: "array",
      arrayFields: {
        name: { type: "text" },
        featured: {
          type: "radio",
          options: [
            { label: "Featured", value: "true" },
            { label: "Standard", value: "false" },
          ],
        },
        action: {
          type: "object",
          objectFields: {
            label: { type: "text" },
            url: { type: "text" },
          },
        },
        price: { type: "number", min: 0 },
        description: { type: "textarea" },
        features: {
          type: "array",
          arrayFields: { text: { type: "text" } },
          getItemSummary: (item) => item.text,
        },
      },
      getItemSummary: (item) => item.name,
      // Puck's add-item flow uses defaultItemProps ?? {}; without this the new
      // item's `action`/`features` are undefined and the section crashes.
      defaultItemProps: {
        name: "",
        featured: "false",
        action: { label: "", url: "/" },
        price: 0,
        description: "",
        features: [],
      },
    },
  },
  defaultProps: {
    currency: "$",
    intervals: { monthly: "/ Month", annual: "/ Year" },
    bestValueLabel: "Best value",
    plans: [
      {
        name: "Simple",
        featured: "false",
        action: { label: "Choose simple", url: "/" },
        price: 8,
        description: "For small teams getting their site off the ground",
        features: [
          { text: "3 seats included ($5 per additional seat)" },
          { text: "5 seats max" },
          { text: "1 repository" },
          { text: "1GB repository storage" },
          { text: "1GB media storage" },
        ],
      },
      {
        name: "Pro",
        featured: "true",
        action: { label: "Choose pro", url: "/" },
        price: 15,
        description: "For growing teams shipping content more often",
        features: [
          { text: "10 seats included ($7 per additional seat)" },
          { text: "20 seats max" },
          { text: "Unlimited repositories" },
          { text: "20GB repository storage" },
          { text: "100GB media storage" },
          { text: "Choose data residency (US/EU)" },
          { text: "Basic access control" },
          { text: "Support" },
        ],
      },
      {
        name: "Business",
        featured: "false",
        action: { label: "Choose business", url: "/" },
        price: 200,
        description: "For larger teams managing sites, brands & markets",
        features: [
          { text: "30 seats included ($10 per additional seat)" },
          { text: "No seat limit" },
          { text: "Unlimited repositories" },
          { text: "30GB repository storage" },
          { text: "1TB media storage" },
          { text: "Choose data residency (US/EU)" },
          { text: "Advanced access control and Audit trail" },
          { text: "Priority support" },
        ],
      },
    ],
  },
  render: withHydration(PricingPagePlansComponent, "load"),
}
