import type { HomepageMetadata } from "@/homepage-content"
import { blogFooterContent, blogHeaderContent } from "@/blog-content"
import type { ArticleDescription, ArticlePageContent } from "@/article-page-content"

export const visualEditingArticlePageMetadata: HomepageMetadata = {
  description:
    "Visual editing can let marketers move faster without giving up the code, components, design system, Git history, and Astro performance developers already trust.",
  language: "en",
  skipLabel: "Skip to content",
  title: "Edit what you see, without losing control of your code — Conloca Blog",
}

export const visualEditingArticlePageHeaderContent = blogHeaderContent
export const visualEditingArticlePageFooterContent = blogFooterContent

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

export const visualEditingArticlePageContent: ArticlePageContent = {
  body: {
    closing:
      "The marketer edits the page they see. The developer keeps the code they own. The published site is the same thing, not a copy of it.",
    intro: [
      "Most visual editors ask developers to give something up. The page becomes a document in another system. Components turn into approximations. The design system lives in Figma, the content lives in a CMS, and the code is left to catch up after the campaign has already shipped.",
      "That split is why teams end up with two versions of every page: the one marketers can edit, and the one that actually builds. The longer those stay apart, the harder it is to trust either of them.",
      "Conloca keeps the visual editor on top of the real project. Marketers change what they see. Those changes write back to the same files, components, and Git history the site is built from. Control stays in the codebase because the editor never leaves it.",
    ],
    practiceHeading: "Here's how it works in practice:",
    practiceIntro:
      "The editor is simple because the rules already live in code. Speed on the page does not mean a second source of truth behind it.",
    sections: [
      {
        benefits: [
          {
            description:
              "Marketers change copy, media, and layout on the page that ships, not on a stand-in.",
            title: "What you see is what builds.",
          },
          {
            description:
              "Mapped components keep their props, slots, and constraints. The editor cannot invent structure the code does not allow.",
            title: "The schema still wins.",
          },
          {
            description:
              "Every visual save is a file change with history, review, and a way back.",
            title: "Git stays in the loop.",
          },
          {
            description:
              "The design system remains the one in the repository, not a parallel kit inside a CMS.",
            title: "One design system.",
          },
          {
            description:
              "Astro still generates a fast static page. The editor does not replace the architecture with a heavier runtime.",
            title: "Performance stays put.",
          },
        ],
        id: "real-page",
        label: "01 — The real page",
        tocTitle: "The real page",
        paragraphs: [
          "A useful visual editor has to operate on the page the visitor will get. If the canvas is a reconstruction, teams spend the last day of every campaign reconciling it with production. If the canvas is the project, the preview is the product.",
          "Conloca maps the React components you already ship to typed blocks. Editors place those blocks, fill in the content they are allowed to change, and see the result in place. They do not get a generic page builder. They get your page.",
          "That is the difference between giving marketers a tool and giving them the site. The first creates another workflow. The second removes the waiting.",
        ],
        quote:
          "Freedom to edit is only useful when the thing being edited is the thing that goes live.",
        title: "Edit the page that actually ships",
      },
      {
        id: "code-contract",
        label: "02 — The code contract",
        tocTitle: "Components stay in code",
        paragraphs: [
          "Developers should not have to police every headline. They should define the contract once: which components exist, which fields they accept, and how they compose. After that, visual edits either fit the contract or they do not land.",
          "That is how design systems are supposed to work. A button is a button because the component says so, not because someone drew a similar rectangle in a content tool. Spacing, type, states, and accessibility stay in the implementation. Editors change content, not the rules.",
          "When a campaign needs a new section, that is still an engineering change. It gets designed, built, and mapped. Until then, marketers work inside what the team has already approved. The site cannot drift into a pile of one-off blocks that nobody owns.",
        ],
        title: "Keep the components, slots, and constraints in code",
      },
      {
        id: "git-history",
        label: "03 — Git history",
        tocTitle: "History for visual edits",
        paragraphs: [
          "A visual change that never becomes a file change is a change you cannot review. You cannot diff it, revert it, or explain it six months later. That is the usual cost of a detached CMS: the live page moved, and the repository did not.",
          "Conloca writes visual edits back to the project. The marketer does not need to know what a commit is. The team still gets a readable history of what changed, who changed it, and what the page looked like before. Review, preview, and rollback stay in the same workflow you already use for code.",
          "That matters more as more people touch the site. Campaigns, locales, and last-minute legal fixes all land in the same history. Nothing important lives only in an editor session.",
        ],
        title: "Every visual edit still has a history",
      },
      {
        id: "astro-performance",
        label: "04 — Astro performance",
        tocTitle: "Keep the fast site",
        paragraphs: [
          "Teams often accept a slower site as the price of an editor. The CMS injects its own runtime, hydrates more than the page needs, and turns a marketing site into an application. Visitors pay for a workflow they never asked for.",
          "Astro is a strong fit for content sites because it ships as little JavaScript as the page requires. Conloca does not trade that away. Editors work visually in the project. The build still emits static HTML. Interactive islands stay opt-in.",
          "The result is two kinds of speed that usually get split apart. The team can publish without a ticket for every copy change. The visitor still gets a page that loads like a page.",
        ],
        title: "Visual editing should not cost you the architecture",
      },
      {
        id: "shared-ownership",
        label: "05 — Shared ownership",
        tocTitle: "Shared ownership",
        paragraphs: [
          "Control of the code is not the same thing as blocking every edit. Developers keep the structure, the design system, and the build. Marketers keep the ability to ship the words, images, and campaigns that structure is there to hold.",
          "When those jobs share a project, neither team is waiting on a translation layer. The published page is not a downstream export. It is the same source both people already have open.",
        ],
        title: "Marketers move faster because the code still holds",
      },
    ],
    steps: [
      {
        number: "01",
        text: "Developers map existing React components to the fields an editor is allowed to change.",
      },
      {
        number: "02",
        text: "A marketer opens the real page in the visual editor and changes copy, media, or layout inside those components.",
      },
      {
        number: "03",
        text: "The preview is the project, so they can see the result against the actual design system.",
      },
      {
        number: "04",
        text: "Saving writes the change to Git, where it can be reviewed or rolled back like any other file.",
      },
      {
        number: "05",
        text: "Astro publishes the updated page without introducing a separate content runtime.",
      },
    ],
    tocLabel: "In this article",
  },
  cover: {
    alt: "",
    height: 1620,
    src: "/assets/blog-edit-control.jpg",
    width: 2880,
  },
  hero: {
    author: "Conloca team",
    authorLabel: "Written by",
    breadcrumbs: ["Stories", "Insights", "Updates"],
    date: "September 2026",
    description:
      "Visual editors usually ask developers to give up the codebase. Conloca keeps the editor on the real page, so marketers can ship while components, Git history, and Astro performance stay where they belong.",
    title: "Edit what you see, without losing control of your code",
  },
  related: {
    heading: "Continue reading",
    moreLabel: "More stories",
    moreUrl: "/blog",
    stories: [
      {
        compactDescription: systemsDescription,
        date: "September 2026",
        description: systemsDescription,
        id: "one-change-across-three-systems",
        image: {
          alt: "",
          height: 1620,
          src: "/assets/blog-content-systems.jpg",
          width: 2880,
        },
        imageFirst: false,
        readTime: "4 min read",
        title: "One change shouldn't get lost across three systems",
        url: "/blog/one-change-across-three-systems",
      },
      {
        compactDescription: visualEditingDescription,
        date: "September 2026",
        description: visualEditingDescription,
        id: "edit-repeat",
        image: {
          alt: "",
          height: 1620,
          src: "/assets/blog-edit-repeat.jpg",
          width: 2880,
        },
        imageFirst: true,
        readTime: "4 min read",
        title: "Edit what you see, without losing control of your code",
        url: "/blog/edit-what-you-see",
      },
    ],
  },
}
