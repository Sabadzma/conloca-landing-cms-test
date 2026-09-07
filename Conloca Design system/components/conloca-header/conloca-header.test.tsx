import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import axe from "axe-core"
import { afterEach, describe, expect, it, vi } from "vitest"

/* oxlint-disable react-perf/jsx-no-new-object-as-prop -- Test fixtures are intentionally local to each test. */

import { ConlocaHeader } from "./conloca-header"

const menuItems = [
  { label: "Product", url: "/product" },
  { label: "Pricing", url: "/pricing" },
] as const

afterEach(cleanup)

describe("ConlocaHeader", () => {
  it("includes the entrance animation hook", () => {
    render(<ConlocaHeader menuItems={menuItems} />)

    expect(screen.getByRole("banner")).toHaveClass("conloca-header-appear")
  })

  it("renders supplied navigation and configurable actions", async () => {
    const onPrimaryClick = vi.fn()
    const onMenuClick = vi.fn()
    const onMenuExpandedChange = vi.fn()
    const primaryButton = { label: "Start now", onClick: onPrimaryClick }
    const user = userEvent.setup()

    render(
      <ConlocaHeader
        menuControls="mobile-navigation"
        menuItems={menuItems}
        primaryButton={primaryButton}
        secondaryButton={false}
        onMenuClick={onMenuClick}
        onMenuExpandedChange={onMenuExpandedChange}
      />,
    )

    expect(
      screen.getByRole("navigation", { name: "Primary navigation" }),
    ).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Product" })).toHaveAttribute(
      "href",
      "/product",
    )
    expect(
      screen.queryByRole("button", { name: "Secondary" }),
    ).not.toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Start now" }))
    expect(onPrimaryClick).toHaveBeenCalledOnce()

    const menuButton = screen.getByRole("button", {
      name: "Open navigation menu",
    })
    expect(menuButton).toHaveAttribute("aria-controls", "mobile-navigation")
    expect(menuButton).toHaveAttribute("aria-expanded", "false")
    await user.click(menuButton)
    expect(onMenuClick).toHaveBeenCalledOnce()
    expect(onMenuExpandedChange).toHaveBeenLastCalledWith(true)

    const closeButton = screen.getByRole("button", {
      name: "Close navigation menu",
    })
    expect(closeButton).toHaveAttribute("aria-expanded", "true")
    expect(
      screen.getByRole("navigation", { name: "Mobile navigation" }),
    ).toBeInTheDocument()

    await user.click(closeButton)
    expect(onMenuExpandedChange).toHaveBeenLastCalledWith(false)
    expect(
      screen.getByRole("button", { name: "Open navigation menu" }),
    ).toHaveAttribute("aria-expanded", "false")
  })

  it("supports a controlled expanded state", async () => {
    const onMenuExpandedChange = vi.fn()
    const user = userEvent.setup()
    const { rerender } = render(
      <ConlocaHeader
        menuExpanded
        menuItems={menuItems}
        onMenuExpandedChange={onMenuExpandedChange}
      />,
    )

    await user.click(
      screen.getByRole("button", { name: "Close navigation menu" }),
    )
    expect(onMenuExpandedChange).toHaveBeenCalledWith(false)
    expect(
      screen.getByRole("button", { name: "Close navigation menu" }),
    ).toHaveAttribute("aria-expanded", "true")

    rerender(
      <ConlocaHeader
        menuExpanded={false}
        menuItems={menuItems}
        onMenuExpandedChange={onMenuExpandedChange}
      />,
    )
    expect(
      screen.getByRole("button", { name: "Open navigation menu" }),
    ).toHaveAttribute("aria-expanded", "false")
  })

  it("renders action URLs as links", () => {
    const primaryButton = { label: "Sign up", url: "/signup" }
    const secondaryButton = { label: "Log in", url: "/login" }

    render(
      <ConlocaHeader
        menuItems={menuItems}
        primaryButton={primaryButton}
        secondaryButton={secondaryButton}
      />,
    )

    expect(screen.getByRole("link", { name: "Sign up" })).toHaveAttribute(
      "href",
      "/signup",
    )
    expect(screen.getByRole("link", { name: "Log in" })).toHaveAttribute(
      "href",
      "/login",
    )
  })

  it("has no automated accessibility violations", async () => {
    const { container } = render(
      <ConlocaHeader defaultMenuExpanded menuItems={menuItems} />,
    )
    const results = await axe.run(container, {
      rules: {
        // jsdom does not implement the canvas and layout APIs this rule needs.
        "color-contrast": { enabled: false },
      },
    })

    expect(
      results.violations.map((violation) => ({
        id: violation.id,
        targets: violation.nodes.map((node) => node.target),
      })),
    ).toEqual([])
  })
})
