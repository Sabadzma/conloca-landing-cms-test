import { useCallback, useState } from "react"
import { ConlocaSegmentedControl } from "@conloca-design-system/components/conloca-segmented-control"
import CheckIcon from "@conloca-design-system/icons/check-01.svg?react"
import type { BillingInterval, PricingContent } from "@/homepage-content"
import { SectionLink } from "./section-link"

export interface PricingSectionProps {
  content: PricingContent
}
export function PricingSection({ content }: PricingSectionProps) {
  const [billing, setBilling] = useState<BillingInterval>("monthly")
  const selectBilling = useCallback((value: string) => {
    if (value === "monthly" || value === "annual") setBilling(value)
  }, [])
  return (
    <section className="pricing" id="pricing" aria-labelledby="pricing-heading">
      <header className="pricing-sticky">
        <div className="pricing-intro">
          <h2 id="pricing-heading">{content.heading}</h2>
        </div>
        <ConlocaSegmentedControl
          className="pricing-billing"
          aria-label={content.billingLabel}
          options={content.billingOptions}
          value={billing}
          onValueChange={selectBilling}
        />
      </header>
      <div className="pricing-cards">
        {content.plans.map((plan) => (
          <article
            key={plan.name}
            className={"plan-card" + (plan.featured ? " plan-pro" : "")}
          >
            <div className="plan-summary">
              <div className="plan-summary-content">
                <div className="plan-name">
                  <h3>{plan.name}</h3>
                  {plan.featured && (
                    <span className="plan-badge">{content.bestValueLabel}</span>
                  )}
                </div>
                <div className="plan-price-description">
                  <p className="plan-price">
                    <strong>
                      {content.currency +
                        plan.price * (billing === "annual" ? 12 : 1)}
                    </strong>
                    <span>{content.intervals[billing]}</span>
                  </p>
                  <p className="plan-description">{plan.description}</p>
                </div>
              </div>
              <SectionLink
                href={plan.action.url}
                variant={plan.featured ? "primary" : "secondary"}
                className="h-[44px] w-full rounded-[12px] font-bold"
              >
                {plan.action.label}
              </SectionLink>
            </div>
            <ul className="plan-features">
              {plan.features.map((feature) => (
                <li key={feature}>
                  <CheckIcon aria-hidden="true" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <SectionLink
        href={content.compareAction.url}
        variant="secondary"
        className="pricing-compare"
      >
        {content.compareAction.label}
      </SectionLink>
    </section>
  )
}
