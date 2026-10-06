import { expect, test } from "@playwright/test"

const responsiveWidths = [
  393, 639, 640, 641, 1023, 1024, 1025, 1279, 1280, 1281, 1440, 1441,
  1600,
] as const

test("renders the how-it-works route without asset or hydration errors", async ({
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

  await page.goto("/how-it-works")
  await expect(page.locator("astro-island[ssr]")).toHaveCount(0)
  // Header island only; interactive blocks hydrate from CMS markers (hero,
  // layers, and bento are static — see homepage spec for the mechanism).
  await expect(page.locator('astro-island[client="load"]')).toHaveCount(1)
  const ssrHtml = await (await page.request.get("/how-it-works")).text()
  expect(
    [...ssrHtml.matchAll(/data-hydrate="([^"]+)"/g)].map((match) => match[1]),
  ).toEqual(["HowItWorksSteps", "HowItWorksCta"])
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Your repository is the CMS",
    }),
  ).toBeVisible()
  await expect(page.locator(".hiw-step")).toHaveCount(4)
  await expect(page.locator(".hiw-bento-card")).toHaveCount(4)
  await expect(page.locator(".hiw-layer")).toHaveCount(3)
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
  await page.goto("/how-it-works")

  const geometry = await page.evaluate(() => ({
    bento: document.querySelector(".hiw-bento")?.getBoundingClientRect()
      .height ?? 0,
    cta: document.querySelector(".hiw-cta")?.getBoundingClientRect().height ?? 0,
    footer:
      document.querySelector("footer")?.getBoundingClientRect().height ?? 0,
    header:
      document.querySelector("header")?.getBoundingClientRect().height ?? 0,
    hero: document.querySelector(".hiw-hero")?.getBoundingClientRect()
      .height ?? 0,
    layers: document.querySelector(".hiw-layers")?.getBoundingClientRect()
      .height ?? 0,
    page: document.documentElement.scrollHeight,
    steps:
      document.querySelector(".hiw-steps")?.getBoundingClientRect().height ?? 0,
    visual:
      document.querySelector(".hiw-visual")?.getBoundingClientRect().height ??
      0,
  }))

  const expected: Record<keyof typeof geometry, number> = {
    bento: 752,
    cta: 590,
    footer: 92,
    header: 80,
    hero: 422,
    layers: 505,
    page: 3120,
    steps: 165,
    visual: 514,
  }
  for (const [section, height] of Object.entries(geometry)) {
    const target = expected[section as keyof typeof geometry]
    expect(
      Math.abs(height - target),
      `${section} height within 2px of Figma`,
    ).toBeLessThanOrEqual(2)
  }
})
test("keeps the visual full-bleed and caps content sections above the 1440px content maximum", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1600, height: 960 })
  await page.goto("/how-it-works")

  const geometry = await page.evaluate(() =>
    Object.fromEntries(
      [
        ".hiw-bento",
        ".hiw-cta__banner",
        ".hiw-hero",
        ".hiw-steps",
        ".hiw-visual",
      ].map((selector) => {
        const rect = document.querySelector(selector)?.getBoundingClientRect()
        return [
          selector,
          rect ? { left: rect.left, width: rect.width } : null,
        ]
      }),
    ),
  )

  expect(geometry[".hiw-visual"]).toEqual({ left: 0, width: 1600 })
  expect(geometry[".hiw-hero"]).toEqual({ left: 80, width: 1440 })
  expect(geometry[".hiw-steps"]).toEqual({ left: 112, width: 1376 })
  expect(geometry[".hiw-bento"]).toEqual({ left: 80, width: 1440 })
  expect(geometry[".hiw-cta__banner"]).toEqual({ left: 88, width: 1424 })
})

for (const width of responsiveWidths) {
  test(`has no viewport overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto("/how-it-works")

    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width)
  })
}

test("switches the install command with the package manager tabs", async ({
  page,
}) => {
  await page.goto("/how-it-works")

  await expect(page.locator(".hiw-terminal__command code")).toHaveText(
    "bun add @conloca/astro-cms",
  )
  await page.getByRole("button", { name: "pnpm" }).click()
  await expect(page.locator(".hiw-terminal__command code")).toHaveText(
    "pnpm add @conloca/astro-cms",
  )
  await expect(page.getByRole("button", { name: "pnpm" })).toHaveAttribute(
    "aria-pressed",
    "true",
  )
  await page.getByRole("button", { name: "npm", exact: true }).click()
  await expect(page.locator(".hiw-terminal__command code")).toHaveText(
    "npm install @conloca/astro-cms",
  )
})

test("keeps complete how-it-works content without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto(`${baseURL ?? "http://127.0.0.1:4173"}/how-it-works`)

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Your repository is the CMS",
    }),
  ).toBeVisible()
  await expect(page.locator(".hiw-step")).toHaveCount(4)
  await expect(
    page.getByRole("link", { name: "Read docs" }).first(),
  ).toHaveAttribute("href", "/")
  await expect(page.locator(".hiw-terminal__command code")).toHaveText(
    "bun add @conloca/astro-cms",
  )
  await context.close()
})
