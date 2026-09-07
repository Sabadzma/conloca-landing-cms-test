import { expect, test } from "@playwright/test"

const referenceViewports = [
  { width: 393, header: 66, hero: 330, card: 448 },
  { width: 640, header: 74, hero: 406, card: 718 },
  { width: 1024, header: 80, hero: 398, card: 460 },
  { width: 1440, header: 80, hero: 398, card: 572 },
] as const

const boundaryWidths = [639, 640, 641, 1023, 1024, 1025, 1279, 1280, 1281]

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
      }
    })

    expect(Math.abs(geometry.header - viewport.header)).toBeLessThan(1)
    expect(Math.abs(geometry.hero - viewport.hero)).toBeLessThan(1.5)
    expect(Math.abs(geometry.card - viewport.card)).toBeLessThan(1)
    expect(geometry.overflow).toBeLessThanOrEqual(0)
  })
}

for (const width of boundaryWidths) {
  test(`switches composition at the ${width}px Figma boundary`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto("/blog")
    const cardHeight = await page
      .locator(".blog-card")
      .first()
      .evaluate((card) => card.getBoundingClientRect().height)
    const expectedHeight =
      width < 640 ? 448 : width < 1024 ? 718 : width < 1280 ? 460 : 572

    expect(Math.abs(cardHeight - expectedHeight)).toBeLessThan(1)
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
