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
import { App } from "./App"

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
    render(<App />)
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
    render(<App />)
    const originalHeading = screen.getByRole("heading", {
      level: 1,
    }).textContent
    await user.click(
      screen.getAllByRole("button", { name: "Content editors" })[0]!,
    )
    expect(screen.getByRole("heading", { level: 1 }).textContent).not.toBe(
      originalHeading,
    )
    expect(screen.getByRole("main")).toHaveAttribute("data-audience", "editors")
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
    render(<App />)
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
    const { container } = render(<App />)
    expect(screen.getByRole("link", { name: "Try Demo" })).toHaveAttribute(
      "href",
      "/",
    )
    expect(screen.getByRole("link", { name: "Try editor" })).toHaveAttribute(
      "href",
      "/",
    )
    expect(
      screen.queryByRole("button", { name: "Try Demo" }),
    ).not.toBeInTheDocument()
    for (const link of within(
      screen.getByRole("navigation", { name: "Primary navigation" }),
    ).getAllByRole("link")) {
      expect(link).toHaveAttribute("href", "/")
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
