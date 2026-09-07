import { afterEach, expect, it } from "vitest"
import { cleanup, render, screen, waitFor } from "@testing-library/react"
import { prerender } from "react-dom/static"
import { ConlocaButton } from "./conloca-button"

afterEach(cleanup)

it("resolves the lazy catalog and exact SVG in an icon-bearing button", async () => {
  render(<ConlocaButton icon="search-01">Search</ConlocaButton>)
  const button = screen.getByRole("button", { name: "Search" })
  await waitFor(() =>
    expect(
      button.querySelector('[data-slot="button-icon"] svg'),
    ).not.toBeNull(),
  )
})

it("includes a lazy SVG in static React output without needing hydration", async () => {
  const { prelude } = await prerender(
    <ConlocaButton icon="plus-02">Add</ConlocaButton>,
  )
  const html = await new Response(prelude).text()
  expect(html).toContain('data-slot="button-icon"')
  expect(html).toContain("<svg")
  expect(html).toContain("Add")
})
