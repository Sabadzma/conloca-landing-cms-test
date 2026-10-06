import { useEffect, useRef } from "react"
import CheckIcon from "@conloca-design-system/icons/check-01.svg?react"
import type { BillingInterval, ContentLink } from "@/lib/content"
import { useBillingInterval } from "./billing"
import { SectionLink } from "./section-link"

export function getDisplayedPrice(
  price: number,
  billing: BillingInterval,
): number {
  return billing === "annual" ? price * 12 : price
}

export interface PricingPagePlan {
  name: string
  featured: boolean
  action: ContentLink
  price: number
  description: string
  features: readonly string[]
}

export interface PricingPagePlansContent {
  currency: string
  intervals: Record<BillingInterval, string>
  bestValueLabel: string
  plans: readonly PricingPagePlan[]
}

export interface PricingPagePlansProps {
  content: PricingPagePlansContent
}

// Plan cards with billing-dependent prices. Prices derive from the shared
// billing store so the hero/comparison toggles update them across blocks.
export function PricingPagePlans({ content }: PricingPagePlansProps) {
  const [billing] = useBillingInterval()
  const intervalLabel = content.intervals[billing]
  const plansRef = useRef<HTMLElement>(null)
  useEffect(() => {
    const section = plansRef.current
    if (!section) return
    const group = section.querySelector(".pricing-cards")
    if (!group) return
    if (typeof IntersectionObserver !== "function") {
      group.classList.add("pricing-cards--entered")
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          group.classList.add("pricing-cards--entered")
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    )
    observer.observe(group)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={plansRef} className="pricing-page-plans" aria-label="Pricing plans">
      <div className="pricing-cards">
        {content.plans.map((plan) => (
          <article
            key={plan.name}
            className={"plan-card" + (plan.featured ? " plan-pro" : "")}
          >
            <div className="plan-summary">
              <div className="plan-summary-content">
                <div className="plan-name">
                  <h2>{plan.name}</h2>
                  {plan.featured ? (
                    <span className="plan-badge">{content.bestValueLabel}</span>
                  ) : null}
                </div>
                <div className="plan-price-description">
                  <p className="plan-price">
                    <strong>
                      {content.currency}
                      {getDisplayedPrice(plan.price, billing)}
                    </strong>
                    <span>{intervalLabel}</span>
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
    </section>
  )
}
