import { defineConfig } from "vitest/config"
import { aliases, createReactPlugins } from "./tooling/vite.ts"

export default defineConfig({
  plugins: createReactPlugins(),
  resolve: { alias: aliases },
  test: {
    include: [
      "src/**/*.test.{ts,tsx}",
      "Conloca Design system/**/*.test.{ts,tsx}",
    ],
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
  },
})
