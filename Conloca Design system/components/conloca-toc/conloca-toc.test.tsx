import { createRef } from "react"
import { cleanup, render, screen } from "@testing-library/react"
import axe from "axe-core"
import { afterEach, describe, expect, it } from "vitest"

import { ConlocaToc } from "./conloca-toc"

/* oxlint-disable react-perf/jsx-no-new-object-as-prop -- Test fixtures are intentionally local to each test. */

const items = [
  { id: "definitions", title: "Definitions" },
  { id: "security", title: "Security" },
  { id: "general", title: "General" },
] as const

afterEach(cleanup)

describe("ConlocaToc", () => {
  it("renders a named navigation landmark with numbered anchor links", () => {
    const ref = createRef<HTMLElement>()

    render(<ConlocaToc items={items} label="Contents" ref={ref} />)

    expect(ref.current).toBe(
      screen.getByRole("navigation", { name: "Contents" }),
    )
    const links = screen.getAllByRole("link")
    expect(links).toHaveLength(3)
    expect(links[0]).toHaveAttribute("href", "#definitions")
    expect(links[0]).toHaveTextContent("01")
    expect(links[0]).toHaveTextContent("Definitions")
    expect(links[2]).toHaveTextContent("03")
    expect(links[2]).toHaveAttribute("href", "#general")
  })

  it("has no automated accessibility violations", async () => {
    const { container } = render(<ConlocaToc items={items} label="Contents" />)

    const results = await axe.run(container)
    expect(results.violations).toEqual([])
  })
})
