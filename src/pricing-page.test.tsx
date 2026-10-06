import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { PricingPageHero } from "@/sections/pricing-page-hero"
import { PricingPagePlans } from "@/sections/pricing-page-plans"
import { PricingPageComparison } from "@/sections/pricing-page-comparison"
import { PricingPageAssistant } from "@/sections/pricing-page-assistant"
import { resetBilling } from "@/sections/billing"
import {
  PricingPageHero as PricingPageHeroBlock,
  mapPricingPageHeroProps,
} from "@/puck/blocks/pricing-page-hero"
import {
  PricingPagePlans as PricingPagePlansBlock,
  mapPricingPagePlansProps,
} from "@/puck/blocks/pricing-page-plans"
import {
  PricingPageComparison as PricingPageComparisonBlock,
  mapPricingPageComparisonProps,
} from "@/puck/blocks/pricing-page-comparison"
import {
  PricingPageAssistantBlock,
  mapPricingPageAssistantProps,
} from "@/puck/blocks/pricing-page-assistant-block"

// Canonical copy lives in the block defaultProps after the CMS cutover.
function required<T>(value: T | undefined, name: string): T {
  if (value === undefined) throw new Error(`${name} has no defaultProps`)
  return value
}
const heroContent = mapPricingPageHeroProps(
  required(PricingPageHeroBlock.defaultProps, "PricingPageHeroBlock"),
)
const plansContent = mapPricingPagePlansProps(
  required(PricingPagePlansBlock.defaultProps, "PricingPagePlansBlock"),
)
const comparisonContent = mapPricingPageComparisonProps(
  required(
    PricingPageComparisonBlock.defaultProps,
    "PricingPageComparisonBlock",
  ),
)
const assistantContent = mapPricingPageAssistantProps(
  required(PricingPageAssistantBlock.defaultProps, "PricingPageAssistantBlock"),
)

function PricingPage() {
  return (
    <>
      <PricingPageHero content={heroContent} />
      <PricingPagePlans content={plansContent} />
      <PricingPageComparison content={comparisonContent} />
      <PricingPageAssistant content={assistantContent} />
    </>
  )
}

beforeEach(() => {
  resetBilling()
})

afterEach(() => {
  cleanup()
})

describe("Conloca pricing page", () => {
  it("renders every plan and comparison group", () => {
    render(<PricingPage />)

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Choose a plan that fits you the best",
      }),
    ).toBeInTheDocument()
    expect(screen.getAllByRole("article")).toHaveLength(3)
    expect(screen.getByRole("table")).toBeInTheDocument()
    expect(screen.getByText("Governance & support")).toBeInTheDocument()
    const askChatGpt = new URL(
      screen.getByRole("link", { name: "Ask ChatGPT" }).getAttribute("href") ??
        "",
    )
    expect(askChatGpt.origin).toBe("https://chatgpt.com")
    expect(askChatGpt.searchParams.get("prompt")).toContain("Conloca")
    expect(
      screen.getAllByRole("link", { name: "Choose business" }),
    ).not.toHaveLength(0)
  })

  it("keeps hero, cards, and comparison prices on the same billing interval", () => {
    render(<PricingPage />)

    const annualControls = screen.getAllByRole("button", { name: "Annual" })
    fireEvent.click(annualControls[0])

    // Two controls (hero + comparison) and prices in both the plan cards and
    // the table headers derive from the shared billing store.
    expect(screen.getAllByText("$96")).toHaveLength(2)
    expect(screen.getAllByText("$180")).toHaveLength(2)
    expect(screen.getAllByText("$2400")).toHaveLength(2)
  })
})
