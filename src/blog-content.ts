import { type HomepageMetadata, navigation } from "@/homepage-content"

export interface BlogDescription {
  emphasis: string
  emphasisFirst?: boolean
  supporting: string
}

export interface BlogArticle {
  compactDescription?: BlogDescription
  date: string
  description: BlogDescription
  id: string
  image: {
    height: number
    src: string
    width: number
  }
  layout: "full" | "split"
  readTime: string
  title: string
  url: string
}

export interface BlogHeroContent {
  compactBreadcrumbs: readonly string[]
  description: string
  dispatchLabel: string
  largeBreadcrumbs: readonly string[]
  mobileHeading: string
  heading: string
}

export interface BlogListingContent {
  articles: readonly BlogArticle[]
  navigationLabel: string
}

export const blogMetadata: HomepageMetadata = {
  language: "en",
  title: "Conloca Blog — Notes on content, code, and the space between",
  description:
    "Field notes, practical guides, and honest conversations about building visual editing into modern developer workflows.",
  skipLabel: "Skip to content",
}

export const blogHeaderContent = {
  menuItems: navigation,
  primaryButton: { label: "Get started", url: "/" },
  secondaryButton: { label: "Try editor", url: "/" },
  logoUrl: "/",
  navigationLabel: "Primary navigation",
  mobileNavigationLabel: "Mobile navigation",
  menuButtonLabel: "Open navigation menu",
  menuCloseButtonLabel: "Close navigation menu",
}

export const blogFooterContent = {
  navigationItems: navigation,
  action: { label: "Get started", url: "/" },
  logoUrl: "/",
  logoLabel: "Conloca home",
  navigationLabel: "Footer navigation",
}

export const blogHeroContent: BlogHeroContent = {
  compactBreadcrumbs: ["Stories", "Insights", "Updates"],
  description:
    "Field notes, practical guides, and honest conversations about building visual editing into modern developer workflows.",
  dispatchLabel: "Conloca dispatch",
  largeBreadcrumbs: ["Home", "Stories", "Updates"],
  mobileHeading: "Notes from space between code and content",
  heading: "Notes on content, code, and the space between",
}

const systemsDescription: BlogDescription = {
  supporting:
    "Talking about modern content workflows, why they fall apart across CMSs, docs, chats, and code. ",
  emphasis:
    "And how bringing content into Git creates a faster, safer, more connected way to publish.",
}

const visualEditingDescription: BlogDescription = {
  emphasis:
    "Exploring how visual editing can give marketers the freedom to move faster without sacrificing developer control.",
  supporting:
    " Keeping code, components, design systems, Git history, and Astro performance intact while giving teams a simpler path from idea to published page.",
  emphasisFirst: true,
}

export const blogListingContent: BlogListingContent = {
  navigationLabel: "Blog articles",
  articles: [
    {
      date: "September 2026",
      description: systemsDescription,
      id: "content-systems",
      image: {
        height: 1620,
        src: "/assets/blog-content-systems.jpg",
        width: 2880,
      },
      layout: "full",
      readTime: "4 min read",
      title: "One change shouldn't get lost across three systems",
      url: "/blog/one-change-across-three-systems",
    },
    {
      compactDescription: systemsDescription,
      date: "September 2026",
      description: visualEditingDescription,
      id: "edit-control",
      image: {
        height: 1620,
        src: "/assets/blog-edit-control.jpg",
        width: 2880,
      },
      layout: "split",
      readTime: "4 min read",
      title: "Edit what you see, without losing control of your code",
      url: "/blog/edit-what-you-see",
    },
    {
      date: "September 2026",
      description: systemsDescription,
      id: "systems-repeat",
      image: {
        height: 1620,
        src: "/assets/blog-systems-repeat.jpg",
        width: 2880,
      },
      layout: "full",
      readTime: "4 min read",
      title: "One change shouldn't get lost across three systems",
      url: "/blog/one-change-across-three-systems",
    },
    {
      compactDescription: systemsDescription,
      date: "September 2026",
      description: visualEditingDescription,
      id: "edit-repeat",
      image: {
        height: 1620,
        src: "/assets/blog-edit-repeat.jpg",
        width: 2880,
      },
      layout: "split",
      readTime: "4 min read",
      title: "Edit what you see, without losing control of your code",
      url: "/blog/edit-what-you-see",
    },
  ],
}
