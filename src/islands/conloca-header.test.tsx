import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, expect, it } from "vitest"
import { ConlocaHeader } from "./conloca-header"
import { ConlocaFooter } from "./conloca-footer"

afterEach(cleanup)

const menuItems = [
  { label: "How it works", url: "/#how-it-works" },
  { label: "Blog", url: "/blog" },
] as const
const getStarted = { label: "Get started", url: "/" } as const

it("is a regular function so Astro can match the React renderer", () => {
  expect(typeof ConlocaHeader).toBe("function")
  expect(ConlocaHeader).not.toHaveProperty(
    "$$typeof",
    Symbol.for("react.forward_ref"),
  )
  expect(typeof ConlocaFooter).toBe("function")
  expect(ConlocaFooter).not.toHaveProperty(
    "$$typeof",
    Symbol.for("react.forward_ref"),
  )
})

it("renders the design-system header and footer", () => {
  render(
    <>
      <ConlocaHeader
        menuItems={menuItems}
        primaryButton={getStarted}
        secondaryButton={false}
      />
      <ConlocaFooter
        navigationItems={menuItems}
        action={getStarted}
      />
    </>,
  )

  expect(
    screen.getByRole("navigation", { name: "Primary navigation" }),
  ).toBeInTheDocument()
  expect(screen.getByRole("contentinfo")).toBeInTheDocument()
})
