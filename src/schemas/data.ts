import { z } from "zod"
import { definePageSchema } from "@conloca/astro-cms"

// Serializable link/action shapes shared by the header and footer contracts
// (Conloca Design system/components/conloca-header|conloca-footer).
const linkSchema = z.object({
  label: z.string(),
  url: z.string(),
  newTab: z.boolean().optional(),
})

const actionSchema = z.object({
  label: z.string(),
  url: z.string(),
})

// Data collections. Keys must match the collection directory names under
// content/data/ (asserted by the Conloca content API).
export const dataSchemas = {
  // ConlocaHeader props plus the layout's skip-link label.
  navigation: z.object({
    menuItems: z.array(linkSchema),
    primaryButton: actionSchema,
    secondaryButton: actionSchema,
    logoUrl: z.string(),
    navigationLabel: z.string(),
    mobileNavigationLabel: z.string(),
    menuButtonLabel: z.string(),
    menuCloseButtonLabel: z.string(),
    skipLabel: z.string(),
  }),
  // ConlocaFooter props.
  footer: z.object({
    navigationItems: z.array(linkSchema),
    action: actionSchema,
    logoUrl: z.string(),
    logoLabel: z.string(),
    navigationLabel: z.string(),
  }),
}

// Page metadata schemas. "/blog/" matches posts by pathname prefix; CMS core
// fields (title, description, pathname) are provided by the default
// coreFields mode and must not be redeclared here.
export const pageSchemas = {
  "/blog/": definePageSchema({
    label: "Blog article",
    schema: z.object({
      author: z.string().optional(),
      date: z.string().optional(),
      excerpt: z.string().optional(),
    }),
    ui: {
      author: { control: "text" },
      date: { control: "text" },
      excerpt: { control: "textarea" },
    },
  }),
}
