import type { ComponentConfig } from "@puckeditor/core"
import {
  ArticlePageSections,
  type ArticleDescription,
  type ArticlePageContent,
} from "@/sections/article-page-sections"

// Puck-storable props for ArticlePageSections. Differences from
// ArticlePageContent: readonly string[] flatten to { text } item arrays,
// booleans/optional flags are radio "true"/"false" strings, and optional
// payloads (quote, benefits) use empty-means-absent.
export interface ArticleDescriptionProps {
  emphasis: string
  emphasisFirst: "true" | "false"
  supporting: string
}

export interface ArticleRelatedStoryProps {
  id: string
  url: string
  title: string
  date: string
  readTime: string
  imageFirst: "true" | "false"
  image: { alt: string; height: number; src: string; width: number }
  description: ArticleDescriptionProps
  compactDescription: ArticleDescriptionProps
}

export interface ArticleBodySectionProps {
  id: string
  label: string
  title: string
  tocTitle: string
  paragraphs: { text: string }[]
  quote: string
  benefits: { title: string; description: string }[]
}

export interface ArticlePageSectionsBlockProps {
  hero: {
    author: string
    authorLabel: string
    breadcrumbs: { text: string }[]
    date: string
    description: string
    title: string
  }
  cover: { alt: string; height: number; src: string; width: number }
  body: {
    closing: string
    intro: { text: string }[]
    practiceHeading: string
    practiceIntro: string
    sections: ArticleBodySectionProps[]
    steps: { text: string }[]
    tocLabel: string
  }
  related: {
    heading: string
    moreLabel: string
    moreUrl: string
    stories: ArticleRelatedStoryProps[]
  }
}

function mapArticleDescription(
  props: ArticleDescriptionProps,
): ArticleDescription {
  return {
    emphasis: props.emphasis,
    ...(props.emphasisFirst === "true" ? { emphasisFirst: true } : {}),
    supporting: props.supporting,
  }
}

export function mapArticlePageSectionsProps(
  props: ArticlePageSectionsBlockProps,
): ArticlePageContent {
  return {
    hero: {
      author: props.hero.author,
      authorLabel: props.hero.authorLabel,
      breadcrumbs: props.hero.breadcrumbs.map((item) => item.text),
      date: props.hero.date,
      description: props.hero.description,
      title: props.hero.title,
    },
    cover: props.cover,
    body: {
      closing: props.body.closing,
      intro: props.body.intro.map((item) => item.text),
      practiceHeading: props.body.practiceHeading,
      practiceIntro: props.body.practiceIntro,
      sections: props.body.sections.map((section) => ({
        id: section.id,
        label: section.label,
        title: section.title,
        tocTitle: section.tocTitle,
        paragraphs: section.paragraphs.map((item) => item.text),
        // Empty quote / empty benefits array mean the payload is absent.
        ...(section.quote ? { quote: section.quote } : {}),
        ...(section.benefits.length > 0 ? { benefits: section.benefits } : {}),
      })),
      steps: props.body.steps,
      tocLabel: props.body.tocLabel,
    },
    related: {
      heading: props.related.heading,
      moreLabel: props.related.moreLabel,
      moreUrl: props.related.moreUrl,
      stories: props.related.stories.map((story) => ({
        id: story.id,
        url: story.url,
        title: story.title,
        date: story.date,
        readTime: story.readTime,
        imageFirst: story.imageFirst === "true",
        image: story.image,
        description: mapArticleDescription(story.description),
        compactDescription: mapArticleDescription(story.compactDescription),
      })),
    },
  }
}

const articleDescriptionFields = {
  type: "object",
  objectFields: {
    emphasis: { type: "textarea" },
    emphasisFirst: {
      type: "radio",
      options: [
        { label: "Emphasis first", value: "true" },
        { label: "Supporting first", value: "false" },
      ],
    },
    supporting: { type: "textarea" },
  },
} as const

const articleImageFields = {
  type: "object",
  objectFields: {
    alt: { type: "text" },
    height: { type: "number" },
    src: { type: "text" },
    width: { type: "number" },
  },
} as const

const textListFields = {
  type: "array",
  arrayFields: {
    text: { type: "textarea" },
  },
  getItemSummary: (item: { text: string }) => item.text,
} as const

export const articlePageSectionsDefaultProps: ArticlePageSectionsBlockProps =
  {
    "hero": {
      "author": "Conloca team",
      "authorLabel": "Written by",
      "breadcrumbs": [
        {
          "text": "Stories"
        },
        {
          "text": "Insights"
        },
        {
          "text": "Updates"
        }
      ],
      "date": "September 2026",
      "description": "On most teams, the code lives in one place, the content in a CMS, the campaign brief in a doc, and the open questions in a chat thread. The published page is where all of it finally meets. No single system holds the whole picture.",
      "title": "One change shouldn’t get lost across three systems"
    },
    "cover": {
      "alt": "",
      "height": 1620,
      "src": "/assets/blog-content-systems.jpg",
      "width": 2880
    },
    "body": {
      "closing": "The marketer sees the page. The developer sees the code. The company owns both.",
      "intro": [
        {
          "text": "A marketer knows the copy was approved. They don't know which build it shipped in. A developer sees the exact technical change. They don't know which campaign decision is sitting behind it."
        },
        {
          "text": "So you end up with two versions of the truth: what the marketer sees in the CMS, and what actually lives in the project's code. The faster your campaigns, languages, and offers change, the more that gap costs you."
        },
        {
          "text": "Conloca puts content back into the project. The marketer edits the real page visually, and the change is saved to the same Git repository that holds the site's code and structure. Copy, design components, SEO metadata, and the published result stop drifting apart."
        }
      ],
      "practiceHeading": "Here's how it works in practice:",
      "practiceIntro": "The marketer gets a simple interface. The business gets a process that's searchable, governed, and reversible.",
      "sections": [
        {
          "id": "git-safety-net",
          "label": "01 — Git’s safety net",
          "title": "Git's safety net without Git's learning curve",
          "tocTitle": "Git’s safety net",
          "paragraphs": [
            {
              "text": "The real value of Git was never programming knowledge. It's that the project forgets nothing. What changed, who changed it, when, and what it looked like before."
            },
            {
              "text": "That's exactly what a good editorial process needs, on a team of five or five hundred. A new campaign version can be prepared without touching the live page. Legal can read the precise text that's about to go out. Two variants can be compared word by word. If an offer ships with a mistake in it, restoring the previous version doesn't mean rebuilding the page from scratch."
            },
            {
              "text": "None of this requires a marketer to know what a commit, a branch, or a pull request is. Conloca runs the technical process in the background and hands the team the part that matters:"
            }
          ],
          "quote": "Speed and control stop competing. The team moves fast because the rules are built into the system, not because someone took them away.",
          "benefits": [
            {
              "title": "Faster campaigns.",
              "description": "Every copy and media change no longer needs its own engineering ticket."
            },
            {
              "title": "A preview you can trust.",
              "description": "Decisions get made on the real page, not in a document or a staging environment that's roughly similar."
            },
            {
              "title": "Safe publishing.",
              "description": "Changes are kept in history and can be rolled back the moment you need them."
            },
            {
              "title": "Transparent collaboration.",
              "description": "Everyone can see who changed what, and which version went live."
            },
            {
              "title": "Ownership of your content.",
              "description": "The files stay in your company's repository. Switching platforms doesn't mean losing your brand's history."
            }
          ]
        },
        {
          "id": "reusable-campaigns",
          "label": "02 — Reusable campaigns",
          "title": "One campaign shouldn't mean rebuilding everything",
          "tocTitle": "One campaign, reusable parts",
          "paragraphs": [
            {
              "text": "Marketing sites reuse the same parts over and over: hero blocks, product benefits, testimonials, CTAs, FAQs. Yet for every new campaign, teams rebuild those parts, copy them, or hunt them down across old pages. It burns time and it wears down brand consistency."
            },
            {
              "text": "Reusable Fragments let your team drop approved content blocks into any page. The marketer never starts from an empty screen. They start from pieces that already work and already match the brand. Campaigns go up faster, and design and messaging stay consistent across the site."
            },
            {
              "text": "The same principle carries over to multilingual content. Instead of cloning entire pages for every language, editors change only what actually differs. Media is uploaded and organized in the same workspace. Less time goes into hunting for files, duplicating them, and re-approving material that was signed off months ago."
            },
            {
              "text": "At that point Conloca stops being a place to edit text and becomes the system your campaigns are produced in. The team moves faster and the site's structure holds."
            }
          ],
          "quote": "",
          "benefits": []
        },
        {
          "id": "marketing-advantage",
          "label": "03 — Marketing advantage",
          "title": "A fast site is already a marketing advantage",
          "tocTitle": "Speed as an advantage",
          "paragraphs": [
            {
              "text": "Page speed belongs to the brand experience, not to the engineering scoreboard. Visitors feel how quickly and smoothly a site responds before they read a single word. A slow campaign page loses attention. A fast one gets out of the way and lets the offer do the work."
            },
            {
              "text": "Astro is built for content-driven sites and keeps the JavaScript it ships to the browser to a minimum. That makes it a strong foundation for fast marketing sites. Good page experience helps SEO too, though speed on its own will never win you a ranking."
            },
            {
              "text": "Conloca doesn't trade that architecture away for a heavy, detached CMS. The editor works visually, the content stays in the project, and Astro builds a fast final page. A marketer doesn't need to understand the pipeline for their campaign to benefit from modern web architecture."
            },
            {
              "text": "Two kinds of speed in one system. The team publishes faster, and the visitor gets the result faster."
            }
          ],
          "quote": "",
          "benefits": []
        },
        {
          "id": "agent-native-memory",
          "label": "04 — Agent-native memory",
          "title": "An agent-native CMS needs a strong memory",
          "tocTitle": "An agent-native memory",
          "paragraphs": [
            {
              "text": "An AI agent can produce headline variants in minutes, draft translations, refresh metadata, or find stale copy across dozens of pages. The scale of the automation brings the scale of the error with it. An agent-native system has to do more than generate quickly. It has to keep every change under control."
            },
            {
              "text": "Conloca's Git-based approach leaves every action an agent takes visible and reversible. Schemas defined in code give it structure. Change history gives it accountability. Review before publish keeps a human in the loop. The agent speeds up the work, while brand voice, legal accuracy, and the final call stay with your company."
            },
            {
              "text": "That's the difference between a CMS with an AI feature bolted onto it and a genuinely agent-native workspace."
            }
          ],
          "quote": "",
          "benefits": []
        },
        {
          "id": "content-ownership",
          "label": "05 — Content ownership",
          "title": "A CMS that doesn't take your site hostage",
          "tocTitle": "Your site stays yours",
          "paragraphs": [
            {
              "text": "A Git-based approach isn't right for every product. Real-time data, large transactional systems, and continuous user flows need a database and an API. For marketing sites, blogs, documentation, and campaign pages, a separate closed content system is usually more complexity than the job asks for."
            },
            {
              "text": "That's where Conloca earns its place. The marketer gets the simplicity of a CMS. The developer gets a Git-based workflow. The company keeps control of both the code and the content."
            }
          ],
          "quote": "",
          "benefits": []
        }
      ],
      "steps": [
        {
          "text": "The marketer opens a page in the visual editor."
        },
        {
          "text": "They change text, an image, or metadata, and see the result as they go."
        },
        {
          "text": "Conloca enforces the structure and content rules defined in the code."
        },
        {
          "text": "The saved change lands in Git history, where it can be reviewed or rolled back."
        },
        {
          "text": "Astro publishes the updated content as a fast website."
        }
      ],
      "tocLabel": "In this article"
    },
    "related": {
      "heading": "Continue reading",
      "moreLabel": "More stories",
      "moreUrl": "/blog",
      "stories": [
        {
          "id": "edit-what-you-see",
          "url": "/blog/edit-what-you-see",
          "title": "Edit what you see, without losing control of your code",
          "date": "September 2026",
          "readTime": "4 min read",
          "imageFirst": "false",
          "image": {
            "alt": "",
            "height": 1620,
            "src": "/assets/blog-edit-control.jpg",
            "width": 2880
          },
          "description": {
            "emphasis": "Exploring how visual editing can give marketers the freedom to move faster without sacrificing developer control.",
            "emphasisFirst": "true",
            "supporting": " Keeping code, components, design systems, Git history, and Astro performance intact while giving teams a simpler path from idea to published page."
          },
          "compactDescription": {
            "emphasis": "And how bringing content into Git creates a faster, safer, more connected way to publish.",
            "emphasisFirst": "false",
            "supporting": "Talking about modern content workflows, why they fall apart across CMSs, docs, chats, and code. "
          }
        },
        {
          "id": "one-change-repeat",
          "url": "/blog/one-change-across-three-systems",
          "title": "One change shouldn't get lost across three systems",
          "date": "September 2026",
          "readTime": "4 min read",
          "imageFirst": "true",
          "image": {
            "alt": "",
            "height": 1620,
            "src": "/assets/blog-edit-repeat.jpg",
            "width": 2880
          },
          "description": {
            "emphasis": "Exploring how visual editing can give marketers the freedom to move faster without sacrificing developer control.",
            "emphasisFirst": "true",
            "supporting": " Keeping code, components, design systems, Git history, and Astro performance intact while giving teams a simpler path from idea to published page."
          },
          "compactDescription": {
            "emphasis": "And how bringing content into Git creates a faster, safer, more connected way to publish.",
            "emphasisFirst": "false",
            "supporting": "Talking about modern content workflows, why they fall apart across CMSs, docs, chats, and code. "
          }
        }
      ]
    }
  }

export const editWhatYouSeeArticleDefaultProps: ArticlePageSectionsBlockProps =
  {
    "hero": {
      "author": "Conloca team",
      "authorLabel": "Written by",
      "breadcrumbs": [
        {
          "text": "Stories"
        },
        {
          "text": "Insights"
        },
        {
          "text": "Updates"
        }
      ],
      "date": "September 2026",
      "description": "Visual editors usually ask developers to give up the codebase. Conloca keeps the editor on the real page, so marketers can ship while components, Git history, and Astro performance stay where they belong.",
      "title": "Edit what you see, without losing control of your code"
    },
    "cover": {
      "alt": "",
      "height": 1620,
      "src": "/assets/blog-edit-control.jpg",
      "width": 2880
    },
    "body": {
      "closing": "The marketer edits the page they see. The developer keeps the code they own. The published site is the same thing, not a copy of it.",
      "intro": [
        {
          "text": "Most visual editors ask developers to give something up. The page becomes a document in another system. Components turn into approximations. The design system lives in Figma, the content lives in a CMS, and the code is left to catch up after the campaign has already shipped."
        },
        {
          "text": "That split is why teams end up with two versions of every page: the one marketers can edit, and the one that actually builds. The longer those stay apart, the harder it is to trust either of them."
        },
        {
          "text": "Conloca keeps the visual editor on top of the real project. Marketers change what they see. Those changes write back to the same files, components, and Git history the site is built from. Control stays in the codebase because the editor never leaves it."
        }
      ],
      "practiceHeading": "Here's how it works in practice:",
      "practiceIntro": "The editor is simple because the rules already live in code. Speed on the page does not mean a second source of truth behind it.",
      "sections": [
        {
          "id": "real-page",
          "label": "01 — The real page",
          "title": "Edit the page that actually ships",
          "tocTitle": "The real page",
          "paragraphs": [
            {
              "text": "A useful visual editor has to operate on the page the visitor will get. If the canvas is a reconstruction, teams spend the last day of every campaign reconciling it with production. If the canvas is the project, the preview is the product."
            },
            {
              "text": "Conloca maps the React components you already ship to typed blocks. Editors place those blocks, fill in the content they are allowed to change, and see the result in place. They do not get a generic page builder. They get your page."
            },
            {
              "text": "That is the difference between giving marketers a tool and giving them the site. The first creates another workflow. The second removes the waiting."
            }
          ],
          "quote": "Freedom to edit is only useful when the thing being edited is the thing that goes live.",
          "benefits": [
            {
              "title": "What you see is what builds.",
              "description": "Marketers change copy, media, and layout on the page that ships, not on a stand-in."
            },
            {
              "title": "The schema still wins.",
              "description": "Mapped components keep their props, slots, and constraints. The editor cannot invent structure the code does not allow."
            },
            {
              "title": "Git stays in the loop.",
              "description": "Every visual save is a file change with history, review, and a way back."
            },
            {
              "title": "One design system.",
              "description": "The design system remains the one in the repository, not a parallel kit inside a CMS."
            },
            {
              "title": "Performance stays put.",
              "description": "Astro still generates a fast static page. The editor does not replace the architecture with a heavier runtime."
            }
          ]
        },
        {
          "id": "code-contract",
          "label": "02 — The code contract",
          "title": "Keep the components, slots, and constraints in code",
          "tocTitle": "Components stay in code",
          "paragraphs": [
            {
              "text": "Developers should not have to police every headline. They should define the contract once: which components exist, which fields they accept, and how they compose. After that, visual edits either fit the contract or they do not land."
            },
            {
              "text": "That is how design systems are supposed to work. A button is a button because the component says so, not because someone drew a similar rectangle in a content tool. Spacing, type, states, and accessibility stay in the implementation. Editors change content, not the rules."
            },
            {
              "text": "When a campaign needs a new section, that is still an engineering change. It gets designed, built, and mapped. Until then, marketers work inside what the team has already approved. The site cannot drift into a pile of one-off blocks that nobody owns."
            }
          ],
          "quote": "",
          "benefits": []
        },
        {
          "id": "git-history",
          "label": "03 — Git history",
          "title": "Every visual edit still has a history",
          "tocTitle": "History for visual edits",
          "paragraphs": [
            {
              "text": "A visual change that never becomes a file change is a change you cannot review. You cannot diff it, revert it, or explain it six months later. That is the usual cost of a detached CMS: the live page moved, and the repository did not."
            },
            {
              "text": "Conloca writes visual edits back to the project. The marketer does not need to know what a commit is. The team still gets a readable history of what changed, who changed it, and what the page looked like before. Review, preview, and rollback stay in the same workflow you already use for code."
            },
            {
              "text": "That matters more as more people touch the site. Campaigns, locales, and last-minute legal fixes all land in the same history. Nothing important lives only in an editor session."
            }
          ],
          "quote": "",
          "benefits": []
        },
        {
          "id": "astro-performance",
          "label": "04 — Astro performance",
          "title": "Visual editing should not cost you the architecture",
          "tocTitle": "Keep the fast site",
          "paragraphs": [
            {
              "text": "Teams often accept a slower site as the price of an editor. The CMS injects its own runtime, hydrates more than the page needs, and turns a marketing site into an application. Visitors pay for a workflow they never asked for."
            },
            {
              "text": "Astro is a strong fit for content sites because it ships as little JavaScript as the page requires. Conloca does not trade that away. Editors work visually in the project. The build still emits static HTML. Interactive islands stay opt-in."
            },
            {
              "text": "The result is two kinds of speed that usually get split apart. The team can publish without a ticket for every copy change. The visitor still gets a page that loads like a page."
            }
          ],
          "quote": "",
          "benefits": []
        },
        {
          "id": "shared-ownership",
          "label": "05 — Shared ownership",
          "title": "Marketers move faster because the code still holds",
          "tocTitle": "Shared ownership",
          "paragraphs": [
            {
              "text": "Control of the code is not the same thing as blocking every edit. Developers keep the structure, the design system, and the build. Marketers keep the ability to ship the words, images, and campaigns that structure is there to hold."
            },
            {
              "text": "When those jobs share a project, neither team is waiting on a translation layer. The published page is not a downstream export. It is the same source both people already have open."
            }
          ],
          "quote": "",
          "benefits": []
        }
      ],
      "steps": [
        {
          "text": "Developers map existing React components to the fields an editor is allowed to change."
        },
        {
          "text": "A marketer opens the real page in the visual editor and changes copy, media, or layout inside those components."
        },
        {
          "text": "The preview is the project, so they can see the result against the actual design system."
        },
        {
          "text": "Saving writes the change to Git, where it can be reviewed or rolled back like any other file."
        },
        {
          "text": "Astro publishes the updated page without introducing a separate content runtime."
        }
      ],
      "tocLabel": "In this article"
    },
    "related": {
      "heading": "Continue reading",
      "moreLabel": "More stories",
      "moreUrl": "/blog",
      "stories": [
        {
          "id": "one-change-across-three-systems",
          "url": "/blog/one-change-across-three-systems",
          "title": "One change shouldn't get lost across three systems",
          "date": "September 2026",
          "readTime": "4 min read",
          "imageFirst": "false",
          "image": {
            "alt": "",
            "height": 1620,
            "src": "/assets/blog-content-systems.jpg",
            "width": 2880
          },
          "description": {
            "emphasis": "And how bringing content into Git creates a faster, safer, more connected way to publish.",
            "emphasisFirst": "false",
            "supporting": "Talking about modern content workflows, why they fall apart across CMSs, docs, chats, and code. "
          },
          "compactDescription": {
            "emphasis": "And how bringing content into Git creates a faster, safer, more connected way to publish.",
            "emphasisFirst": "false",
            "supporting": "Talking about modern content workflows, why they fall apart across CMSs, docs, chats, and code. "
          }
        },
        {
          "id": "edit-repeat",
          "url": "/blog/edit-what-you-see",
          "title": "Edit what you see, without losing control of your code",
          "date": "September 2026",
          "readTime": "4 min read",
          "imageFirst": "true",
          "image": {
            "alt": "",
            "height": 1620,
            "src": "/assets/blog-edit-repeat.jpg",
            "width": 2880
          },
          "description": {
            "emphasis": "Exploring how visual editing can give marketers the freedom to move faster without sacrificing developer control.",
            "emphasisFirst": "true",
            "supporting": " Keeping code, components, design systems, Git history, and Astro performance intact while giving teams a simpler path from idea to published page."
          },
          "compactDescription": {
            "emphasis": "Exploring how visual editing can give marketers the freedom to move faster without sacrificing developer control.",
            "emphasisFirst": "true",
            "supporting": " Keeping code, components, design systems, Git history, and Astro performance intact while giving teams a simpler path from idea to published page."
          }
        }
      ]
    }
  }

export const ArticlePageSectionsBlock: ComponentConfig<ArticlePageSectionsBlockProps> =
  {
    label: "Article page sections",
    fields: {
      hero: {
        type: "object",
        objectFields: {
          author: { type: "text" },
          authorLabel: { type: "text" },
          breadcrumbs: {
            type: "array",
            arrayFields: {
              text: { type: "text" },
            },
            getItemSummary: (item) => item.text,
          },
          date: { type: "text" },
          description: { type: "textarea" },
          title: { type: "text" },
        },
      },
      cover: articleImageFields,
      body: {
        type: "object",
        objectFields: {
          closing: { type: "textarea" },
          intro: textListFields,
          practiceHeading: { type: "text" },
          practiceIntro: { type: "textarea" },
          sections: {
            type: "array",
            arrayFields: {
              id: { type: "text" },
              label: { type: "text" },
              title: { type: "text" },
              tocTitle: { type: "text" },
              paragraphs: textListFields,
              quote: { type: "textarea" },
              benefits: {
                type: "array",
                arrayFields: {
                  title: { type: "text" },
                  description: { type: "textarea" },
                },
                getItemSummary: (item) => item.title,
              },
            },
            getItemSummary: (item) => item.title,
            // Puck's add-item flow uses defaultItemProps ?? {}; without this
            // the new section's `paragraphs`/`benefits` are undefined and the
            // mapper crashes.
            defaultItemProps: {
              id: "",
              label: "",
              title: "",
              tocTitle: "",
              paragraphs: [],
              quote: "",
              benefits: [],
            },
          },
          steps: textListFields,
          tocLabel: { type: "text" },
        },
      },
      related: {
        type: "object",
        objectFields: {
          heading: { type: "text" },
          moreLabel: { type: "text" },
          moreUrl: { type: "text" },
          stories: {
            type: "array",
            arrayFields: {
              id: { type: "text" },
              url: { type: "text" },
              title: { type: "text" },
              date: { type: "text" },
              readTime: { type: "text" },
              imageFirst: {
                type: "radio",
                options: [
                  { label: "Image first", value: "true" },
                  { label: "Image last", value: "false" },
                ],
              },
              image: articleImageFields,
              description: articleDescriptionFields,
              compactDescription: articleDescriptionFields,
            },
            getItemSummary: (item) => item.title,
            // Puck's add-item flow uses defaultItemProps ?? {}; without this
            // the new story's description objects are undefined and the
            // mapper crashes.
            defaultItemProps: {
              id: "",
              url: "/",
              title: "",
              date: "",
              readTime: "",
              imageFirst: "true",
              image: { alt: "", height: 0, src: "", width: 0 },
              description: {
                emphasis: "",
                emphasisFirst: "true",
                supporting: "",
              },
              compactDescription: {
                emphasis: "",
                emphasisFirst: "true",
                supporting: "",
              },
            },
          },
        },
      },
    },
    defaultProps: articlePageSectionsDefaultProps,
    render: (props: ArticlePageSectionsBlockProps) => (
      <ArticlePageSections content={mapArticlePageSectionsProps(props)} />
    ),
  }
