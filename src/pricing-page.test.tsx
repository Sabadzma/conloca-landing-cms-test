import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { pricingPageContent } from "@/pricing-page-content"
import { PricingPageSections } from "@/sections/pricing-page-sections"

describe("Conloca pricing page", () => {
  it("renders every plan and comparison group", () => {
    render(<PricingPageSections content={pricingPageContent} />)

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
    render(<PricingPageSections content={pricingPageContent} />)

    const annualControls = screen.getAllByRole("button", { name: "Annual" })
    fireEvent.click(annualControls[0])

    expect(screen.getAllByText("$96")).toHaveLength(2)
    expect(screen.getAllByText("$180")).toHaveLength(2)
    expect(screen.getAllByText("$2400")).toHaveLength(2)
  })
})
