import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import axe from "axe-core"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { AudienceSections } from "./sections/audience-sections"
import { PricingSection } from "./sections/pricing-section"
import { CapabilitiesSection } from "./sections/capabilities-section"
import { ConlocaHeader } from "@conloca-design-system/components/conloca-header"
import { ConlocaFooter } from "@conloca-design-system/components/conloca-footer"
import {
  audienceContent,
  pricingContent,
  capabilitiesContent,
  headerContent,
  footerContent,
} from "./homepage-content"

// lottie-web touches canvas at module scope, which jsdom cannot provide; the
// tests do not exercise animation playback, so the player is stubbed out.
vi.mock("lottie-web", () => ({
  default: {
    loadAnimation: () => ({
      addEventListener: () => {},
      destroy: () => {},
      setLoop: () => {},
      playSegments: () => {},
      play: () => {},
      stop: () => {},
      goToAndStop: () => {},
    }),
  },
}))

// Test fixture only: the production document and composition belong to Astro.
function HomepageSections() {
  return (
    <>
      <ConlocaHeader {...headerContent} />
      <main>
        <AudienceSections content={audienceContent} />
        <CapabilitiesSection content={capabilitiesContent} />
        <PricingSection content={pricingContent} />
      </main>
      <ConlocaFooter {...footerContent} />
    </>
  )
}

beforeEach(() => {
  vi.stubGlobal("matchMedia", (media: string) => ({
    media,
    matches: media === "(prefers-reduced-motion: reduce)",
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: () => true,
  }))
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe("Conloca homepage", () => {
  it("switches all prices between monthly and twelve-month annual totals", async () => {
    const user = userEvent.setup()
    render(<HomepageSections />)
    await user.click(screen.getByRole("button", { name: "Annual" }))
    for (const price of ["$96", "$180", "$2400"])
      expect(screen.getByText(price)).toBeVisible()
    expect(screen.getAllByText("/ Year")).toHaveLength(3)
    await user.click(screen.getByRole("button", { name: "Monthly" }))
    for (const price of ["$8", "$15", "$200"])
      expect(screen.getByText(price)).toBeVisible()
  })

  it("keeps audience switches synchronized and supports manual carousel navigation", async () => {
    const user = userEvent.setup()
    render(<HomepageSections />)
    const originalHeading = screen.getByRole("heading", {
      level: 1,
    }).textContent
    await user.click(
      screen.getAllByRole("button", { name: "Content editors" })[0]!,
    )
    expect(screen.getByRole("heading", { level: 1 }).textContent).not.toBe(
      originalHeading,
    )
    expect(
      screen.getByRole("heading", { level: 1 }).closest(".audience-sections"),
    ).toHaveAttribute("data-audience", "editors")
    for (const radio of screen.getAllByRole("button", {
      name: "Content editors",
    })) {
      expect(radio).toHaveAttribute("aria-pressed", "true")
    }
    await user.click(screen.getByRole("button", { name: "Show message 3" }))
    expect(
      screen.getByRole("button", { name: "Show message 3" }),
    ).toHaveAttribute("aria-pressed", "true")
    expect(
      screen.getByRole("button", { name: "Play messages" }),
    ).toBeInTheDocument()
  })

  it("opens the requested video, traps focus, removes playback, and restores focus on Escape", async () => {
    const user = userEvent.setup()
    render(<HomepageSections />)
    const trigger = screen.getByRole("button", {
      name: "Play Conloca demo video",
    })
    await user.click(trigger)
    const dialog = screen.getByRole("dialog", { name: "Conloca demo video" })
    const iframe = within(dialog).getByTitle("Conloca demo video")
    expect(iframe).toHaveAttribute(
      "src",
      "https://www.youtube.com/embed/zNGWdTLWktY?start=48&autoplay=1&rel=0",
    )
    await waitFor(() =>
      expect(dialog.contains(document.activeElement)).toBe(true),
    )
    await user.keyboard("{Escape}")
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    )
    expect(screen.queryByTitle("Conloca demo video")).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it("provides homepage links and no automated accessibility violations", async () => {
    const { container } = render(<HomepageSections />)
    const editorLinks = screen.getAllByRole("link", { name: "Try editor" })
    expect(editorLinks).toHaveLength(2)
    for (const link of editorLinks) {
      expect(link).toHaveAttribute("href", "/")
    }
    expect(
      screen.queryByRole("link", { name: "Try Demo" }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole("button", { name: "Try Demo" }),
    ).not.toBeInTheDocument()
    const primaryNavigation = within(
      screen.getByRole("navigation", { name: "Primary navigation" }),
    )
    for (const { label, url } of headerContent.menuItems) {
      expect(primaryNavigation.getByRole("link", { name: label })).toHaveAttribute(
        "href",
        url,
      )
    }
    const results = await axe.run(container, {
      rules: { "color-contrast": { enabled: false } },
    })
    expect(
      results.violations.map((violation) => ({
        id: violation.id,
        targets: violation.nodes.map((node) => node.target),
      })),
    ).toEqual([])
  })
})

const customPricingContent = {
  ...pricingContent,
  heading: "Plans for your team",
  compareAction: { label: "Plan details", url: "/plans" },
  plans: [
    {
      name: "Custom",
      price: 23,
      featured: false,
      action: { label: "Start custom", url: "/custom" },
      description: "Custom description",
      features: ["Custom feature"],
    },
  ],
}

it("renders supplied section content and destinations without coupling to the defaults", () => {
  render(<PricingSection content={customPricingContent} />)
  expect(
    screen.getByRole("heading", { name: "Plans for your team" }),
  ).toBeVisible()
  expect(screen.getByText("$23")).toBeVisible()
  expect(screen.getByRole("link", { name: "Start custom" })).toHaveAttribute(
    "href",
    "/custom",
  )
  expect(screen.getByRole("link", { name: "Plan details" })).toHaveAttribute(
    "href",
    "/plans",
  )
})

const customAudienceContent = {
  ...audienceContent,
  hero: {
    ...audienceContent.hero,
    headings: {
      developers: "Custom developer heading",
      editors: "Custom editor heading",
    },
  },
}

it("switches audience from a feature, resets the carousel, and renders supplied hero copy", async () => {
  const user = userEvent.setup()

  render(<AudienceSections content={customAudienceContent} />)
  await user.click(screen.getByRole("button", { name: "Show message 3" }))
  await user.click(
    screen.getAllByRole("button", { name: "Content editors" })[2]!,
  )
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
    "Custom editor heading",
  )
  expect(
    screen.getByRole("button", { name: "Show message 1" }),
  ).toHaveAttribute("aria-pressed", "true")
  expect(
    screen.getByRole("heading", { name: "Keep every language in sync" }),
  ).toBeVisible()
  for (const button of screen.getAllByRole("button", {
    name: "Content editors",
  }))
    expect(button).toHaveAttribute("aria-pressed", "true")
})
