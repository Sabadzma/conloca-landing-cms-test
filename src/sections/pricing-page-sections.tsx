import { useCallback, useEffect, useRef, useState } from "react"
import { conlocaButtonVariants } from "@conloca-design-system/components/conloca-button"
import { ConlocaSegmentedControl } from "@conloca-design-system/components/conloca-segmented-control"
import ChatGPTIcon from "@conloca-design-system/icons/gpt.svg?react"
import ClaudeIcon from "@conloca-design-system/icons/claude.svg?react"
import GeminiIcon from "@conloca-design-system/icons/gemini.svg?react"
import GrokIcon from "@conloca-design-system/icons/grok.svg?react"
import MailIcon from "@conloca-design-system/icons/chat-square-01.svg?react"
import CheckIcon from "@conloca-design-system/icons/check-01.svg?react"
import type { BillingInterval } from "@/homepage-content"
import {
  getDisplayedPrice,
  type PricingAssistantIcon,
  type PricingPageContent,
} from "@/pricing-page-content"
import { SectionLink } from "./section-link"

export interface PricingPageSectionsProps {
  content: PricingPageContent
}

const assistantIcons = {
  chatgpt: ChatGPTIcon,
  claude: ClaudeIcon,
  gemini: GeminiIcon,
  grok: GrokIcon,
  mail: MailIcon,
} satisfies Record<PricingAssistantIcon, typeof ChatGPTIcon>

export function PricingPageSections({ content }: PricingPageSectionsProps) {
  const [billing, setBilling] = useState<BillingInterval>("monthly")
  const selectBilling = useCallback((value: string) => {
    if (value === "monthly" || value === "annual") setBilling(value)
  }, [])
  const plansRef = useRef<HTMLElement>(null)
  useEffect(() => {
    const section = plansRef.current
    if (!section) return
    const groups = [
      { selector: ".pricing-cards", entered: "pricing-cards--entered" },
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

  const intervalLabel = content.pricing.intervals[billing]

  return (
    <>
      <section className="pricing-page-hero" aria-labelledby="pricing-page-heading">
        <div className="pricing-page-hero-content">
          <nav aria-label="Breadcrumb" className="pricing-page-breadcrumbs">
            <ol>
              {content.hero.breadcrumbs.map((breadcrumb) => (
                <li key={breadcrumb}>{breadcrumb}</li>
              ))}
            </ol>
          </nav>
          <div className="pricing-page-hero-body">
            <div className="pricing-page-hero-copy">
              <h1 id="pricing-page-heading">{content.hero.heading}</h1>
              <p>{content.hero.description}</p>
            </div>
            <ConlocaSegmentedControl
              aria-label={content.pricing.billingLabel}
              className="pricing-page-hero-billing"
              options={content.pricing.billingOptions}
              transparent
              value={billing}
              onValueChange={selectBilling}
            />
          </div>
        </div>
      </section>

      <section ref={plansRef} className="pricing-page-plans" aria-label="Pricing plans">
        <div className="pricing-cards">
          {content.pricing.plans.map((plan) => (
            <article
              key={plan.name}
              className={"plan-card" + (plan.featured ? " plan-pro" : "")}
            >
              <div className="plan-summary">
                <div className="plan-summary-content">
                  <div className="plan-name">
                    <h2>{plan.name}</h2>
                    {plan.featured ? (
                      <span className="plan-badge">
                        {content.pricing.bestValueLabel}
                      </span>
                    ) : null}
                  </div>
                  <div className="plan-price-description">
                    <p className="plan-price">
                      <strong>
                        {content.pricing.currency}
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

      <section
        id="comparison"
        className="pricing-comparison"
        aria-labelledby="pricing-comparison-heading"
      >
        <div className="pricing-comparison-intro">
          <div className="pricing-comparison-copy">
            <p className="pricing-comparison-eyebrow">
              {content.comparison.eyebrow}
            </p>
            <h2 id="pricing-comparison-heading">
              {content.comparison.heading}
            </h2>
          </div>
          <ConlocaSegmentedControl
            aria-label={content.comparison.billingLabel}
            className="pricing-comparison-billing"
            options={content.pricing.billingOptions}
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
                <th scope="col">{content.comparison.leadColumnLabel}</th>
                {content.pricing.plans.map((plan) => (
                  <th
                    key={plan.name}
                    className={plan.featured ? "is-featured" : undefined}
                    scope="col"
                  >
                    <span className="pricing-comparison-plan-name">
                      <span>{plan.name}</span>
                      {plan.featured ? (
                        <span className="plan-badge">
                          {content.pricing.bestValueLabel}
                        </span>
                      ) : null}
                    </span>
                    <span className="pricing-comparison-price">
                      <strong>
                        {content.pricing.currency}
                        {getDisplayedPrice(plan.price, billing)}
                      </strong>
                      <span>{intervalLabel}</span>
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            {content.comparison.groups.map((group) => (
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
                      const planName = content.pricing.plans[index]?.name
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
                {content.pricing.plans.map((plan, index) => (
                  <td
                    key={plan.name}
                    className={plan.featured ? "is-featured" : undefined}
                  >
                    <SectionLink
                      href={plan.action.url}
                      variant={plan.featured ? "primary" : "secondary"}
                      className="h-[44px] w-full rounded-[12px] font-bold"
                    >
                      {content.comparison.actionLabels[index]}
                    </SectionLink>
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      <section className="pricing-assistant" aria-labelledby="pricing-assistant-heading">
        <div className="pricing-assistant-inner">
          <div className="pricing-assistant-copy">
            <h2 id="pricing-assistant-heading">{content.assistant.heading}</h2>
            <p>{content.assistant.description}</p>
          </div>
          <div className="pricing-assistant-actions">
            {content.assistant.actions.map((action) => {
              const Icon = assistantIcons[action.icon]
              return (
                <a
                  key={action.label}
                  className={conlocaButtonVariants({
                    variant: "secondary",
                    size: "default",
                  }) + " pricing-assistant-action"}
                  data-slot="conloca-button"
                  href={action.url}
                  rel={action.newTab ? "noopener noreferrer" : undefined}
                  target={action.newTab ? "_blank" : undefined}
                >
                  <Icon aria-hidden="true" />
                  <span>{action.label}</span>
                </a>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
