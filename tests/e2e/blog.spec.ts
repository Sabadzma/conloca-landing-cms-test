import { expect, test } from "@playwright/test"

const referenceViewports = [
  { width: 393, header: 66, hero: 330, page: 1189.511 },
  { width: 640, header: 74, hero: 406, page: 1677.207 },
  { width: 1024, header: 80, hero: 398, page: 2450 },
  { width: 1281, header: 80, hero: 398, page: 2642.528 },
  { width: 1360, header: 80, hero: 398, page: 2769.461 },
  { width: 1440, header: 80, hero: 398, page: 2898 },
] as const

const responsiveWidths = [
  639,
  640,
  641,
  800,
  1023,
  1024,
  1025,
  1152,
  1279,
  1280,
  1281,
  1360,
  1439,
  1440,
  1441,
]

function expectedCardHeight(width: number) {
  if (width < 640) return 448

  const cardWidth = Math.min(width, 1440) - 16

  if (width < 1024) return (cardWidth * 718) / 624
  if (width < 1280) return (cardWidth * 460) / 1008

  return (cardWidth * 572) / 1424
}

function expectedCardAspectRatio(width: number) {
  if (width < 640) return null
  if (width < 1024) return 624 / 718
  if (width < 1280) return 1008 / 460

  return 1424 / 572
}

test("renders the Blog route without page, asset, or hydration errors", async ({
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

  await page.goto("/blog")
  await expect(page.locator("astro-island[ssr]")).toHaveCount(0)
  await expect(page.locator('astro-island[client="load"]')).toHaveCount(1)
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Notes on content, code, and the space between",
    }),
  ).toBeVisible()
  await expect(page.locator(".blog-card")).toHaveCount(4)
  await page.evaluate(async () => {
    await document.fonts.ready
    await Promise.all([...document.images].map((image) => image.decode()))
  })
  expect(
    await page.evaluate(() =>
      document.fonts.check('500 32px "Inter Display"'),
    ),
  ).toBe(true)
  expect(errors).toEqual([])
})

for (const viewport of referenceViewports) {
  test(`matches the ${viewport.width}px Figma layout geometry`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: viewport.width, height: 900 })
    await page.goto("/blog")
    await page.evaluate(async () => {
      await document.fonts.ready
      await Promise.all([...document.images].map((image) => image.decode()))
    })

    const geometry = await page.evaluate(() => {
      return {
        card:
          document.querySelector(".blog-card")?.getBoundingClientRect()
            .height ?? 0,
        footer:
          document.querySelector("footer")?.getBoundingClientRect().height ??
          0,
        header:
          document.querySelector("header")?.getBoundingClientRect().height ??
          0,
        hero:
          document.querySelector(".blog-hero")?.getBoundingClientRect().height ??
          0,
        overflow: document.documentElement.scrollWidth - innerWidth,
        page: document.documentElement.scrollHeight,
      }
    })

    expect(Math.abs(geometry.header - viewport.header)).toBeLessThan(1)
    expect(Math.abs(geometry.hero - viewport.hero)).toBeLessThan(1.5)
    expect(
      Math.abs(geometry.card - expectedCardHeight(viewport.width)),
    ).toBeLessThan(1)
    expect(Math.abs(geometry.page - viewport.page)).toBeLessThan(1)
    expect(geometry.overflow).toBeLessThanOrEqual(0)
  })
}

for (const width of responsiveWidths) {
  test(`preserves proportional card sizing at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto("/blog")
    const cardRects = await page.locator(".blog-card").evaluateAll((cards) =>
      cards.map((card) => {
        const { height, width: cardWidth } = card.getBoundingClientRect()
        return { height, width: cardWidth }
      }),
    )
    const aspectRatio = expectedCardAspectRatio(width)

    expect(
      Math.abs(cardRects[0].height - expectedCardHeight(width)),
    ).toBeLessThan(1)
    if (aspectRatio !== null) {
      for (const card of cardRects) {
        expect(Math.abs(card.width / card.height - aspectRatio)).toBeLessThan(
          0.001,
        )
      }
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width)
  })
}

test("keeps the complete Blog content and links without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto(`${baseURL ?? "http://127.0.0.1:4173"}/blog`)
  await expect(page.locator(".blog-card")).toHaveCount(4)
  await expect(page.getByRole("link", { name: "Blog" }).first()).toHaveAttribute(
    "href",
    "/blog",
  )
  await expect(
    page.getByRole("heading", {
      level: 2,
      name: "One change shouldn't get lost across three systems",
    }),
  ).toHaveCount(2)
  await context.close()
})
