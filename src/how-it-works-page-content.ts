// Serializable editorial data for the How it works page.
import {
  type ContentLink,
  type HomepageMetadata,
  footerNavigation,
  navigation,
} from "@/homepage-content"

export interface HowItWorksStep {
  number: string
  title: string
  description: string
}

export type HowItWorksBentoIcon =
  | "flash-off"
  | "database-01"
  | "globe-01"
  | "left-indent-02"

export interface HowItWorksBentoCard {
  icon: HowItWorksBentoIcon
  iconTint: "olive" | "default"
  title: string
  description: string
}

export interface HowItWorksLayer {
  label: string
  description: string
  action: ContentLink
}

export type PackageManager = "bun" | "pnpm" | "npm"

export interface HowItWorksPageContent {
  hero: {
    eyebrow: string
    heading: string
    description: string
  }
  steps: {
    label: string
    items: readonly HowItWorksStep[]
    mockAlt: string
  }
  bento: {
    label: string
    heading: string
    cards: readonly HowItWorksBentoCard[]
  }
  layers: {
    heading: string
    description: string
    diagramAlt: string
    items: readonly HowItWorksLayer[]
  }
  cta: {
    heading: string
    description: string
    packageManagerLabel: string
    packageManagers: readonly PackageManager[]
    commands: Record<PackageManager, string>
    copyLabel: string
  }
}

export const howItWorksPageMetadata: HomepageMetadata = {
  language: "en",
  title: "Conloca — How it works",
  description:
    "Developers build the components, editors compose them visually, and Conloca stores the result as files in your Git repository.",
  skipLabel: "Skip to content",
}

export const howItWorksPageHeaderContent = {
  menuItems: navigation,
  primaryButton: { label: "Get started", url: "/" },
  secondaryButton: { label: "Try editor", url: "/" },
  logoUrl: "/",
  navigationLabel: "Primary navigation",
  mobileNavigationLabel: "Mobile navigation",
  menuButtonLabel: "Open navigation menu",
  menuCloseButtonLabel: "Close navigation menu",
}

export const howItWorksPageFooterContent = {
  navigationItems: footerNavigation,
  action: { label: "Get started", url: "/" },
  logoUrl: "/",
  logoLabel: "Conloca home",
  navigationLabel: "Footer navigation",
}

export const howItWorksPageContent: HowItWorksPageContent = {
  hero: {
    eyebrow: "How it works",
    heading: "Your repository is the CMS",
    description:
      "Developers build the components. Editors compose them visually. Conloca stores the result as files in your Git repository, and Astro renders those same files into your website. No content database. No hosted CMS API between your site and its content.",
  },
  steps: {
    label: "How Conloca works in four steps",
    items: [
      {
        number: "01",
        title: "Developers define",
        description: "Schemas and components",
      },
      {
        number: "02",
        title: "Content editors edit",
        description: "Markwodn or visual editor",
      },
      {
        number: "03",
        title: "Team reviews",
        description: "Branches and pull requests",
      },
      {
        number: "04",
        title: "Pipeline deploys",
        description: "Existing CI / CD",
      },
    ],
    mockAlt:
      "Conloca visual editor composing a conference landing page from card blocks",
  },
  bento: {
    label: "Content types Conloca manages",
    heading: "Conloca can manage more than just pages",
    cards: [
      {
        icon: "flash-off",
        iconTint: "olive",
        title: "Media",
        description: "URL-addressable site content and standalone landing pages",
      },
      {
        icon: "database-01",
        iconTint: "default",
        title: "Data",
        description: "Structured data such as site settings, staff, or quotes",
      },
      {
        icon: "globe-01",
        iconTint: "default",
        title: "Locales",
        description: "Locale variants stored side-by-side with original content",
      },
      {
        icon: "left-indent-02",
        iconTint: "default",
        title: "Content fragments",
        description: "Reusable content sections shared across multiple layouts",
      },
    ],
  },
  layers: {
    heading: "Three layers\nSingle foundation",
    description:
      "Developers build the components. Editors compose them visually. Conloca stores the result as files in your Git repository, and Astro renders those same files into your website. No content database. No hosted CMS API between your site and its content.",
    diagramAlt:
      "Homepage MDX block file, cards JSON schema, and the Conloca visual editor layered together",
    items: [
      {
        label: ".MDX Blocks",
        description: "Reusable components with boundaries set in code",
        action: { label: "Read docs", url: "/" },
      },
      {
        label: "VX.json pages",
        description: "A visual surface that maps directly to stable files",
        action: { label: "Read docs", url: "/" },
      },
      {
        label: "Puck visual editor",
        description:
          "A visual editing interface that maps directly to stable files",
        action: { label: "Read docs", url: "/" },
      },
    ],
  },
  cta: {
    heading: "Start with an Astro project",
    description:
      "Add Conloca, point it at a content directory, define your first components, and open the visual editor",
    packageManagerLabel: "Package manager",
    packageManagers: ["bun", "pnpm", "npm"],
    commands: {
      bun: "bun add @conloca/astro-cms",
      pnpm: "pnpm add @conloca/astro-cms",
      npm: "npm install @conloca/astro-cms",
    },
    copyLabel: "Copy",
  },
}
