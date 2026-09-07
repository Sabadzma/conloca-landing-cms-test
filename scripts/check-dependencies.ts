import assert from "node:assert/strict"
import { execFileSync } from "node:child_process"
import { createRequire } from "node:module"
import { readFileSync } from "node:fs"

const require = createRequire(import.meta.url)
// npm inspects Bun's installed tree without modifying the lockfile. This catches
// missing required peers and incompatible installed optional peers as well.
execFileSync("npm", ["ls", "--all", "--json"], { stdio: "pipe" })
assert(!readFileSync("bun.lock", "utf8").includes("rolldown-vite"))
for (const host of [
  "astro",
  "@astrojs/react",
  "vitest",
  "@storybook/builder-vite",
]) {
  const resolveFromHost = createRequire(require.resolve(`${host}/package.json`))
  const vite = resolveFromHost("vite/package.json") as {
    name: string
    version: string
  }
  assert.equal(vite.name, "vite")
  assert.equal(vite.version, "8.2.2")
}
for (const name of ["react", "react-dom"]) {
  const manifest = require(`${name}/package.json`) as { version: string }
  assert.equal(manifest.version, "19.2.8")
}
for (const name of [
  "storybook",
  "@storybook/react-vite",
  "@storybook/addon-docs",
  "@storybook/addon-a11y",
]) {
  const manifest = require(`${name}/package.json`) as { version: string }
  assert.equal(manifest.version, "10.6.0")
}
process.stdout.write(
  "Dependency tree valid; official Vite, React, and Storybook resolutions aligned.\n",
)
