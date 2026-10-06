import { useCallback, useEffect, useRef, useState } from "react"
import { ConlocaSegmentedControl } from "@conloca-design-system/components/conloca-segmented-control"
import CheckIcon from "@conloca-design-system/icons/check-01.svg?react"
import type { BillingInterval, ContentLink } from "@/lib/content"
import { SectionLink } from "./section-link"
export interface PricingContent {
  heading: string
  billingLabel: string
  billingOptions: readonly { label: string; value: BillingInterval }[]
  currency: string
  intervals: Record<BillingInterval, string>
  bestValueLabel: string
  compareAction: ContentLink
  plans: readonly {
    name: string
    featured: boolean
    action: ContentLink
    price: number
    description: string
    features: readonly string[]
  }[]
}

export interface PricingSectionProps {
  content: PricingContent
}
export function PricingSection({ content }: PricingSectionProps) {
  const [billing, setBilling] = useState<BillingInterval>("monthly")
  const selectBilling = useCallback((value: string) => {
    if (value === "monthly" || value === "annual") setBilling(value)
  }, [])
  const sectionRef = useRef<HTMLElement>(null)
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const groups = [
      { selector: ".pricing-sticky", entered: "pricing-sticky--entered" },
      { selector: ".pricing-cards", entered: "pricing-cards--entered" },
      { selector: ".pricing-compare", entered: "pricing-compare--entered" },
    ]
      .map(({ selector, entered }) => ({ group: section.querySelector(selector), entered }))
      .filter((item): item is { group: Element; entered: string } => item.group !== null)
    if (typeof IntersectionObserver !== "function") {
      for (const { group, entered } of groups) group.classList.add(entered)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const item = groups.find(({ group }) => group === entry.target)
          if (item) item.group.classList.add(item.entered)
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    )
    for (const { group } of groups) observer.observe(group)
    return () => observer.disconnect()
  }, [])
  return (
    <section ref={sectionRef} className="pricing" id="pricing" aria-labelledby="pricing-heading">
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
