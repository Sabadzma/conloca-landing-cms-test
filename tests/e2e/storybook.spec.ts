import { expect, test } from "@playwright/test"
import { preview } from "vite"
import type { PreviewServer } from "vite"

let server: PreviewServer
let origin: string

test.beforeAll(async () => {
  server = await preview({
    configFile: false,
    build: { outDir: "storybook-static" },
    preview: { host: "127.0.0.1", port: 6190 },
  })
  origin = server.resolvedUrls?.local[0] ?? "http://127.0.0.1:6190"
})
test.afterAll(async () => {
  await new Promise<void>((resolve, reject) =>
    server.httpServer.close((error) => (error ? reject(error) : resolve())),
  )
})

test("all seven catalogs expose Docs, Canvas examples, controls, and exact SVG icons", async ({
  page,
  request,
}) => {
  const response = await request.get(new URL("index.json", origin).href)
  const index = (await response.json()) as {
    entries: Record<string, { id: string; type: string; title: string }>
  }
  const entries = Object.values(index.entries)
  const docs = entries.filter((entry) => entry.type === "docs")
  expect(docs).toHaveLength(7)
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  page.on("response", (res) => {
    if (res.url().startsWith(origin) && res.status() >= 400)
      errors.push(res.url())
  })
  await Promise.all(
    docs.map(async (doc) => {
      const docPage = await page.context().newPage()
      docPage.on("pageerror", (error) => errors.push(error.message))
      expect(
        entries.some(
          (entry) => entry.title === doc.title && entry.type === "story",
        ),
      ).toBe(true)
      await docPage.goto(
        new URL(`iframe.html?id=${doc.id}&viewMode=docs`, origin).href,
      )
      await expect(docPage.locator(".sbdocs-content")).toBeVisible()
      await expect(docPage.locator(".docblock-argstable").first()).toBeVisible()
      await docPage.close()
    }),
  )
  await page.goto(
    new URL(
      "iframe.html?id=conloca-conlocaicon--default&viewMode=story",
      origin,
    ).href,
  )
  await expect(page.locator('[data-slot="conloca-icon"] svg')).toBeVisible()
  await page.goto(
    new URL(
      "iframe.html?id=conloca-conlocabutton--primary&viewMode=story",
      origin,
    ).href,
  )
  await expect(
    page.locator('[data-slot="conloca-button"]').first(),
  ).toBeVisible()
  await expect(
    page.locator('[data-slot="conloca-button"] svg').first(),
  ).toBeVisible()
  expect(errors).toEqual([])
})
