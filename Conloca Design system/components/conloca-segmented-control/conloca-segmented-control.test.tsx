import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import axe from "axe-core"
import { describe, expect, it, vi } from "vitest"

import { ConlocaSegmentedControl } from "./conloca-segmented-control"

const options = [
  { label: "Monthly", value: "monthly" },
  { label: "Annual", value: "annual" },
  { label: "Lifetime", value: "lifetime" },
] as const

describe("ConlocaSegmentedControl", () => {
  it("keeps one option selected and reports selection changes", async () => {
    const onValueChange = vi.fn()
    const user = userEvent.setup()

    render(
      <ConlocaSegmentedControl
        aria-label="Billing interval"
        onValueChange={onValueChange}
        options={options}
      />,
    )

    const monthly = screen.getByRole("button", { name: "Monthly" })
    const annual = screen.getByRole("button", { name: "Annual" })
    const lifetime = screen.getByRole("button", { name: "Lifetime" })
    const indicator = document.querySelector(
      '[data-slot="conloca-segmented-control-indicator"]',
    )

    expect(screen.getAllByRole("button")).toHaveLength(3)
    expect(indicator).toHaveAttribute("aria-hidden", "true")
    expect(monthly.className).toContain("appearance-none")
    expect(monthly).toHaveAttribute("aria-pressed", "true")
    await user.click(lifetime)
    expect(lifetime).toHaveAttribute("aria-pressed", "true")
    expect(onValueChange).toHaveBeenCalledWith("lifetime", expect.any(Object))

    await user.click(lifetime)
    expect(lifetime).toHaveAttribute("aria-pressed", "true")
    expect(annual).toHaveAttribute("aria-pressed", "false")
  })

  it("has no automated accessibility violations", async () => {
    const { container } = render(
      <ConlocaSegmentedControl
        aria-label="Billing interval"
        options={options}
      />,
    )

    const results = await axe.run(container, {
      rules: {
        // jsdom does not implement the canvas and layout APIs this rule needs.
        "color-contrast": { enabled: false },
      },
    })
    expect(results.violations).toHaveLength(0)
  })
})
