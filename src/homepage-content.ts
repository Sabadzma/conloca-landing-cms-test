export type Audience = "developers" | "editors"

export const audienceOptions = [
  { label: "Developers", value: "developers" },
  { label: "Content editors", value: "editors" },
] as const

export const navigation = [
  { label: "How it works", url: "/" },
  { label: "Docs", url: "/" },
  { label: "Pricing", url: "/" },
  { label: "Blog", url: "/" },
] as const

export const heroHeadings = {
  developers:
    "Keep content in your repo. Give editors a visual editing interface",
  editors: "Build and edit pages visually without touching the codebase",
} satisfies Record<Audience, string>

export const heroMessages = {
  developers: [
    [
      "Map your React components to typed schemas and MDS blocks in the IDE.",
      " Visual edits respect the structure you define and stay in Git.",
    ],
    [
      "Editors can only use the fields and blocks you define.",
      " Conloca validates each update before writing it back to the repository.",
    ],
    [
      "Route content changes through standard Git pull requests.",
      " Review, approve, or revert them just as you would with code.",
    ],
  ],
  editors: [
    [
      "Developers build and map reusable sections for you.",
      " You use visual editor to build, edit and publish pages without depending on developer.",
    ],
    [
      "Handle multiple languages by changing only what differs.",
      " Shared content stays automatically in sync for every locale.",
    ],
    [
      "Create reusable text fragments once and drop them into any page.",
      " Update a shared block and it stays consistent everywhere.",
    ],
  ],
} satisfies Record<Audience, readonly (readonly [string, string])[]>

export const features = [
  {
    name: "source",
    artwork: "feature-source.svg",
    developers: {
      title: "One source of truth, two ways to work",
      description:
        "Developers work in the IDE. Editors work visually. Every change goes back to the same MDX files in Git.",
    },
    editors: {
      title: "Build and edit pages visually",
      description:
        "Add blocks, move sections, and update content in the visual editor. Conloca handles the files and repository updates.",
    },
  },
  {
    name: "localization",
    artwork: "feature-localization.svg",
    developers: {
      title: "Localization without manual syncing",
      description:
        "Update the source structure once. Each locale follows the same versioned structure. When content changes, Conloca flags the locales that need updating.",
    },
    editors: {
      title: "Keep every language in sync",
      description:
        "Edit only what differs between locales. Shared content stays aligned, and Conloca shows you what still needs updating.",
    },
  },
  {
    name: "history",
    artwork: "feature-history.svg",
    developers: {
      title: "Review, merge, and revert content in Git",
      description:
        "Every edit is written to a file with a readable diff and full history, ready for your existing pull-request workflow. Review changes, merge or roll back anything, any time.",
    },
    editors: {
      title: "See every change. Restore any version.",
      description:
        "Nothing is ever permanently overwritten. Every version of a page is preserved, so you can check what changed and when, then return to an earlier version whenever you need to.",
    },
  },
] as const

export const capabilities = [
  {
    name: "publishing",
    title: "Sceduled Publishing",
    description: "Set a date and time for content to go live automatically",
  },
  {
    name: "git",
    title: "Git-native workflow",
    description: "Every change is a commit. Branch, preview, and merge",
  },
  {
    name: "data",
    title: "Data collections",
    description: "Model and reuse structured data collections",
  },
  {
    name: "fragments",
    title: "Reusable fragments",
    description: "Define and reuse larger content as fragments",
  },
  {
    name: "media",
    title: "Media library",
    description: "Upload assets once and reference them anywhere",
  },
  {
    name: "markdown",
    title: "Type content in Markdown",
    description:
      "Just type the page contents in Makrdown. Conloca will render it",
  },
  {
    name: "history",
    title: "Full version history",
    description: "Build a block once, reuse it across every page",
  },
] as const

export const plans = [
  {
    name: "Simple",
    price: 8,
    description: "For small teams getting their site off the ground",
    features: [
      "3 seats included ($5 per additional seat)",
      "5 seats max",
      "1 repository",
      "1GB repository storage",
      "1GB media storage",
    ],
  },
  {
    name: "Pro",
    price: 15,
    description: "For growing teams shipping content more often",
    features: [
      "10 seats included ($7 per additional seat)",
      "20 seats max",
      "Unlimited repositories",
      "20GB repository storage",
      "100GB media storage",
      "Choose data residency (US/EU)",
      "Basic access control",
      "Support",
    ],
  },
  {
    name: "Business",
    price: 200,
    description: "For larger teams managing sites, brands & markets",
    features: [
      "30 seats included ($10 per additional seat)",
      "No seat limit",
      "Unlimited repositories",
      "30GB repository storage",
      "1TB media storage",
      "Choose data residency (US/EU)",
      "Advanced access control and Audit trail",
      "Priority support",
    ],
  },
] as const
