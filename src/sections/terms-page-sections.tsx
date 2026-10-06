import {
  ConlocaProse,
  type ConlocaProseBlock,
} from "@conloca-design-system/components/conloca-prose"
import { ConlocaToc } from "@conloca-design-system/components/conloca-toc"
import { useMemo } from "react"

export interface TermsHeroContent {
  breadcrumbs: readonly string[]
  effectiveDate: string
  effectiveDateLabel: string
  documentLabel: string
  documentName: string
  title: string
  description: string
}

export interface TermsDetail {
  term: string
  definition: string
}

export interface TermsSubsection {
  number: string
  title: string
  paragraphs: readonly string[]
  items?: readonly string[]
}

export type TermsBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: readonly string[] }
  | { type: "definitions"; items: readonly TermsDetail[] }
  | { type: "subsection"; subsection: TermsSubsection }

export interface TermsSection {
  id: string
  tocTitle: string
  title: string
  blocks: readonly TermsBlock[]
}

export interface TermsPageContent {
  hero: TermsHeroContent
  body: {
    tocLabel: string
    intro: {
      paragraphs: readonly string[]
      details: readonly TermsDetail[]
    }
    sections: readonly TermsSection[]
  }
}

export interface TermsPageSectionsProps {
  content: TermsPageContent
}

function termsSubsectionBlocks(subsection: TermsSubsection): ConlocaProseBlock {
  return {
    type: "group",
    blocks: [
      {
        type: "eyebrow",
        text: `${subsection.number} — ${subsection.title}`,
      },
      ...subsection.paragraphs.map(
        (text): ConlocaProseBlock => ({ type: "paragraph", text }),
      ),
      ...(subsection.items
        ? [
            {
              type: "list",
              items: subsection.items,
              marker: "alpha",
            } satisfies ConlocaProseBlock,
          ]
        : []),
    ],
  }
}

function termsProseBlock(block: TermsBlock): ConlocaProseBlock {
  switch (block.type) {
    case "paragraph":
      return { type: "paragraph", text: block.text }
    case "list":
      return { type: "list", items: block.items, marker: "alpha" }
    case "definitions":
      return {
        type: "table",
        items: block.items.map((item) => ({
          title: item.term,
          text: item.definition,
        })),
      }
    case "subsection":
      return termsSubsectionBlocks(block.subsection)
  }
}

function termsBodyBlocks(body: TermsPageContent["body"]): ConlocaProseBlock[] {
  return [
    {
      type: "group",
      blocks: [
        ...body.intro.paragraphs.map(
          (text): ConlocaProseBlock => ({ type: "paragraph", text }),
        ),
        {
          type: "table",
          items: body.intro.details.map((detail) => ({
            title: detail.term,
            text: detail.definition,
          })),
        },
      ],
    },
    ...body.sections.map(
      (section: TermsSection, index): ConlocaProseBlock => ({
        type: "section",
        id: section.id,
        blocks: [
          {
            type: "eyebrow",
            text: `Section ${String(index + 1).padStart(2, "0")}`,
          },
          { type: "heading", text: section.title },
          ...section.blocks.map(termsProseBlock),
        ],
      }),
    ),
  ]
}

export function TermsPageSections({ content }: TermsPageSectionsProps) {
  const tocItems = useMemo(
    () =>
      content.body.sections.map((section) => ({
        id: section.id,
        title: section.tocTitle,
      })),
    [content.body.sections],
  )

  const bodyBlocks = useMemo(
    () => termsBodyBlocks(content.body),
    [content.body],
  )
  return (
    <>
      <section className="terms-hero" aria-labelledby="terms-heading">
        <div className="terms-hero__meta">
          <p className="terms-hero__date">
            <span>{content.hero.effectiveDateLabel}</span>
            <span>{content.hero.effectiveDate}</span>
          </p>
          <nav aria-label="Breadcrumb" className="terms-hero__breadcrumbs">
            <ol>
              {content.hero.breadcrumbs.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </nav>
        </div>
        <h1 id="terms-heading">{content.hero.title}</h1>
        <div className="terms-hero__footer">
          <p className="terms-hero__description">{content.hero.description}</p>
          <div className="terms-hero__document">
            <p className="terms-hero__document-label">
              {content.hero.documentLabel}
            </p>
            <p className="terms-hero__document-name">
              {content.hero.documentName}
            </p>
          </div>
        </div>
      </section>

      <div className="terms-body">
        <ConlocaToc className="terms-toc" items={tocItems} label={content.body.tocLabel} />
        <article aria-labelledby="terms-heading" className="terms-content">
          <ConlocaProse blocks={bodyBlocks} />
        </article>
      </div>
    </>
  )
}
