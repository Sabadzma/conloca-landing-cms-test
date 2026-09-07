import { defineConfig } from "astro/config"
import react from "@astrojs/react"
import { aliases, createStylePlugins } from "./tooling/vite.ts"

export default defineConfig({
  output: "static",
  integrations: [react()],
  vite: { plugins: createStylePlugins(), resolve: { alias: aliases } },
})
