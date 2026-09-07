import type { StorybookConfig } from "@storybook/react-vite"
import { mergeConfig } from "vite"
import { aliases, createStorybookPlugins } from "../tooling/vite.ts"

const config: StorybookConfig = {
  stories: ["../Conloca Design system/components/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: {
    name: "@storybook/react-vite",
    options: { builder: { viteConfigPath: false } },
  },
  viteFinal: (viteConfig) =>
    mergeConfig(viteConfig, {
      plugins: createStorybookPlugins(),
      resolve: { alias: aliases },
    }),
}
export default config
