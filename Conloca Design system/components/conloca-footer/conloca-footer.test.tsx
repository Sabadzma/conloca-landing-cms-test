import { createRef } from "react"
import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import axe from "axe-core"
import { afterEach, describe, expect, it, vi } from "vitest"

import { ConlocaFooter } from "./conloca-footer"

/* oxlint-disable react-perf/jsx-no-new-object-as-prop -- Test fixtures are intentionally local to each test. */

const navigationItems = [
  { label: "Product", url: "/product" },
  { label: "Pricing", url: "/pricing" },
] as const

afterEach(cleanup)

describe("ConlocaFooter", () => {
  it("renders supplied navigation, destinations, and action link", () => {
    const ref = createRef<HTMLElement>()

    render(
      <ConlocaFooter
        ref={ref}
        navigationItems={navigationItems}
        action={{ label: "Get started", url: "/signup" }}
      />,
    )

    expect(ref.current).toBe(screen.getByRole("contentinfo"))
    expect(screen.getByRole("link", { name: "Product" })).toHaveAttribute(
      "href",
      "/product",
    )
    expect(screen.getByRole("link", { name: "Pricing" })).toHaveAttribute(
      "href",
      "/pricing",
    )
    expect(screen.getByRole("link", { name: "Get started" })).toHaveAttribute(
      "href",
      "/signup",
    )
  })

  it("supports a button action and hiding the action", async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    const { rerender } = render(
      <ConlocaFooter
        navigationItems={navigationItems}
        action={{ label: "Contact us", onClick }}
      />,
    )

    await user.click(screen.getByRole("button", { name: "Contact us" }))
    expect(onClick).toHaveBeenCalledOnce()

    rerender(
      <ConlocaFooter navigationItems={navigationItems} action={false} />,
    )
    expect(
      screen.queryByRole("button", { name: "Contact us" }),
    ).not.toBeInTheDocument()
  })

  it("prevents disabled action links from being activated", () => {
    const onClick = vi.fn()
    render(
      <ConlocaFooter
        navigationItems={navigationItems}
        action={{
          disabled: true,
          label: "Get started",
          onClick,
          url: "/signup",
        }}
      />,
    )
    const action = screen.getByRole("link", { name: "Get started" })

    expect(action).toHaveAttribute("aria-disabled", "true")
    expect(action).toHaveAttribute("tabindex", "-1")
    expect(
      action.dispatchEvent(
        new MouseEvent("click", { bubbles: true, cancelable: true }),
      ),
    ).toBe(false)
    expect(onClick).not.toHaveBeenCalled()
  })

  it("has no automated accessibility violations", async () => {
    const { container } = render(
      <ConlocaFooter navigationItems={navigationItems} />,
    )
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
