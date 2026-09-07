import type { HomepageMetadata } from "@/homepage-content"
import { blogFooterContent, blogHeaderContent } from "@/blog-content"

export interface ArticleDescription {
  emphasis: string
  emphasisFirst?: boolean
  supporting: string
}

export interface ArticleHeroContent {
  author: string
  authorLabel: string
  breadcrumbs: readonly string[]
  date: string
  description: string
  title: string
}

export interface ArticleCoverContent {
  alt: string
  height: number
  src: string
  width: number
}

export interface ArticleStep {
  number: string
  text: string
}

export interface ArticleBenefit {
  description: string
  title: string
}

export interface ArticleBodySection {
  benefits?: readonly ArticleBenefit[]
  id: string
  label: string
  paragraphs: readonly string[]
  quote?: string
  title: string
  tocTitle: string
}

export interface ArticleBodyContent {
  closing: string
  intro: readonly string[]
  practiceHeading: string
  practiceIntro: string
  sections: readonly ArticleBodySection[]
  steps: readonly ArticleStep[]
  tocLabel: string
}

export interface ArticleRelatedStory {
  compactDescription: ArticleDescription
  date: string
  description: ArticleDescription
  id: string
  image: ArticleCoverContent
  imageFirst: boolean
  readTime: string
  title: string
  url: string
}

export interface ArticleRelatedContent {
  heading: string
  moreLabel: string
  moreUrl: string
  stories: readonly ArticleRelatedStory[]
}

export interface ArticlePageContent {
  body: ArticleBodyContent
  cover: ArticleCoverContent
  hero: ArticleHeroContent
  related: ArticleRelatedContent
}

export const articlePageMetadata: HomepageMetadata = {
  description:
    "On most teams, the code lives in one place, the content in a CMS, the campaign brief in a doc, and the open questions in a chat thread. Conloca puts content back into the project.",
  language: "en",
  skipLabel: "Skip to content",
  title: "One change shouldn’t get lost across three systems — Conloca Blog",
}

export const articlePageHeaderContent = blogHeaderContent
export const articlePageFooterContent = blogFooterContent

const visualEditingDescription: ArticleDescription = {
  emphasis:
    "Exploring how visual editing can give marketers the freedom to move faster without sacrificing developer control.",
  emphasisFirst: true,
  supporting:
    " Keeping code, components, design systems, Git history, and Astro performance intact while giving teams a simpler path from idea to published page.",
}

const systemsDescription: ArticleDescription = {
  emphasis:
    "And how bringing content into Git creates a faster, safer, more connected way to publish.",
  supporting:
    "Talking about modern content workflows, why they fall apart across CMSs, docs, chats, and code. ",
}

export const articlePageContent: ArticlePageContent = {
  body: {
    closing:
      "The marketer sees the page. The developer sees the code. The company owns both.",
    intro: [
      "A marketer knows the copy was approved. They don't know which build it shipped in. A developer sees the exact technical change. They don't know which campaign decision is sitting behind it.",
      "So you end up with two versions of the truth: what the marketer sees in the CMS, and what actually lives in the project's code. The faster your campaigns, languages, and offers change, the more that gap costs you.",
      "Conloca puts content back into the project. The marketer edits the real page visually, and the change is saved to the same Git repository that holds the site's code and structure. Copy, design components, SEO metadata, and the published result stop drifting apart.",
    ],
    practiceHeading: "Here's how it works in practice:",
    practiceIntro:
      "The marketer gets a simple interface. The business gets a process that's searchable, governed, and reversible.",
    sections: [
      {
        benefits: [
          {
            description:
              "Every copy and media change no longer needs its own engineering ticket.",
            title: "Faster campaigns.",
          },
          {
            description:
              "Decisions get made on the real page, not in a document or a staging environment that's roughly similar.",
            title: "A preview you can trust.",
          },
          {
            description:
              "Changes are kept in history and can be rolled back the moment you need them.",
            title: "Safe publishing.",
          },
          {
            description:
              "Everyone can see who changed what, and which version went live.",
            title: "Transparent collaboration.",
          },
          {
            description:
              "The files stay in your company's repository. Switching platforms doesn't mean losing your brand's history.",
            title: "Ownership of your content.",
          },
        ],
        id: "git-safety-net",
        label: "01 — Git’s safety net",
        tocTitle: "Git’s safety net",
        paragraphs: [
          "The real value of Git was never programming knowledge. It's that the project forgets nothing. What changed, who changed it, when, and what it looked like before.",
          "That's exactly what a good editorial process needs, on a team of five or five hundred. A new campaign version can be prepared without touching the live page. Legal can read the precise text that's about to go out. Two variants can be compared word by word. If an offer ships with a mistake in it, restoring the previous version doesn't mean rebuilding the page from scratch.",
          "None of this requires a marketer to know what a commit, a branch, or a pull request is. Conloca runs the technical process in the background and hands the team the part that matters:",
        ],
        quote:
          "Speed and control stop competing. The team moves fast because the rules are built into the system, not because someone took them away.",
        title: "Git's safety net without Git's learning curve",
      },
      {
        id: "reusable-campaigns",
        label: "02 — Reusable campaigns",
        tocTitle: "One campaign, reusable parts",
        paragraphs: [
          "Marketing sites reuse the same parts over and over: hero blocks, product benefits, testimonials, CTAs, FAQs. Yet for every new campaign, teams rebuild those parts, copy them, or hunt them down across old pages. It burns time and it wears down brand consistency.",
          "Reusable Fragments let your team drop approved content blocks into any page. The marketer never starts from an empty screen. They start from pieces that already work and already match the brand. Campaigns go up faster, and design and messaging stay consistent across the site.",
          "The same principle carries over to multilingual content. Instead of cloning entire pages for every language, editors change only what actually differs. Media is uploaded and organized in the same workspace. Less time goes into hunting for files, duplicating them, and re-approving material that was signed off months ago.",
          "At that point Conloca stops being a place to edit text and becomes the system your campaigns are produced in. The team moves faster and the site's structure holds.",
        ],
        title: "One campaign shouldn't mean rebuilding everything",
      },
      {
        id: "marketing-advantage",
        label: "03 — Marketing advantage",
        tocTitle: "Speed as an advantage",
        paragraphs: [
          "Page speed belongs to the brand experience, not to the engineering scoreboard. Visitors feel how quickly and smoothly a site responds before they read a single word. A slow campaign page loses attention. A fast one gets out of the way and lets the offer do the work.",
          "Astro is built for content-driven sites and keeps the JavaScript it ships to the browser to a minimum. That makes it a strong foundation for fast marketing sites. Good page experience helps SEO too, though speed on its own will never win you a ranking.",
          "Conloca doesn't trade that architecture away for a heavy, detached CMS. The editor works visually, the content stays in the project, and Astro builds a fast final page. A marketer doesn't need to understand the pipeline for their campaign to benefit from modern web architecture.",
          "Two kinds of speed in one system. The team publishes faster, and the visitor gets the result faster.",
        ],
        title: "A fast site is already a marketing advantage",
      },
      {
        id: "agent-native-memory",
        label: "04 — Agent-native memory",
        tocTitle: "An agent-native memory",
        paragraphs: [
          "An AI agent can produce headline variants in minutes, draft translations, refresh metadata, or find stale copy across dozens of pages. The scale of the automation brings the scale of the error with it. An agent-native system has to do more than generate quickly. It has to keep every change under control.",
          "Conloca's Git-based approach leaves every action an agent takes visible and reversible. Schemas defined in code give it structure. Change history gives it accountability. Review before publish keeps a human in the loop. The agent speeds up the work, while brand voice, legal accuracy, and the final call stay with your company.",
          "That's the difference between a CMS with an AI feature bolted onto it and a genuinely agent-native workspace.",
        ],
        title: "An agent-native CMS needs a strong memory",
      },
      {
        id: "content-ownership",
        label: "05 — Content ownership",
        tocTitle: "Your site stays yours",
        paragraphs: [
          "A Git-based approach isn't right for every product. Real-time data, large transactional systems, and continuous user flows need a database and an API. For marketing sites, blogs, documentation, and campaign pages, a separate closed content system is usually more complexity than the job asks for.",
          "That's where Conloca earns its place. The marketer gets the simplicity of a CMS. The developer gets a Git-based workflow. The company keeps control of both the code and the content.",
        ],
        title: "A CMS that doesn't take your site hostage",
      },
    ],
    steps: [
      {
        number: "01",
        text: "The marketer opens a page in the visual editor.",
      },
      {
        number: "02",
        text: "They change text, an image, or metadata, and see the result as they go.",
      },
      {
        number: "03",
        text: "Conloca enforces the structure and content rules defined in the code.",
      },
      {
        number: "04",
        text: "The saved change lands in Git history, where it can be reviewed or rolled back.",
      },
      {
        number: "05",
        text: "Astro publishes the updated content as a fast website.",
      },
    ],
    tocLabel: "In this article",
  },
  cover: {
    alt: "",
    height: 1620,
    src: "/assets/blog-content-systems.jpg",
    width: 2880,
  },
  hero: {
    author: "Conloca team",
    authorLabel: "Written by",
    breadcrumbs: ["Stories", "Insights", "Updates"],
    date: "September 2026",
    description:
      "On most teams, the code lives in one place, the content in a CMS, the campaign brief in a doc, and the open questions in a chat thread. The published page is where all of it finally meets. No single system holds the whole picture.",
    title: "One change shouldn’t get lost across three systems",
  },
  related: {
    heading: "Continue reading",
    moreLabel: "More stories",
    moreUrl: "/blog",
    stories: [
      {
        compactDescription: systemsDescription,
        date: "September 2026",
        description: visualEditingDescription,
        id: "edit-what-you-see",
        image: {
          alt: "",
          height: 1620,
          src: "/assets/blog-edit-control.jpg",
          width: 2880,
        },
        imageFirst: false,
        readTime: "4 min read",
        title: "Edit what you see, without losing control of your code",
        url: "/blog/edit-what-you-see",
      },
      {
        compactDescription: systemsDescription,
        date: "September 2026",
        description: visualEditingDescription,
        id: "one-change-repeat",
        image: {
          alt: "",
          height: 1620,
          src: "/assets/blog-edit-repeat.jpg",
          width: 2880,
        },
        imageFirst: true,
        readTime: "4 min read",
        title: "One change shouldn't get lost across three systems",
        url: "/blog/one-change-across-three-systems",
      },
    ],
  },
}
