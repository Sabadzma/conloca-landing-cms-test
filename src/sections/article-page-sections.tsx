import { conlocaButtonVariants } from "@conloca-design-system/components/conloca-button"
import {
  ConlocaProse,
  type ConlocaProseBlock,
} from "@conloca-design-system/components/conloca-prose"
import { ConlocaToc } from "@conloca-design-system/components/conloca-toc"
import { useMemo } from "react"
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

export interface ArticlePageSectionsProps {
  content: ArticlePageContent
}

function Description({ content }: { content: ArticleDescription }) {
  if (content.emphasisFirst) {
    return (
      <>
        <strong>{content.emphasis}</strong>
        {content.supporting}
      </>
    )
  }

  return (
    <>
      {content.supporting}
      <strong>{content.emphasis}</strong>
    </>
  )
}


function RelatedStoryCard({ story }: { story: ArticleRelatedStory }) {
  return (
    <article
      className={
        "article-related-card" +
        (story.imageFirst ? " article-related-card--image-first" : "")
      }
    >
      <a className="article-related-card__link" href={story.url}>
        <img
          alt={story.image.alt}
          className="article-related-card__image"
          height={story.image.height}
          src={story.image.src}
          width={story.image.width}
        />
        <div className="article-related-card__copy">
          <p className="article-related-card__meta article-related-card__meta--wide">
            <span>{story.readTime}</span>
            <span>{story.date}</span>
          </p>
          <p className="article-related-card__meta article-related-card__meta--compact">
            <span>{story.readTime}</span>
            <span aria-hidden="true">/</span>
            <span>{story.date}</span>
          </p>
          <h3>{story.title}</h3>
        </div>
        <p className="article-related-card__description article-related-card__description--wide">
          <Description content={story.description} />
        </p>
        <p className="article-related-card__description article-related-card__description--compact">
          <Description content={story.compactDescription} />
        </p>
      </a>
    </article>
  )
}

function articleSectionBlocks(section: ArticleBodySection): ConlocaProseBlock[] {
  const blocks: ConlocaProseBlock[] = [
    { type: "eyebrow", text: section.label },
    { type: "heading", text: section.title },
    ...section.paragraphs.map(
      (text): ConlocaProseBlock => ({ type: "paragraph", text }),
    ),
  ]

  if (section.benefits) {
    blocks.push({
      type: "table",
      items: section.benefits.map((benefit) => ({
        title: benefit.title,
        text: benefit.description,
      })),
    })
  }

  if (section.quote) {
    blocks.push({ type: "paragraph", text: section.quote })
  }

  return blocks
}

function articleBodyBlocks(body: ArticleBodyContent): ConlocaProseBlock[] {
  return [
    {
      type: "group",
      blocks: body.intro.map(
        (text): ConlocaProseBlock => ({ type: "paragraph", text }),
      ),
    },
    {
      type: "group",
      blocks: [
        { type: "heading", text: body.practiceHeading, weight: "semibold" },
        {
          type: "list",
          items: body.steps.map((step) => step.text),
        },
      ],
    },
    { type: "paragraph", text: body.practiceIntro },
    ...body.sections.map(
      (section): ConlocaProseBlock => ({
        type: "section",
        id: section.id,
        blocks: articleSectionBlocks(section),
      }),
    ),
    { type: "paragraph", text: body.closing },
  ]
}

export function ArticlePageSections({ content }: ArticlePageSectionsProps) {
  const tocItems = useMemo(
    () =>
      content.body.sections.map((section) => ({
        id: section.id,
        title: section.tocTitle,
      })),
    [content.body.sections],
  )

  const bodyBlocks = useMemo(
    () => articleBodyBlocks(content.body),
    [content.body],
  )

  return (
    <>
      <section className="article-hero" aria-labelledby="article-heading">
        <div className="article-hero__meta">
          <p className="article-hero__date">{content.hero.date}</p>
          <nav aria-label="Breadcrumb" className="article-hero__breadcrumbs">
            <ol>
              {content.hero.breadcrumbs.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </nav>
        </div>
        <h1 id="article-heading">{content.hero.title}</h1>
        <div className="article-hero__footer">
          <p className="article-hero__description">{content.hero.description}</p>
          <div className="article-hero__byline">
            <div className="article-hero__author">
              <p className="article-hero__author-label">
                {content.hero.authorLabel}
              </p>
              <p className="article-hero__author-name">{content.hero.author}</p>
            </div>
            <p className="article-hero__date-compact">{content.hero.date}</p>
          </div>
        </div>
      </section>

      <figure className="article-cover">
        <div className="article-cover__frame">
          <img
            alt={content.cover.alt}
            height={content.cover.height}
            src={content.cover.src}
            width={content.cover.width}
          />
        </div>
      </figure>

      <div className="article-body">
        <ConlocaToc className="article-toc" items={tocItems} label={content.body.tocLabel} />

        <article aria-labelledby="article-heading" className="article-content">
          <ConlocaProse blocks={bodyBlocks} />
        </article>
      </div>

      <section
        aria-labelledby="article-related-heading"
        className="article-related"
      >
        <div className="article-related__header">
          <h2 id="article-related-heading">{content.related.heading}</h2>
          <a
            className={conlocaButtonVariants({
              size: "default",
              variant: "link",
            })}
            data-slot="conloca-button"
            href={content.related.moreUrl}
          >
            {content.related.moreLabel}
          </a>
        </div>
        <div className="article-related__stories">
          {content.related.stories.map((story) => (
            <RelatedStoryCard key={story.id} story={story} />
          ))}
        </div>
      </section>
    </>
  )
}
