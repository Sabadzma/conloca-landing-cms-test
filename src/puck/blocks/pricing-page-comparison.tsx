import type { ComponentConfig } from "@puckeditor/core"
import { withHydration } from "@conloca/astro-cms/hydration"
import type { BillingInterval } from "@/lib/content"
import {
  PricingPageComparison as PricingPageComparisonView,
  type PricingPageComparisonContent,
} from "@/sections/pricing-page-comparison"

// Puck-storable props: 3-string tuples are stored as exactly-three { text }
// arrays and booleans as radio "true"/"false" strings. The plan headers
// duplicate the plans block's name/price/action so the table stays editable
// independently — keep both in sync when changing plans.
export interface PricingPageComparisonBlockProps {
  eyebrow: string
  heading: string
  billingLabel: string
  leadColumnLabel: string
  actionLabels: { text: string }[]
  groups: {
    label: string
    rows: { label: string; values: { text: string }[] }[]
  }[]
  billingOptions: { label: string; value: BillingInterval }[]
  currency: string
  intervals: { monthly: string; annual: string }
  bestValueLabel: string
  plans: {
    name: string
    featured: "true" | "false"
    action: { label: string; url: string }
    price: number
  }[]
}

export function mapPricingPageComparisonProps(
  props: PricingPageComparisonBlockProps,
): PricingPageComparisonContent {
  const [firstLabel = "", secondLabel = "", thirdLabel = ""] =
    props.actionLabels.map((label) => label.text)
  return {
    eyebrow: props.eyebrow,
    heading: props.heading,
    billingLabel: props.billingLabel,
    leadColumnLabel: props.leadColumnLabel,
    actionLabels: [firstLabel, secondLabel, thirdLabel],
    groups: props.groups.map((group) => ({
      label: group.label,
      rows: group.rows.map((row) => {
        const [first = "", second = "", third = ""] = row.values.map(
          (value) => value.text,
        )
        return { label: row.label, values: [first, second, third] }
      }),
    })),
    billingOptions: props.billingOptions,
    currency: props.currency,
    intervals: props.intervals as Record<BillingInterval, string>,
    bestValueLabel: props.bestValueLabel,
    plans: props.plans.map((plan) => ({
      name: plan.name,
      featured: plan.featured === "true",
      action: plan.action,
      price: plan.price,
    })),
  }
}

function PricingPageComparisonComponent(props: PricingPageComparisonBlockProps) {
  return (
    <PricingPageComparisonView
      content={mapPricingPageComparisonProps(props)}
    />
  )
}

export const PricingPageComparison: ComponentConfig<PricingPageComparisonBlockProps> =
  {
    label: "Pricing page comparison",
    fields: {
      eyebrow: { type: "text" },
      heading: { type: "text" },
      billingLabel: { type: "text" },
      leadColumnLabel: { type: "text" },
      actionLabels: {
        type: "array",
        arrayFields: { text: { type: "text" } },
        min: 3,
        max: 3,
        getItemSummary: (item) => item.text,
      },
      groups: {
        type: "array",
        arrayFields: {
          label: { type: "text" },
          rows: {
            type: "array",
            arrayFields: {
              label: { type: "text" },
              values: {
                type: "array",
                arrayFields: { text: { type: "text" } },
                min: 3,
                max: 3,
                getItemSummary: (item) => item.text,
              },
            },
            getItemSummary: (item) => item.label,
            // Puck's add-item flow uses defaultItemProps ?? {}; without this
            // the new row's `values` is undefined and the section crashes.
            defaultItemProps: {
              label: "",
              values: [{ text: "" }, { text: "" }, { text: "" }],
            },
          },
        },
        getItemSummary: (item) => item.label,
        // Puck's add-item flow uses defaultItemProps ?? {}; without this the
        // new group's `rows` is undefined and the section crashes.
        defaultItemProps: { label: "", rows: [] },
      },
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
        },
        getItemSummary: (item) => item.name,
        // Puck's add-item flow uses defaultItemProps ?? {}; without this the
        // new plan's `action` is undefined and the section crashes.
        defaultItemProps: {
          name: "",
          featured: "false",
          action: { label: "", url: "/" },
          price: 0,
        },
      },
    },
    defaultProps: {
      eyebrow: "Detailed comparison",
      heading: "Compare every limit and capability",
      billingLabel: "Comparison billing interval",
      leadColumnLabel: "What your team gets",
      actionLabels: [
        { text: "Choose simple" },
        { text: "Choose pro" },
        { text: "Choose business" },
      ],
      groups: [
        {
          label: "Team",
          rows: [
            {
              label: "Seats included",
              values: [
                { text: "3 seats" },
                { text: "10 seats" },
                { text: "30 seats" },
              ],
            },
            {
              label: "Additional seat",
              values: [
                { text: "$5 / seat" },
                { text: "$7 / seat" },
                { text: "$10 / seat" },
              ],
            },
            {
              label: "Seat limit",
              values: [
                { text: "5 seats" },
                { text: "20 seats" },
                { text: "No limit" },
              ],
            },
          ],
        },
        {
          label: "Repositories",
          rows: [
            {
              label: "Repositories",
              values: [{ text: "1" }, { text: "Unlimited" }, { text: "Unlimited" }],
            },
          ],
        },
        {
          label: "Storage",
          rows: [
            {
              label: "Repository storage",
              values: [{ text: "1GB" }, { text: "20GB" }, { text: "30GB" }],
            },
            {
              label: "Media storage",
              values: [{ text: "1GB" }, { text: "100GB" }, { text: "1TB" }],
            },
          ],
        },
        {
          label: "Governance & support",
          rows: [
            {
              label: "Choose data residency (US/EU)",
              values: [{ text: "—" }, { text: "Included" }, { text: "Included" }],
            },
            {
              label: "Access control",
              values: [{ text: "—" }, { text: "Basic" }, { text: "Advanced" }],
            },
            {
              label: "Audit trail",
              values: [{ text: "—" }, { text: "—" }, { text: "Included" }],
            },
            {
              label: "Support",
              values: [{ text: "—" }, { text: "Included" }, { text: "Priority" }],
            },
          ],
        },
      ],
      billingOptions: [
        { label: "Monthly", value: "monthly" },
        { label: "Annual", value: "annual" },
      ],
      currency: "$",
      intervals: { monthly: "/ Month", annual: "/ Year" },
      bestValueLabel: "Best value",
      plans: [
        {
          name: "Simple",
          featured: "false",
          action: { label: "Choose simple", url: "/" },
          price: 8,
        },
        {
          name: "Pro",
          featured: "true",
          action: { label: "Choose pro", url: "/" },
          price: 15,
        },
        {
          name: "Business",
          featured: "false",
          action: { label: "Choose business", url: "/" },
          price: 200,
        },
      ],
    },
    render: withHydration(PricingPageComparisonComponent, "load"),
  }
