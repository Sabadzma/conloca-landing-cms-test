import { createRef } from "react"
import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"

import { ConlocaProse } from "./conloca-prose"
import type { ConlocaProseBlock } from "./conloca-prose"
/* oxlint-disable react-perf/jsx-no-new-object-as-prop, react-perf/jsx-no-new-array-as-prop -- Test fixtures are intentionally local to each test. */
afterEach(cleanup)

describe("ConlocaProse", () => {
  it("renders each block type with the canonical markup", () => {
    const ref = createRef<HTMLDivElement>()
    const blocks: readonly ConlocaProseBlock[] = [
      { type: "eyebrow", text: "01 — Section" },
      { type: "heading", text: "Title" },
      { type: "heading", text: "Quiet title", weight: "semibold" },
      { type: "paragraph", text: "Body copy." },
      { type: "list", items: ["First", "Second"] },
      { type: "list", items: ["Lettered"], marker: "alpha" },
      { type: "table", items: [{ title: "Term", text: "Definition" }] },
    ]

    render(<ConlocaProse blocks={blocks} ref={ref} />)

    expect(ref.current).toHaveClass("conloca-prose")
    expect(screen.getByText("01 — Section")).toHaveClass(
      "conloca-prose__eyebrow",
    )
    expect(
      screen.getByRole("heading", { level: 2, name: "Quiet title" }),
    ).toHaveClass("conloca-prose__heading--semibold")
    expect(
      screen.getByRole("heading", { level: 2, name: "Title" }),
    ).not.toHaveClass("conloca-prose__heading--semibold")

    const lists = screen.getAllByRole("list")
    expect(lists[0]).not.toHaveAttribute("data-marker")
    expect(lists[1]).toHaveAttribute("data-marker", "alpha")
    expect(screen.getAllByRole("listitem")).toHaveLength(3)
    expect(screen.getByRole("term")).toHaveTextContent("Term")
    expect(screen.getByRole("definition")).toHaveTextContent("Definition")
  })

  it("renders sections and groups as nested flows", () => {
    const blocks: readonly ConlocaProseBlock[] = [
      {
        type: "section",
        id: "anchor",
        blocks: [{ type: "paragraph", text: "Inside section." }],
      },
      {
        type: "group",
        blocks: [{ type: "paragraph", text: "Inside group." }],
      },
    ]

    const { container } = render(<ConlocaProse blocks={blocks} />)

    const section = container.querySelector("section")
    expect(section).toHaveClass("conloca-prose__section")
    expect(section).toHaveAttribute("id", "anchor")
    expect(container.querySelector(".conloca-prose__group")).not.toBeNull()
  })
})
