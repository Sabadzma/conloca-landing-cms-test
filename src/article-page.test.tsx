import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"
import { articlePageContent } from "@/article-page-content"
import { ArticlePageSections } from "@/sections/article-page-sections"

afterEach(() => {
  cleanup()
})

describe("Conloca article page", () => {
  it("renders the article title, table of contents, and related stories", () => {
    render(<ArticlePageSections content={articlePageContent} />)

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "One change shouldn’t get lost across three systems",
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole("navigation", { name: "In this article" }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: "01 Git’s safety net" }),
    ).toHaveAttribute("href", "#git-safety-net")
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Continue reading",
      }),
    ).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "More stories" })).toHaveAttribute(
      "href",
      "/blog",
    )
    expect(
      screen.getByRole("link", {
        name: /Edit what you see, without losing control of your code/,
      }),
    ).toHaveAttribute("href", "/blog/edit-what-you-see")
  })

  it("keeps the authored body sections in source order", () => {
    render(<ArticlePageSections content={articlePageContent} />)

    const headings = screen
      .getAllByRole("heading", { level: 2 })
      .map((heading) => heading.textContent)

    expect(headings).toEqual([
      "Here's how it works in practice:",
      "Git's safety net without Git's learning curve",
      "One campaign shouldn't mean rebuilding everything",
      "A fast site is already a marketing advantage",
      "An agent-native CMS needs a strong memory",
      "A CMS that doesn't take your site hostage",
      "Continue reading",
    ])
  })
})
