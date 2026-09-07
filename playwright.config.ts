import { defineConfig } from "@playwright/test"

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  ...(process.env.VISUAL_BASELINE_DIR
    ? { snapshotPathTemplate: `${process.env.VISUAL_BASELINE_DIR}/{arg}{ext}` }
    : {}),
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  ...(process.env.CI ? { workers: 2 } : {}),
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: process.env.SITE_URL ?? "http://127.0.0.1:4173",
    browserName: "chromium",
    viewport: { width: 1440, height: 960 },
    reducedMotion: "reduce",
    trace: "retain-on-failure",
  },
  ...(process.env.SITE_URL
    ? {}
    : {
        webServer: {
          command: "bun run preview --host 127.0.0.1",
          url: "http://127.0.0.1:4173",
          reuseExistingServer: !process.env.CI,
        },
      }),
})
