import { expect, test } from "@playwright/test"

const baselineDirectory = process.env.VISUAL_BASELINE_DIR
const widths = [
  375, 639, 640, 641, 768, 1023, 1024, 1025, 1279, 1280, 1281, 1440,
]

test.describe("migration visual comparison", () => {
  test.skip(
    !baselineDirectory,
    "Set VISUAL_BASELINE_DIR to capture or compare a preserved production build",
  )
  test.use({ viewport: { width: 1440, height: 960 } })
  for (const width of widths) {
    test(`${width}px audiences and billing`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 960 })
      await page.goto("/")
      await expect(
        page.getByRole("button", { name: "Show message 1" }),
      ).toBeVisible()
      await page.locator("astro-island[ssr]").waitFor({ state: "detached" })
      await page.evaluate(async () => {
        await document.fonts.ready
        await Promise.all(
          [...document.images].map(async (image) => {
            image.loading = "eager"
            await image.decode()
          }),
        )
      })
      async function captureAudience(audience: string) {
        await page.setViewportSize({ width: 1440, height: 960 })
        await page
          .getByRole("button", { name: audience, exact: true })
          .first()
          .click()
        await page.setViewportSize({ width, height: 960 })
        async function captureInterval(interval: string) {
          await page
            .getByRole("button", { name: interval, exact: true })
            .click()
          await page.evaluate(() => {
            window.scrollTo(0, 0)
            if (document.activeElement instanceof HTMLElement)
              document.activeElement.blur()
          })
          await expect(page).toHaveScreenshot(
            `${width}-${audience}-${interval}.png`,
            {
              fullPage: true,
              animations: "disabled",
              caret: "hide",
              maxDiffPixels: 0,
            },
          )
          expect(
            await page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth,
            ),
          ).toBe(true)
        }
        await captureInterval("Monthly")
        await captureInterval("Annual")
      }
      await captureAudience("Developers")
      await captureAudience("Content editors")
      if (width < 1024) {
        await page.getByRole("button", { name: "Open navigation menu" }).click()
        await page.evaluate(() => window.scrollTo(0, 0))
        await expect(page).toHaveScreenshot(`${width}-navigation.png`, {
          animations: "disabled",
          maxDiffPixels: 0,
        })
      }
    })
  }
  for (const width of [375, 768, 1024, 1440]) {
    test(`${width}px video and focus`, async ({ page }) => {
      await page.setViewportSize({ width, height: 960 })
      await page.route("https://www.youtube.com/**", (route) =>
        route.fulfill({
          body: "<html><body style='background:black'></body></html>",
          contentType: "text/html",
        }),
      )
      await page.goto("/")
      await page.locator("astro-island[ssr]").waitFor({ state: "detached" })
      await page.evaluate(() => document.fonts.ready)
      await page
        .getByRole("button", { name: "Play Conloca demo video" })
        .click()
      await expect(page.getByRole("dialog")).toBeVisible()
      await page.getByRole("button", { name: "Close demo video" }).focus()
      await expect(page).toHaveScreenshot(`${width}-video.png`, {
        animations: "disabled",
        maxDiffPixels: 0,
      })
    })
  }
})
