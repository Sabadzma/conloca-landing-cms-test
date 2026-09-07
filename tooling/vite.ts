import { fileURLToPath } from "node:url"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import svgr from "vite-plugin-svgr"

export const aliases = {
  "@": fileURLToPath(new URL("../src", import.meta.url)),
  "@conloca-design-system": fileURLToPath(
    new URL("../Conloca Design system", import.meta.url),
  ),
}

// Each host gets fresh plugin instances. Astro owns its React transform.
export const createStylePlugins = () => [svgr(), tailwindcss()]
export const createReactPlugins = () => [react(), svgr()]
export const createStorybookPlugins = () => [react(), ...createStylePlugins()]
