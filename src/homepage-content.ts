// Serializable editorial data. Runtime callbacks and layout belong in sections.
export interface ContentLink {
  label: string
  url: string
}
export type BillingInterval = "monthly" | "annual"
export type HeroMessages = readonly [
  readonly [string, string],
  ...(readonly [string, string])[],
]
export interface AudienceOption {
  label: string
  value: Audience
}
export interface HeroContent {
  headings: Record<Audience, string>
  messages: Record<Audience, HeroMessages>
  audienceLabel: string
  badge: string
  primaryAction: ContentLink
  secondaryAction: ContentLink
  carousel: {
    label: string
    chooseLabel: string
    showLabel: string
    playLabel: string
    pauseLabel: string
  }
  video: {
    title: string
    playLabel: string
    closeLabel: string
    url: string
    poster: { src: string; alt: string; width: number; height: number }
  }
}
export interface FeatureContent {
  name: "source" | "localization" | "history"
  artwork: string
  developers: { title: string; description: string }
  editors: { title: string; description: string }
}
export interface FeatureControls {
  audienceLabelPrefix: string
  primaryAction: ContentLink
  secondaryAction: ContentLink
}
export interface AudienceContent {
  options: readonly AudienceOption[]
  hero: HeroContent
  features: readonly FeatureContent[]
  featureControls: FeatureControls
}
export interface CapabilitiesContent {
  heading: string
  subheading: string
  items: readonly {
    name:
      | "publishing"
      | "git"
      | "data"
      | "fragments"
      | "media"
      | "markdown"
      | "history"
    title: string
    description: string
  }[]
}
export interface PricingContent {
  heading: string
  billingLabel: string
  billingOptions: readonly { label: string; value: BillingInterval }[]
  currency: string
  intervals: Record<BillingInterval, string>
  bestValueLabel: string
  compareAction: ContentLink
  plans: readonly {
    name: string
    featured: boolean
    action: ContentLink
    price: number
    description: string
    features: readonly string[]
  }[]
}
export interface HomepageMetadata {
  language: string
  title: string
  description: string
  skipLabel: string
}

export type Audience = "developers" | "editors"

export const audienceOptions = [
  { label: "Developers", value: "developers" },
  { label: "Content editors", value: "editors" },
] as const

export const navigation = [
  { label: "How it works", url: "/how-it-works" },
  { label: "Docs", url: "https://conloca.com/getting-started/" },
  { label: "Pricing", url: "/pricing" },
  { label: "Blog", url: "/blog" },
] as const

// Footer-only: legal pages are linked from the footer, never the header nav.
export const footerNavigation = [
  ...navigation,
  { label: "Terms", url: "/terms" },
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
} satisfies Record<Audience, HeroMessages>

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
    title: "Scheduled Publishing",
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
      "Just type the page contents in Markdown. Conloca will render it",
  },
  {
    name: "history",
    title: "Full version history",
    description: "Review changes and restore any previous version",
  },
] as const

export const plans = [
  {
    name: "Simple",
    featured: false,
    action: { label: "Choose simple", url: "/" },
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
    featured: true,
    action: { label: "Choose pro", url: "/" },
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
    featured: false,
    action: { label: "Choose business", url: "/" },
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

export const metadata: HomepageMetadata = {
  language: "en",
  title: "Conloca — Git-native content, visual editing",
  description:
    "Keep content in your repo. Give editors a visual editing interface. Conloca brings Git-native content management to Astro.",
  skipLabel: "Skip to content",
}
export const headerContent = {
  menuItems: navigation,
  primaryButton: { label: "Get started", url: "/" },
  secondaryButton: { label: "Try editor", url: "/" },
  logoUrl: "/",
  navigationLabel: "Primary navigation",
  mobileNavigationLabel: "Mobile navigation",
  menuButtonLabel: "Open navigation menu",
  menuCloseButtonLabel: "Close navigation menu",
}
export const footerContent = {
  navigationItems: footerNavigation,
  action: { label: "Get started", url: "/" },
  logoUrl: "/",
  logoLabel: "Conloca home",
  navigationLabel: "Footer navigation",
}
export const audienceContent: AudienceContent = {
  options: audienceOptions,
  hero: {
    headings: heroHeadings,
    messages: heroMessages,
    audienceLabel: "Choose your role",
    badge: "Built for Astro",
    primaryAction: { label: "Get started", url: "/" },
    secondaryAction: { label: "Try editor", url: "/" },
    carousel: {
      label: "How Conloca works",
      chooseLabel: "Choose a message",
      showLabel: "Show message ",
      playLabel: "Play messages",
      pauseLabel: "Pause messages",
    },
    video: {
      title: "Conloca demo video",
      playLabel: "Play Conloca demo video",
      closeLabel: "Close demo video",
      url: "https://www.youtube.com/embed/zNGWdTLWktY?start=48&autoplay=1&rel=0",
      poster: {
        src: "/assets/demo-poster.png",
        alt: "Conloca dashboard preview",
        width: 4096,
        height: 2731,
      },
    },
  },
  features,
  featureControls: {
    audienceLabelPrefix: "Choose your role for ",
    primaryAction: { label: "Get started", url: "/" },
    secondaryAction: { label: "Read docs", url: "/" },
  },
}
export const capabilitiesContent: CapabilitiesContent = {
  heading: "Everything you need",
  subheading: "nothing you don't",
  items: capabilities,
}
export const pricingContent: PricingContent = {
  heading: "Choose a plan that fits you the best",
  billingLabel: "Billing interval",
  billingOptions: [
    { label: "Monthly", value: "monthly" },
    { label: "Annual", value: "annual" },
  ],
  currency: "$",
  intervals: { monthly: "/ Month", annual: "/ Year" },
  bestValueLabel: "Best value",
  compareAction: { label: "Compare plans", url: "/pricing#comparison" },
  plans,
}
