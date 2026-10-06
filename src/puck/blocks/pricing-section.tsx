import type { ComponentConfig } from "@puckeditor/core"
import { withHydration } from "@conloca/astro-cms/hydration"
import {
  PricingSection as PricingSectionView,
  type PricingContent,
} from "@/sections/pricing-section"
import type { BillingInterval, ContentLink } from "@/lib/content"

// Puck-storable props for PricingContent. Booleans are radio "true"/"false"
// strings (Puck has no boolean field) and string arrays are { text } items.
// The pricing page block reuses this props type, fields, and mapper for its
// embedded plan picker.
export interface PricingSectionBlockProps {
  heading: string
  billingLabel: string
  billingOptions: { label: string; value: BillingInterval }[]
  currency: string
  intervals: Record<BillingInterval, string>
  bestValueLabel: string
  compareAction: ContentLink
  plans: {
    name: string
    featured: "true" | "false"
    action: ContentLink
    price: number
    description: string
    features: { text: string }[]
  }[]
}

export function mapPricingSectionProps(
  props: PricingSectionBlockProps,
): PricingContent {
  return {
    heading: props.heading,
    billingLabel: props.billingLabel,
    billingOptions: props.billingOptions,
    currency: props.currency,
    intervals: props.intervals,
    bestValueLabel: props.bestValueLabel,
    compareAction: props.compareAction,
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

export const pricingSectionFields: ComponentConfig<PricingSectionBlockProps>["fields"] =
  {
    heading: { type: "text" },
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
    currency: { type: "text" },
    intervals: {
      type: "object",
      objectFields: {
        monthly: { type: "text" },
        annual: { type: "text" },
      },
    },
    bestValueLabel: { type: "text" },
    compareAction: {
      type: "object",
      objectFields: {
        label: { type: "text" },
        url: { type: "text" },
      },
    },
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
  }

export const pricingSectionDefaultProps: PricingSectionBlockProps = {
  heading: "Choose a plan that fits you the best",
  billingLabel: "Billing interval",
  billingOptions: [
    { label: "Monthly", value: "monthly" },
    { label: "Annual", value: "annual" },
  ],
  currency: "$",
  intervals: { monthly: "/ Month", annual: "/ Year" },
  bestValueLabel: "Best value",
  compareAction: { label: "Compare plans", url: "/pricing#comparison" },
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
}

// Named component required: the hydration scanner matches
// withHydration(Identifier, ...) only.
const PricingSectionComponent = (props: PricingSectionBlockProps) => (
  <PricingSectionView content={mapPricingSectionProps(props)} />
)

export const PricingSection: ComponentConfig<PricingSectionBlockProps> = {
  label: "Pricing section",
  fields: pricingSectionFields,
  defaultProps: pricingSectionDefaultProps,
  render: withHydration(PricingSectionComponent, "load"),
}
