import { expect, test } from "@playwright/test"

const articlePath = "/blog/one-change-across-three-systems"
const visualEditingArticlePath = "/blog/edit-what-you-see"

const referenceViewports = [
  { width: 393, header: 66, hero: 442 },
  { width: 640, header: 74, hero: 669 },
  { width: 1024, header: 80, hero: 638 },
  { width: 1440, header: 80, hero: 611 },
] as const

const responsiveWidths = [
  393, 639, 640, 641, 1023, 1024, 1025, 1279, 1280, 1281, 1440, 1441, 1600,
]

function expectedCoverRatio(width: number) {
  if (width < 640) return 381 / 268
  if (width < 1024) return 624 / 424
  return 1424 / 632
}

function expectedRelatedRatio(width: number) {
  if (width < 640) return null
  if (width < 1024) return null
  if (width < 1280) return 1008 / 460
  return 1424 / 572
}

test("renders the article route without page, asset, or hydration errors", async ({
  page,
}) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  page.on("console", (message) => {
    if (
      message.type() === "error" ||
      /hydration|did not match/i.test(message.text())
    )
      errors.push(message.text())
  })
  page.on("response", (response) => {
    if (
      response.url().startsWith("http://127.0.0.1:") &&
      response.status() >= 400
    )
      errors.push(`${response.status()} ${response.url()}`)
  })
  page.on("requestfailed", (request) => {
    if (request.url().startsWith("http://127.0.0.1:"))
      errors.push(request.url())
  })

  await page.goto(articlePath)
  await expect(page.locator("astro-island[ssr]")).toHaveCount(0)
  await expect(page.locator('astro-island[client="load"]')).toHaveCount(1)
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "One change shouldn’t get lost across three systems",
    }),
  ).toBeVisible()
  await expect(page.locator(".article-related-card")).toHaveCount(2)
  await page.evaluate(async () => {
    await document.fonts.ready
    await Promise.all([...document.images].map((image) => image.decode()))
  })
  expect(errors).toEqual([])
})

for (const viewport of referenceViewports) {
  test(`matches the ${viewport.width}px Figma hero geometry`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: viewport.width, height: 900 })
    await page.goto(articlePath)
    await page.evaluate(async () => {
      await document.fonts.ready
      await Promise.all([...document.images].map((image) => image.decode()))
    })

    const geometry = await page.evaluate(() => {
      const cover = document.querySelector(".article-cover__frame")
      const related = document.querySelector(".article-related-card")
      return {
        cover: cover?.getBoundingClientRect() ?? { height: 0, width: 0 },
        header:
          document.querySelector("header.conloca-header, header")
            ?.getBoundingClientRect().height ?? 0,
        hero:
          document.querySelector(".article-hero")?.getBoundingClientRect()
            .height ?? 0,
        overflow: document.documentElement.scrollWidth - innerWidth,
        related: related?.getBoundingClientRect() ?? { height: 0, width: 0 },
      }
    })

    expect(Math.abs(geometry.header - viewport.header)).toBeLessThan(1)
    expect(Math.abs(geometry.hero - viewport.hero)).toBeLessThan(2)
    expect(geometry.overflow).toBeLessThanOrEqual(0)
    expect(
      Math.abs(
        geometry.cover.width / geometry.cover.height -
          expectedCoverRatio(viewport.width),
      ),
    ).toBeLessThan(0.01)
  })
}

for (const width of responsiveWidths) {
  test(`preserves article cover and related sizing at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto(articlePath)

    const geometry = await page.evaluate(() => {
      const cover = document.querySelector(".article-cover__frame")
      const stories = document.querySelector(".article-related__stories")
      const cards = [...document.querySelectorAll(".article-related-card")].map(
        (card) => card.getBoundingClientRect(),
      )
      return {
        cards,
        cover: cover?.getBoundingClientRect() ?? { height: 0, width: 0 },
        overflow: document.documentElement.scrollWidth - innerWidth,
        stories: stories?.getBoundingClientRect().width ?? 0,
      }
    })

    expect(
      Math.abs(
        geometry.cover.width / geometry.cover.height - expectedCoverRatio(width),
      ),
    ).toBeLessThan(0.01)

    const relatedRatio = expectedRelatedRatio(width)
    if (relatedRatio !== null) {
      for (const card of geometry.cards) {
        expect(Math.abs(card.width / card.height - relatedRatio)).toBeLessThan(
          0.01,
        )
      }
    } else if (width < 640) {
      for (const card of geometry.cards) {
        expect(Math.abs(card.height - 448)).toBeLessThan(1)
      }
    } else {
      for (const card of geometry.cards) {
        expect(Math.abs(card.height - 572)).toBeLessThan(1)
      }
    }

    expect(geometry.overflow).toBeLessThanOrEqual(0)
    expect(geometry.stories).toBeLessThanOrEqual(Math.min(width, 1440) + 0.5)
  })
}

test("keeps the table of contents 72px from the viewport top while scrolling", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(articlePath)

  const toc = page.locator(".article-toc")
  await expect(toc).toBeVisible()
  expect(
    await toc.evaluate((element) => element.getBoundingClientRect().top),
  ).toBeGreaterThan(72)

  await page.locator("#git-safety-net").scrollIntoViewIfNeeded()
  expect(
    Math.abs(
      await toc.evaluate((element) => element.getBoundingClientRect().top) - 72,
    ),
  ).toBeLessThan(1)

  await page.locator(".article-related").scrollIntoViewIfNeeded()
  expect(
    await toc.evaluate((element) => element.getBoundingClientRect().top),
  ).toBeLessThan(72)
})

test("renders the visual editing article without page, asset, or hydration errors", async ({
  page,
}) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  page.on("console", (message) => {
    if (
      message.type() === "error" ||
      /hydration|did not match/i.test(message.text())
    )
      errors.push(message.text())
  })
  page.on("response", (response) => {
    if (
      response.url().startsWith("http://127.0.0.1:") &&
      response.status() >= 400
    )
      errors.push(`${response.status()} ${response.url()}`)
  })
  page.on("requestfailed", (request) => {
    if (request.url().startsWith("http://127.0.0.1:"))
      errors.push(request.url())
  })

  await page.goto(visualEditingArticlePath)
  await expect(page.locator("astro-island[ssr]")).toHaveCount(0)
  await expect(page.locator('astro-island[client="load"]')).toHaveCount(1)
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Edit what you see, without losing control of your code",
    }),
  ).toBeVisible()
  const header = page.getByRole("banner")
  await expect(
    header.getByRole("link", { name: "How it works" }),
  ).toHaveAttribute("href", "/")
  await expect(header.getByRole("link", { name: "Docs" })).toHaveAttribute(
    "href",
    "https://conloca.com/getting-started/",
  )
  await expect(header.getByRole("link", { name: "Pricing" })).toHaveAttribute(
    "href",
    "/pricing",
  )
  await expect(header.getByRole("link", { name: "Blog" })).toHaveAttribute(
    "href",
    "/blog",
  )
  await expect(
    page.getByRole("link", {
      name: /One change shouldn't get lost across three systems/,
    }),
  ).toHaveAttribute("href", articlePath)
  await page.evaluate(async () => {
    await document.fonts.ready
    await Promise.all([...document.images].map((image) => image.decode()))
  })
  expect(errors).toEqual([])
})

test("keeps the complete article content and links without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto(`${baseURL ?? "http://127.0.0.1:4173"}${articlePath}`)
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "One change shouldn’t get lost across three systems",
    }),
  ).toBeVisible()
  const header = page.getByRole("banner")
  await expect(
    header.getByRole("link", { name: "How it works" }),
  ).toHaveAttribute("href", "/")
  await expect(header.getByRole("link", { name: "Docs" })).toHaveAttribute(
    "href",
    "https://conloca.com/getting-started/",
  )
  await expect(header.getByRole("link", { name: "Pricing" })).toHaveAttribute(
    "href",
    "/pricing",
  )
  await expect(header.getByRole("link", { name: "Blog" })).toHaveAttribute(
    "href",
    "/blog",
  )
  await expect(page.locator(".article-related-card")).toHaveCount(2)
  await expect(
    page.getByRole("heading", {
      level: 2,
      name: "Git's safety net without Git's learning curve",
    }),
  ).toBeVisible()
  await context.close()
})
