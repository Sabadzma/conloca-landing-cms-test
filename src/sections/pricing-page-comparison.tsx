import { ConlocaSegmentedControl } from "@conloca-design-system/components/conloca-segmented-control"
import type { BillingInterval, ContentLink } from "@/lib/content"
import { useBillingInterval } from "./billing"
import { getDisplayedPrice } from "./pricing-page-plans"
import { SectionLink } from "./section-link"

export interface PricingComparisonRow {
  label: string
  values: readonly [string, string, string]
}

export interface PricingComparisonGroup {
  label: string
  rows: readonly PricingComparisonRow[]
}

export interface PricingComparisonPlanHeader {
  name: string
  featured: boolean
  action: ContentLink
  price: number
}

export interface PricingPageComparisonContent {
  eyebrow: string
  heading: string
  billingLabel: string
  leadColumnLabel: string
  actionLabels: readonly [string, string, string]
  groups: readonly PricingComparisonGroup[]
  billingOptions: readonly { label: string; value: BillingInterval }[]
  currency: string
  intervals: Record<BillingInterval, string>
  bestValueLabel: string
  plans: readonly PricingComparisonPlanHeader[]
}

export interface PricingPageComparisonProps {
  content: PricingPageComparisonContent
}

// Comparison table with its own billing toggle; both the toggle and the
// per-plan header prices derive from the shared billing store, so they stay
// in sync with the hero toggle and the plan cards across hydrated blocks.
export function PricingPageComparison({ content }: PricingPageComparisonProps) {
  const [billing, selectBilling] = useBillingInterval()
  const intervalLabel = content.intervals[billing]
  return (
    <section
      id="comparison"
      className="pricing-comparison"
      aria-labelledby="pricing-comparison-heading"
    >
      <div className="pricing-comparison-intro">
        <div className="pricing-comparison-copy">
          <p className="pricing-comparison-eyebrow">{content.eyebrow}</p>
          <h2 id="pricing-comparison-heading">{content.heading}</h2>
        </div>
        <ConlocaSegmentedControl
          aria-label={content.billingLabel}
          className="pricing-comparison-billing"
          options={content.billingOptions}
          value={billing}
          onValueChange={selectBilling}
        />
      </div>

      <div
        aria-labelledby="pricing-comparison-heading"
        className="pricing-comparison-scroll"
        role="region"
        tabIndex={0}
      >
        <table>
          <colgroup>
            <col className="pricing-comparison-label-column" />
            <col />
            <col />
            <col />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">{content.leadColumnLabel}</th>
              {content.plans.map((plan) => (
                <th
                  key={plan.name}
                  className={plan.featured ? "is-featured" : undefined}
                  scope="col"
                >
                  <span className="pricing-comparison-plan-name">
                    <span>{plan.name}</span>
                    {plan.featured ? (
                      <span className="plan-badge">
                        {content.bestValueLabel}
                      </span>
                    ) : null}
                  </span>
                  <span className="pricing-comparison-price">
                    <strong>
                      {content.currency}
                      {getDisplayedPrice(plan.price, billing)}
                    </strong>
                    <span>{intervalLabel}</span>
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          {content.groups.map((group) => (
            <tbody key={group.label}>
              <tr className="pricing-comparison-group">
                <th colSpan={4} scope="colgroup">
                  {group.label}
                </th>
              </tr>
              {group.rows.map((row) => (
                <tr key={row.label}>
                  <th scope="row">{row.label}</th>
                  {row.values.map((value, index) => {
                    const planName = content.plans[index]?.name
                    return (
                      <td
                        key={planName ?? value}
                        className={index === 1 ? "is-featured" : undefined}
                      >
                        {value}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          ))}
          <tfoot>
            <tr>
              <td aria-hidden="true" />
              {content.plans.map((plan, index) => (
                <td
                  key={plan.name}
                  className={plan.featured ? "is-featured" : undefined}
                >
                  <SectionLink
                    href={plan.action.url}
                    variant={plan.featured ? "primary" : "secondary"}
                    className="h-[44px] w-full rounded-[12px] font-bold"
                  >
                    {content.actionLabels[index]}
                  </SectionLink>
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  )
}
