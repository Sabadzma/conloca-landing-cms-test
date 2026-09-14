import { expect, test } from "@playwright/test"

const responsiveWidths = [
  393, 639, 640, 641, 1023, 1024, 1025, 1279, 1280, 1281, 1440, 1441,
  1600,
] as const

test("renders the pricing route without asset or hydration errors", async ({
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

  await page.goto("/pricing")
  await expect(page.locator("astro-island[ssr]")).toHaveCount(0)
  await expect(page.locator('astro-island[client="load"]')).toHaveCount(2)
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Choose a plan that fits you the best",
    }),
  ).toBeVisible()
  await expect(page.locator(".plan-card")).toHaveCount(3)
  await expect(page.getByRole("table")).toBeVisible()
  const header = page.getByRole("banner")
  await expect(
    header.getByRole("link", { name: "How it works" }),
  ).toHaveAttribute("href", "/how-it-works")
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
  await page.evaluate(async () => {
    await document.fonts.ready
    await Promise.all([...document.images].map((image) => image.decode()))
  })
  expect(errors).toEqual([])
})

test("matches the 1440px Figma section geometry", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 960 })
  await page.goto("/pricing")

  const geometry = await page.evaluate(() => ({
    assistant:
      document.querySelector(".pricing-assistant")?.getBoundingClientRect()
        .height ?? 0,
    comparison:
      document.querySelector(".pricing-comparison")?.getBoundingClientRect()
        .height ?? 0,
    footer:
      document.querySelector("footer")?.getBoundingClientRect().height ?? 0,
    header:
      document.querySelector("header")?.getBoundingClientRect().height ?? 0,
    hero:
      document.querySelector(".pricing-page-hero")?.getBoundingClientRect()
        .height ?? 0,
    page: document.documentElement.scrollHeight,
    plans:
      document.querySelector(".pricing-page-plans")?.getBoundingClientRect()
        .height ?? 0,
  }))

  expect(geometry).toEqual({
    assistant: 590,
    comparison: 1521,
    footer: 92,
    header: 80,
    hero: 612,
    page: 3640,
    plans: 825,
  })
})

test("keeps the hero full-bleed above the 1440px content maximum", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1600, height: 960 })
  await page.goto("/pricing")

  const geometry = await page.evaluate(() => {
    const breadcrumb = document
      .querySelector(".pricing-page-breadcrumbs")
      ?.getBoundingClientRect()
    const content = document
      .querySelector(".pricing-page-hero-content")
      ?.getBoundingClientRect()
    const header = document
      .querySelector('[data-slot="conloca-header-container"]')
      ?.getBoundingClientRect()
    const logo = document
      .querySelector('[data-slot="conloca-header-logo-link"]')
      ?.getBoundingClientRect()
    const hero = document
      .querySelector(".pricing-page-hero")
      ?.getBoundingClientRect()

    return {
      breadcrumb: breadcrumb
        ? { left: breadcrumb.left, width: breadcrumb.width }
        : null,
      content: content ? { left: content.left, width: content.width } : null,
      header: header ? { left: header.left, width: header.width } : null,
      logo: logo ? { left: logo.left, width: logo.width } : null,
      hero: hero ? { left: hero.left, width: hero.width } : null,
    }
  })

  expect(geometry.hero).toEqual({ left: 0, width: 1600 })
  expect(geometry.content).toEqual({ left: 80, width: 1440 })
  expect(geometry.header).toEqual({ left: 80, width: 1440 })
  expect(geometry.breadcrumb?.left).toBe(geometry.logo?.left)
})

for (const width of responsiveWidths) {
  test(`has no viewport overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto("/pricing")

    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width)
  })
}

test("synchronizes both billing controls", async ({ page }) => {
  await page.goto("/pricing")
  await page.getByRole("button", { name: "Annual" }).first().click()

  await expect(page.locator(".plan-price strong")).toHaveText([
    "$96",
    "$180",
    "$2400",
  ])
  await expect(page.locator(".pricing-comparison-price strong")).toHaveText([
    "$96",
    "$180",
    "$2400",
  ])
  await Promise.all(
    (await page.getByRole("button", { name: "Annual" }).all()).map((control) =>
      expect(control).toHaveAttribute("aria-pressed", "true"),
    ),
  )
})

test("keeps complete pricing content without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto(`${baseURL ?? "http://127.0.0.1:4173"}/pricing`)

  await expect(page.locator(".plan-card")).toHaveCount(3)
  await expect(page.getByRole("table")).toBeVisible()
  await expect(page.getByRole("link", { name: "Ask ChatGPT" })).toHaveAttribute(
    "href",
    "https://chatgpt.com/?prompt=Explore+https%3A%2F%2Fconloca.com%2Fgetting-started%2F+and+https%3A%2F%2Fconloca.com%2Fhow-it-works%2F.+Explain+what+Conloca+is%2C+how+it+works%2C+and+why+a+team+might+prefer+it+over+a+traditional+CMS.&utm_source=chatgpt.com",
  )
  await context.close()
})
