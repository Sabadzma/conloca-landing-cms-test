import { defineConfig } from "astro/config"
import react from "@astrojs/react"
import node from "@astrojs/node"
import { conlocaCMS } from "@conloca/astro-cms/node"
import { aliases, createStylePlugins } from "./tooling/vite.ts"

export default defineConfig({
  output: "server",
  adapter: node({ mode: "standalone" }),
  integrations: [
    react(),
    conlocaCMS({
      contentRoot: "./content",
      puckConfigPath: "./src/puck.config.tsx",
      schemasPath: "./src/schemas/data.ts",
      assetsPath: "./public/assets/uploads",
      componentPaths: ["src/puck"],
      siteStyles: [
        "./src/index.css",
        "./src/homepage.css",
        "./src/pricing-page.css",
        "./src/how-it-works-page.css",
        "./src/blog.css",
        "./src/article-page.css",
        "./src/terms-page.css",
      ],
      routing: {
        enabled: true,
        siteName: "default",
        locale: "en",
        fallback: "404",
        onConflict: "warn",
        // Single catch-all route: astro-cms 0.1.16's shared page handler emits
        // every configured route's entries from one getStaticPaths, so multiple
        // routes receive foreign entries and crash on missing params. Blog
        // posts live under pages/blog/ and keep their /blog/* URLs.
        routes: {
          pages: {
            // Param must be named "slug": the CMS page handler always emits
            // params.slug from getStaticPaths.
            pattern: "/[...slug]",
            collection: "pages",
            layout: "./src/layouts/site-layout.astro",
            prerender: true,
            dataBindings: {
              pages: { prefix: "/blog/", sort: "date-desc", limit: 50 },
            },
          },
        },
      },
      templates: {
        landing: { label: "Landing page", component: "HeroSection" },
        article: {
          label: "Blog article",
          component: "ArticlePageSections",
          pathPrefix: "/blog/",
        },
      },
    }),
  ],
  vite: { plugins: createStylePlugins(), resolve: { alias: aliases } },
})
