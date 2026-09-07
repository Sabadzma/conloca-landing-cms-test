import { expect, test } from "@playwright/test"
import { createRequire } from "node:module"

const require = createRequire(import.meta.url)

test.beforeEach(async ({ page }) => {
  // Keep the external player deterministic while testing its real iframe contract.
  await page.route("https://www.youtube.com/**", (route) =>
    route.fulfill({
      body: "<html><body>Video player</body></html>",
      contentType: "text/html",
    }),
  )
})

test("hydrates three islands with no asset, page, or hydration errors", async ({
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
  await page.goto("/")
  await expect(page.locator("astro-island[ssr]")).toHaveCount(0)
  await expect(page.locator('astro-island[client="load"]')).toHaveCount(3)
  expect(
    await page
      .locator(".capabilities, footer")
      .evaluateAll((nodes) =>
        nodes.every((node) => !node.closest("astro-island")),
      ),
  ).toBe(true)
  await page.evaluate(async () => {
    await document.fonts.ready
    await Promise.all(
      [...document.images].map(async (image) => {
        image.loading = "eager"
        await image.decode()
      }),
    )
  })
  expect(
    await page.evaluate(() => document.fonts.check('700 24px "Inter Display"')),
  ).toBe(true)
  await expect(page.locator("header svg").first()).toBeVisible()
  await expect(page.locator(".plan-features svg").first()).toBeVisible()
  expect(errors).toEqual([])
})

test("keeps hero and features synchronized and resets manual carousel selection", async ({
  page,
}) => {
  await page.goto("/")
  await expect(page.locator("astro-island[ssr]")).toHaveCount(0)
  await page.getByRole("button", { name: "Show message 3" }).click()
  await expect(
    page.getByRole("button", { name: "Play messages" }),
  ).toBeVisible()
  await page
    .getByRole("button", { name: "Content editors", exact: true })
    .nth(2)
    .click()
  await expect(page.locator("h1")).toHaveText(
    "Build and edit pages visually without touching the codebase",
  )
  await expect(page.locator(".audience-sections")).toHaveAttribute(
    "data-audience",
    "editors",
  )
  await Promise.all(
    (
      await page
        .getByRole("button", { name: "Content editors", exact: true })
        .all()
    ).map((button) => expect(button).toHaveAttribute("aria-pressed", "true")),
  )
  await expect(
    page.getByRole("button", { name: "Show message 1" }),
  ).toHaveAttribute("aria-pressed", "true")
  await expect(
    page.getByRole("heading", { name: "Keep every language in sync" }),
  ).toBeVisible()
  await page
    .getByRole("button", { name: "Developers", exact: true })
    .first()
    .click()
  await expect(page.locator("h1")).toHaveText(
    "Keep content in your repo. Give editors a visual editing interface",
  )
  await expect(page.locator(".hero-carousel")).toHaveAttribute(
    "data-running",
    "false",
  )
})

test("switches monthly and annual prices using keyboard controls", async ({
  page,
}) => {
  await page.goto("/")
  await expect(page.locator("astro-island[ssr]")).toHaveCount(0)
  await page.getByRole("button", { name: "Annual", exact: true }).focus()
  await page.keyboard.press("Enter")
  await expect(page.locator(".plan-price strong")).toHaveText([
    "$96",
    "$180",
    "$2400",
  ])
  await expect(page.locator(".plan-price span")).toHaveText([
    "/ Year",
    "/ Year",
    "/ Year",
  ])
  await page.getByRole("button", { name: "Monthly", exact: true }).click()
  await expect(page.locator(".plan-price strong")).toHaveText([
    "$8",
    "$15",
    "$200",
  ])
})

test("traps video focus, dismisses with Escape, removes iframe, and restores focus", async ({
  page,
}) => {
  await page.goto("/")
  await expect(page.locator("astro-island[ssr]")).toHaveCount(0)
  const trigger = page.getByRole("button", { name: "Play Conloca demo video" })
  await trigger.click()
  const dialog = page.getByRole("dialog", { name: "Conloca demo video" })
  await expect(dialog).toBeVisible()
  await expect(dialog.locator("iframe")).toHaveAttribute(
    "src",
    "https://www.youtube.com/embed/zNGWdTLWktY?start=48&autoplay=1&rel=0",
  )
  await expect(
    page.getByRole("button", { name: "Close demo video" }),
  ).toBeFocused()
  await page.keyboard.press("Tab")
  await expect(dialog.locator("iframe")).toBeFocused()
  await page.keyboard.press("Tab")
  await expect(
    page.getByRole("button", { name: "Close demo video" }),
  ).toBeFocused()
  await page.keyboard.press("Shift+Tab")
  await expect(dialog.locator("iframe")).toBeFocused()
  await page.keyboard.press("Shift+Tab")
  await expect(
    page.getByRole("button", { name: "Close demo video" }),
  ).toBeFocused()
  await page.keyboard.press("Escape")
  await expect(dialog).toHaveCount(0)
  await expect(page.locator("iframe")).toHaveCount(0)
  await expect(trigger).toBeFocused()
})

test("supports skip navigation and mobile navigation with preserved destinations", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto("/")
  await expect(page.locator("astro-island[ssr]")).toHaveCount(0)
  await page.keyboard.press("Tab")
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused()
  await page.keyboard.press("Enter")
  await expect(page).toHaveURL(/#main-content$/)
  const menu = page.getByRole("button", { name: "Open navigation menu" })
  await menu.focus()
  await page.keyboard.press("Enter")
  const nav = page.getByRole("navigation", { name: "Mobile navigation" })
  await expect(nav).toBeVisible()
  const blogLink = nav.getByRole("link", { name: "Blog" })
  await expect(blogLink).toHaveAttribute("href", "/blog")
  await Promise.all(
    (await nav.getByRole("link").all()).slice(0, 3).map((link) =>
      expect(link).toHaveAttribute("href", "/"),
    ),
  )
  await nav.getByRole("link", { name: "Pricing" }).click()
  await expect(
    page.getByRole("button", { name: "Open navigation menu" }),
  ).toHaveAttribute("aria-expanded", "false")
  await expect(page.getByRole("link", { name: "Try Demo" })).toHaveAttribute(
    "href",
    "/",
  )
})

test("preserves the existing axe checks and records baseline contrast findings", async ({
  page,
}) => {
  await page.goto("/")
  await expect(page.locator("astro-island[ssr]")).toHaveCount(0)
  await page.addScriptTag({ path: require.resolve("axe-core/axe.min.js") })
  const violations = await page.evaluate(async () => {
    const axe = (window as unknown as { axe: typeof import("axe-core") }).axe
    return (await axe.run(document)).violations.map(({ id, nodes }) => ({
      id,
      targets: nodes.map(({ target }) => target),
    }))
  })
  // These two contrast findings are also present in the preserved Vite build.
  // Keep full axe coverage and fail on any added finding without changing Figma colors.
  expect(violations).toEqual([
    {
      id: "color-contrast",
      targets: [[".astro-badge > span"], ["#capabilities-heading > span"]],
    },
  ])
})

test("retains complete default content and ordinary links with JavaScript disabled", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto(baseURL ?? "http://127.0.0.1:4173")
  await expect(page.locator("h1")).toHaveText(
    "Keep content in your repo. Give editors a visual editing interface",
  )
  await expect(page.locator(".feature")).toHaveCount(3)
  await expect(page.locator(".bento-card")).toHaveCount(7)
  await expect(page.locator(".plan-price strong")).toHaveText([
    "$8",
    "$15",
    "$200",
  ])
  await expect(page.getByAltText("Conloca dashboard preview")).toBeVisible()
  await expect(page.getByRole("link", { name: "Try Demo" })).toHaveAttribute(
    "href",
    "/",
  )
  await expect(
    page
      .getByRole("navigation", { name: "Footer navigation" })
      .getByRole("link"),
  ).toHaveCount(4)
  expect(await page.content()).not.toMatch(
    /<!--app-html-->|entry-client|entry-server/,
  )
  await context.close()
})
