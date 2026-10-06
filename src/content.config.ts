import { createConlocaCollections } from "@conloca/astro-cms/node/content"

// Collections are discovered from the content/ directory: page collections
// from content/<site>/*/, data collections (navigation, footer) from
// content/data/*/. Schemas for editor forms live in src/schemas/data.ts
// (wired via astro.config.ts schemasPath).
export const { collections } = await createConlocaCollections({
  contentRoot: "./content",
  site: "default",
})
