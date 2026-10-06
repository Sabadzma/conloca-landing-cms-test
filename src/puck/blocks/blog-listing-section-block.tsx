import type { ComponentConfig } from "@puckeditor/core"
import {
  BlogListingSection,
  type BlogArticle,
  type BlogDescription,
  type BlogListingContent,
} from "@/sections/blog-listing-section"

// Puck-storable props for BlogListingSection. emphasisFirst/compactDescription
// optional flags flatten to radio strings; an empty compactDescription (both
// strings empty) maps back to an absent compactDescription.
export interface BlogListingDescriptionProps {
  emphasis: string
  emphasisFirst: "true" | "false"
  supporting: string
}

export interface BlogListingArticleProps {
  id: string
  url: string
  title: string
  date: string
  readTime: string
  layout: "full" | "split"
  image: { src: string; width: number; height: number }
  description: BlogListingDescriptionProps
  compactDescription: BlogListingDescriptionProps
}

export interface BlogListingSectionBlockProps {
  navigationLabel: string
  articles: BlogListingArticleProps[]
}

// Subset of the Conloca DataContext the pages data binding injects at resolve
// time (see routing.dataBindings.pages in astro.config.ts).
interface InjectedPage {
  pathname: string
  title?: string
}

function readInjectedPages(metadata: unknown): InjectedPage[] {
  if (typeof metadata !== "object" || metadata === null || !("pages" in metadata))
    return []
  const { pages } = metadata
  if (!Array.isArray(pages)) return []
  return pages.filter((page): page is InjectedPage => {
    if (typeof page !== "object" || page === null || !("pathname" in page))
      return false
    return typeof page.pathname === "string"
  })
}

function mapDescription(
  props: BlogListingDescriptionProps,
): BlogDescription | undefined {
  if (props.emphasis === "" && props.supporting === "") return undefined
  return {
    emphasis: props.emphasis,
    ...(props.emphasisFirst === "true" ? { emphasisFirst: true } : {}),
    supporting: props.supporting,
  }
}

export function mapBlogListingSectionProps(
  props: BlogListingSectionBlockProps,
): BlogListingContent {
  return {
    navigationLabel: props.navigationLabel,
    articles: props.articles.map((article): BlogArticle => {
      const description = mapDescription(article.description)
      const compactDescription = mapDescription(article.compactDescription)
      return {
        id: article.id,
        url: article.url,
        title: article.title,
        date: article.date,
        readTime: article.readTime,
        layout: article.layout,
        image: article.image,
        // description is required by BlogArticle; the editor enforces
        // non-empty fields, the fallback keeps hand-edited content renderable.
        ...(description
          ? { description }
          : { description: { emphasis: "", supporting: "" } }),
        ...(compactDescription ? { compactDescription } : {}),
      }
    }),
  }
}

const descriptionFields = {
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

export const BlogListingSectionBlock: ComponentConfig<BlogListingSectionBlockProps> =
  {
    label: "Blog listing section",
    fields: {
      navigationLabel: { type: "text" },
      articles: {
        type: "array",
        arrayFields: {
          id: { type: "text" },
          url: { type: "text" },
          title: { type: "text" },
          date: { type: "text" },
          readTime: { type: "text" },
          layout: {
            type: "radio",
            options: [
              { label: "Full width", value: "full" },
              { label: "Split", value: "split" },
            ],
          },
          image: {
            type: "object",
            objectFields: {
              src: { type: "text" },
              width: { type: "number" },
              height: { type: "number" },
            },
          },
          description: { ...descriptionFields, label: "Description" },
          compactDescription: {
            ...descriptionFields,
            label: "Compact description (leave empty to omit)",
          },
        },
        getItemSummary: (item) => item.title,
        // Puck's add-item flow uses defaultItemProps ?? {}; without this the
        // new article's description objects are undefined and the mapper
        // crashes. Empty description strings mean "omit" (see mapDescription).
        defaultItemProps: {
          id: "",
          url: "/",
          title: "",
          date: "",
          readTime: "",
          layout: "split",
          image: { src: "", width: 0, height: 0 },
          description: { emphasis: "", emphasisFirst: "true", supporting: "" },
          compactDescription: {
            emphasis: "",
            emphasisFirst: "true",
            supporting: "",
          },
        },
      },
    },
    defaultProps: {
      navigationLabel: "Blog articles",
      articles: [
        {
          id: "content-systems",
          url: "/blog/one-change-across-three-systems",
          title: "One change shouldn't get lost across three systems",
          date: "September 2026",
          readTime: "4 min read",
          layout: "full",
          image: {
            height: 1620,
            src: "/assets/blog-content-systems.jpg",
            width: 2880,
          },
          description: {
            emphasis:
              "And how bringing content into Git creates a faster, safer, more connected way to publish.",
            emphasisFirst: "false",
            supporting:
              "Talking about modern content workflows, why they fall apart across CMSs, docs, chats, and code. ",
          },
          compactDescription: {
            emphasis: "",
            emphasisFirst: "false",
            supporting: "",
          },
        },
        {
          id: "edit-control",
          url: "/blog/edit-what-you-see",
          title: "Edit what you see, without losing control of your code",
          date: "September 2026",
          readTime: "4 min read",
          layout: "split",
          image: {
            height: 1620,
            src: "/assets/blog-edit-control.jpg",
            width: 2880,
          },
          description: {
            emphasis:
              "Exploring how visual editing can give marketers the freedom to move faster without sacrificing developer control.",
            emphasisFirst: "true",
            supporting:
              " Keeping code, components, design systems, Git history, and Astro performance intact while giving teams a simpler path from idea to published page.",
          },
          compactDescription: {
            emphasis:
              "And how bringing content into Git creates a faster, safer, more connected way to publish.",
            emphasisFirst: "false",
            supporting:
              "Talking about modern content workflows, why they fall apart across CMSs, docs, chats, and code. ",
          },
        },
        {
          id: "systems-repeat",
          url: "/blog/one-change-across-three-systems",
          title: "One change shouldn't get lost across three systems",
          date: "September 2026",
          readTime: "4 min read",
          layout: "full",
          image: {
            height: 1620,
            src: "/assets/blog-systems-repeat.jpg",
            width: 2880,
          },
          description: {
            emphasis:
              "And how bringing content into Git creates a faster, safer, more connected way to publish.",
            emphasisFirst: "false",
            supporting:
              "Talking about modern content workflows, why they fall apart across CMSs, docs, chats, and code. ",
          },
          compactDescription: {
            emphasis: "",
            emphasisFirst: "false",
            supporting: "",
          },
        },
        {
          id: "edit-repeat",
          url: "/blog/edit-what-you-see",
          title: "Edit what you see, without losing control of your code",
          date: "September 2026",
          readTime: "4 min read",
          layout: "split",
          image: {
            height: 1620,
            src: "/assets/blog-edit-repeat.jpg",
            width: 2880,
          },
          description: {
            emphasis:
              "Exploring how visual editing can give marketers the freedom to move faster without sacrificing developer control.",
            emphasisFirst: "true",
            supporting:
              " Keeping code, components, design systems, Git history, and Astro performance intact while giving teams a simpler path from idea to published page.",
          },
          compactDescription: {
            emphasis:
              "And how bringing content into Git creates a faster, safer, more connected way to publish.",
            emphasisFirst: "false",
            supporting:
              "Talking about modern content workflows, why they fall apart across CMSs, docs, chats, and code. ",
          },
        },
      ],
    },
    // The pages data binding injects posts under metadata.pages; card titles
    // track the CMS page titles when the card URL matches a post pathname.
    // The card set itself is fully content-owned (covers listing-only cards).
    resolveData: (data, { metadata }) => {
      const pages = readInjectedPages(metadata)
      if (pages.length === 0) return { props: data.props }
      const titleByPathname: Record<string, string | undefined> =
        Object.fromEntries(pages.map((page) => [page.pathname, page.title]))
      return {
        props: {
          ...data.props,
          articles: (data.props?.articles ?? []).map((article) => {
            const title = titleByPathname[article.url]
            return title ? { ...article, title } : article
          }),
        },
      }
    },
    render: (props: BlogListingSectionBlockProps) => (
      <BlogListingSection content={mapBlogListingSectionProps(props)} />
    ),
  }
