import { ConlocaSegmentedControl } from "@conloca-design-system/components/conloca-segmented-control"
import type { BillingInterval } from "@/lib/content"
import { useBillingInterval } from "./billing"

export interface PricingPageHeroContent {
  breadcrumbs: readonly [string, string]
  heading: string
  description: string
  billingLabel: string
  billingOptions: readonly { label: string; value: BillingInterval }[]
}

export interface PricingPageHeroProps {
  content: PricingPageHeroContent
}

// Pricing page hero with the billing-interval toggle. The interval lives in
// the shared billing store so it stays in sync with the plan prices and the
// comparison table, which hydrate as separate blocks.
export function PricingPageHero({ content }: PricingPageHeroProps) {
  const [billing, selectBilling] = useBillingInterval()
  return (
    <section className="pricing-page-hero" aria-labelledby="pricing-page-heading">
      <div className="pricing-page-hero-content">
        <nav aria-label="Breadcrumb" className="pricing-page-breadcrumbs">
          <ol>
            {content.breadcrumbs.map((breadcrumb) => (
              <li key={breadcrumb}>{breadcrumb}</li>
            ))}
          </ol>
        </nav>
        <div className="pricing-page-hero-body">
          <div className="pricing-page-hero-copy">
            <h1 id="pricing-page-heading">{content.heading}</h1>
            <p>{content.description}</p>
          </div>
          <ConlocaSegmentedControl
            aria-label={content.billingLabel}
            className="pricing-page-hero-billing"
            options={content.billingOptions}
            transparent
            value={billing}
            onValueChange={selectBilling}
          />
        </div>
      </div>
    </section>
  )
}
